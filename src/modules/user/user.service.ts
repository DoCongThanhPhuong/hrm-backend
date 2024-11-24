import { BadRequestException, Injectable } from '@nestjs/common';
import { OmitType } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { Brackets, FindOptionsWhere, In } from 'typeorm';
import { FindOptionsRelationByString } from 'typeorm/browser';
import { FindOptionsRelations } from 'typeorm/find-options/FindOptionsRelations';
import {
  FindOptionsSelect,
  FindOptionsSelectByString,
} from 'typeorm/find-options/FindOptionsSelect';

import { EUserStatus } from './constants/user.enum';
import {
  AdminCreateUserDto,
  AdminUpdateUserDto,
  CreateUserDto,
  UpdateUserDto,
} from './dto';
import { ListUserPaginationDto } from './dto/list-user-pagination.dto';
import { UserEntity } from './entities/user.entity';
import { UserFactoryHelper } from './helpers/user-factory.helper';
import { UserRepository } from './repositories/user.repository';
import { IResponseMessage } from '../../interfaces';
import { AuthorizationService } from '../auth/authorization.service';
import { RoleEntity } from '../auth/entities';
// import { MailClientService } from '../mail-client/mail-client.service';

@Injectable()
export class UserService {
  constructor(
    private readonly factory: UserFactoryHelper,
    private readonly userRepository: UserRepository,
    private readonly authorizationService: AuthorizationService,
    // private readonly mailClientService: MailClientService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { email } = createUserDto;

    const userExisted = await this.userRepository.findByEmail(email);

    if (userExisted) {
      throw new BadRequestException('USER::EMAIL_IS_EXISTED');
    }

    let role: RoleEntity;
    if (createUserDto.role) {
      role = await this.authorizationService.getRole(createUserDto.role);
    } else {
      role = await this.authorizationService.getDefaultRole();
    }

    Object.assign(createUserDto, {
      role,
    });

    // FIXME: This function need refactor
    return this.userRepository.save(
      this.userRepository.create(createUserDto as unknown as UserEntity),
    );
  }

  async getListUser(query: ListUserPaginationDto) {
    const { page, size, status, search, role } = query;

    const selectFields: string[] = [
      'usr.id',
      'usr.name',
      'usr.phone',
      'usr.company',
      'usr.description',
      'usr.lastUpdatePasswordAt',
      'usr.createdAt',
      'usr.email',
      'usr.status',
      'ro.name',
      'ro.id',
    ];
    const qb = this.userRepository
      .createQueryBuilder('usr')
      .leftJoinAndSelect('usr.role', 'ro', 'usr.role = ro.id')
      .select(selectFields);

    if (role) qb.andWhere('ro.id = :role', { role });
    if (status) qb.andWhere('usr.status = :status', { status });
    if (search) {
      qb.andWhere(
        new Brackets((sub_qb) => {
          sub_qb
            .where('usr.name ILIKE :search')
            .orWhere('usr.email ILIKE :search')
            .orWhere('usr.company ILIKE :search')
            .orWhere('usr.phone ILIKE :search');
        }),
      ).setParameters({
        search: `%${search}%`,
      });
    }

    qb.addOrderBy('usr.createdAt', 'DESC');

    const result = await this.userRepository.list({
      queryBuilder: qb,
      page: page,
      size: size,
    });

    return {
      ...result,
      data: result.data.map((user) =>
        plainToInstance(
          OmitType(UserEntity, ['lastUpdatePasswordAt', 'createdAt']),
          user,
        ),
      ),
    };
  }

  async findOne(
    id: string,
    relations:
      | FindOptionsRelations<UserEntity>
      | FindOptionsRelationByString = ['role'],
    selectFields:
      | FindOptionsSelect<UserEntity>
      | FindOptionsSelectByString<UserEntity> = [],
  ): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations,
      select: selectFields,
    });

    if (!user) throw new BadRequestException('USER::USER_NOT_EXIST');

    return user;
  }

  async getProfile(id: string) {
    const user = await this.findOne(id);

    return plainToInstance(
      OmitType(UserEntity, ['lastUpdatePasswordAt', 'createdAt']),
      user,
    );
  }

  async findOneBy(
    where: FindOptionsWhere<UserEntity> | FindOptionsWhere<UserEntity>[],
  ): Promise<UserEntity> {
    return await this.userRepository.findOneBy(where);
  }

  async findByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findByEmail(email.toLowerCase());

    if (!user) throw new BadRequestException('USER::USER_NOT_EXIST');

    return user;
  }

  async getUsers(ids: string[]): Promise<UserEntity[]> {
    return this.userRepository.find({
      where: {
        id: In(ids),
      },
    });
  }

  async updateRole(
    users: string[],
    role: RoleEntity | string,
  ): Promise<IResponseMessage> {
    let roleEntity: RoleEntity;
    if (typeof role === 'string') {
      roleEntity = await this.authorizationService.getRole(role);
    } else {
      roleEntity = role;
    }

    await this.userRepository.update(
      {
        id: In(users),
      },
      {
        role: roleEntity,
      },
    );

    return this.factory.resFactory('USER::UPDATE_ROLE_SUCCESS');
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<IResponseMessage> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new BadRequestException('USER::USER_NOT_EXIST');
    }

    await this.userRepository.update(
      id,
      this.userRepository.create(updateUserDto),
    );

    return this.factory.resFactory('USER::UPDATE_PROFILE_SUCCESS');
  }

  async adminUpdate(
    id: string,
    updateUserDto: AdminUpdateUserDto,
  ): Promise<IResponseMessage> {
    const result = await this.update(id, updateUserDto);

    if (updateUserDto.role) await this.updateRole([id], updateUserDto.role);

    return result;
  }

  async updatePassword(
    id: string,
    password: string,
  ): Promise<IResponseMessage> {
    await this.userRepository.update(id, {
      password,
    });

    return this.factory.resFactory('USER::UPDATE_PASSWORD_SUCCESS');
  }

  async changeStatus(id: string): Promise<IResponseMessage> {
    const user = await this.findOne(id);

    await this.userRepository.update(
      {
        id: user.id,
      },
      {
        status:
          user.status === EUserStatus.ACTIVE
            ? EUserStatus.ARCHIVED
            : EUserStatus.ACTIVE,
      },
    );

    return this.factory.resFactory('USER::UPDATE_STATUS_SUCCESS');
  }

  async updateProfile(
    userId: string,
    payload: UpdateUserDto,
  ): Promise<IResponseMessage> {
    await this.userRepository.update(
      userId,
      this.userRepository.create(payload),
    );

    return this.factory.resFactory('USER::UPDATE_PROFILE_SUCCESS');
  }

  async adminCreate(
    adminCreateUserDto: AdminCreateUserDto,
  ): Promise<UserEntity> {
    const password = this.factory.passwordFactory();

    const user = await this.create({
      ...adminCreateUserDto,
      password,
    } as CreateUserDto);

    // await this.mailClientService.sendAdminInviteEmail({
    //   to: user.email,
    //   context: {
    //     pwd: password,
    //     userName: user.name,
    //     companyName: user.company || 'Genesis Growth system',
    //     loginLink: this.factory.getUrlLogin(),
    //   },
    // });

    return plainToInstance(UserEntity, user);
  }

  async getListEmailInSystem(emails: string[]): Promise<string[]> {
    const users = await this.userRepository.find({
      select: ['email'],
      where: {
        email: In(emails),
      },
    });

    return users.map((user) => user.email);
  }
}
