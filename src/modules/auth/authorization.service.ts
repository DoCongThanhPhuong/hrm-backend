import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DiscoveryService, MetadataScanner } from '@nestjs/core';
import { OmitType } from '@nestjs/swagger';
import { plainToClass, plainToInstance } from 'class-transformer';
import { Command, Console } from 'nestjs-console';
import { Brackets, In, Not } from 'typeorm';

import { PERMISSIONS_KEY } from './constants/auth.constant';
import { EModule } from './constants/auth.enum';
import {
  AssignRoleDto,
  CreateRoleDto,
  ListRolePaginationDto,
  UpdateRoleDto,
} from './dto';
import { PermissionEntity, RoleEntity } from './entities';
import { AuthFactoryHelper } from './helpers/auth-factory.helper';
import { IHasPermission } from './interfaces';
import {
  ActionRepository,
  ModuleRepository,
  PermissionRepository,
  RoleRepository,
} from './repositories';
import { Environment } from '../../constants';
import { IResponseMessage } from '../../interfaces';
import { UserService } from '../user/user.service';

@Console()
@Injectable()
export class AuthorizationService implements OnApplicationBootstrap {
  constructor(
    private readonly discover: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
    private readonly configService: ConfigService,
    private readonly authFactory: AuthFactoryHelper,
    private readonly roleRepository: RoleRepository,
    private readonly permissionRepository: PermissionRepository,
    private readonly moduleRepository: ModuleRepository,
    private readonly actionRepository: ActionRepository,
    @Inject(forwardRef(() => UserService))
    private readonly usersService: UserService,
  ) {}

  async onApplicationBootstrap() {
    this.configService.get<string>('environment') === Environment.local &&
      (await this._syncPermissions());
  }

  async getRole(roleId: string): Promise<RoleEntity> {
    const role = await this.roleRepository.findOne({
      where: {
        id: roleId,
      },
      relations: ['permissions'],
    });

    if (!role) throw new BadRequestException('AUTH::INVALID_ROLE');

    return role;
  }

  async getRoleDetail(roleId: string) {
    const role = await this.getRole(roleId);

    return plainToInstance(
      OmitType(RoleEntity, ['updatedAt', 'createdAt']),
      role,
    );
  }

  async deleteRole(roleId: string): Promise<IResponseMessage> {
    const role = await this.getRole(roleId);

    if (role.totalUser > 0)
      throw new BadRequestException('AUTH::ROLE_HAS_USER');

    await this.roleRepository.softDelete(roleId);

    return this.authFactory.resFactory('AUTH::DELETE_ROLE_SUCCESSFULLY');
  }

  async getDefaultRole(): Promise<RoleEntity> {
    return await this.roleRepository.findOne({
      where: {
        isDefault: true,
      },
      relations: ['permissions'],
    });
  }

  async getListRoles(query: ListRolePaginationDto) {
    const { page, size, sort, search } = query;

    const selectFields: string[] = [
      'ro.id',
      'ro.name',
      'ro.description',
      'ro.createdAt',
      'ro.totalUser',
    ];
    const qb = this.roleRepository
      .createQueryBuilder('ro')
      .select(selectFields);

    if (search) {
      qb.andWhere(
        new Brackets((sub_qb) => {
          sub_qb
            .where('ro.name ILIKE :search')
            .orWhere('ro.description ILIKE :search');
        }),
      ).setParameters({
        search: `%${search}%`,
      });
    }

    qb.addOrderBy('ro.createdAt', sort ? sort : 'DESC');

    const result = await this.roleRepository.list({
      queryBuilder: qb,
      page: page,
      size: size,
    });

    return {
      ...result,
      data: result.data.map((role) =>
        plainToClass(OmitType(RoleEntity, ['createdAt']), role),
      ),
    };
  }

  async getPermissions(): Promise<PermissionEntity[]> {
    return await this.permissionRepository
      .createQueryBuilder('pms')
      .leftJoinAndSelect('pms.module', 'mo', 'pms.module = mo.id')
      .leftJoinAndSelect('pms.action', 'ac', 'pms.action = ac.id')
      .orderBy('pms.code', 'ASC')
      .addOrderBy('mo.name', 'ASC')
      .getMany();
  }

  async creatRole(
    createRoleDto: CreateRoleDto,
    isDefault = false,
  ): Promise<RoleEntity> {
    const permissions = await this.permissionRepository.find({
      where: {
        id: In(createRoleDto.permissions),
      },
    });

    if (!permissions.length)
      throw new BadRequestException('AUTH::INVALID_PERMISSION_CODE');

    const newRole = this.roleRepository.create({
      name: createRoleDto.name,
      description: createRoleDto.description || '',
      permissions: permissions,
      isDefault,
    });

    await this.roleRepository.save(newRole);

    return newRole;
  }

  async updateRole(
    roleId: string,
    payload: UpdateRoleDto,
  ): Promise<RoleEntity> {
    const role = await this.getRole(roleId);

    if (payload.permissions) {
      const permissions = await this.permissionRepository.find({
        where: {
          id: In(payload.permissions),
        },
      });

      if (!permissions.length)
        throw new BadRequestException('AUTH::INVALID_PERMISSION_CODE');

      Object.assign(role, {
        ...payload,
        permissions,
      });
    }

    await this.roleRepository.save(role);

    return role;
  }

  async assignRole(payload: AssignRoleDto): Promise<IResponseMessage> {
    const role = await this.getRole(payload.roleId);

    const users = await this.usersService.getUsers(payload.users);

    if (!users.length)
      throw new BadRequestException('AUTH::INVALID_LIST_USER_ASSIGNED');

    await this.usersService.updateRole(
      users.map((user) => user.id),
      role,
    );

    return this.authFactory.resFactory('AUTH::CREATE_ROLE_SUCCESSFULLY');
  }

  async hasPermission(payload: IHasPermission): Promise<boolean> {
    const masterPms = this._getMasterPermissions(payload.permissionCodes);

    const permissionCodesMatch =
      await this.roleRepository.getUserMatchPermission(payload.userId, [
        ...payload.permissionCodes,
        ...masterPms,
      ]);

    return payload.isRequiredAllPermissions
      ? this._computeRequiredAllPermissions(
          payload.permissionCodes,
          masterPms,
          permissionCodesMatch,
        )
      : permissionCodesMatch.length > 0;
  }

  async getCurrentUserPermissions(id: string): Promise<string[]> {
    const currentUserPermissions = await this.permissionRepository
      .createQueryBuilder('pms')
      .leftJoin('pms.roles', 'roles')
      .leftJoin('roles.users', 'users')
      .select('pms.code')
      .where('users.id = :id', { id })
      .getMany();

    return this._getPermissionCodes(currentUserPermissions);
  }

  _getMasterPermissions(permissionCodes: string[]): string[] {
    const masterPermissionCodes: Set<string> = new Set(['*::*']);

    permissionCodes.forEach((permissionCode) => {
      masterPermissionCodes.add(`${permissionCode.split('::')[0]}::*`);
    });

    return Array.from(masterPermissionCodes);
  }

  private async _getPermissionCodes(
    currentPermissions: PermissionEntity[],
  ): Promise<string[]> {
    const permissionCodes: string[] = currentPermissions.map(
      (permission) => permission.code,
    );

    if (permissionCodes.includes('*::*')) {
      const permissions = await this.permissionRepository.findBy({
        code: Not('*::*'),
      });
      return permissions.map((permission) => permission.code);
    }

    return permissionCodes;
  }

  private _computeRequiredAllPermissions(
    reqPms: string[],
    masterPms: string[],
    matchPms: string[],
  ): boolean {
    // If user have full permission
    if (matchPms.includes('*::*')) return true;

    // If user haven't full permission, remove it from master permission list
    masterPms = masterPms.filter((pms) => pms !== '*::*');

    // Check master permission list equals match permission list
    if (masterPms.reduce((cur, next) => cur && matchPms.includes(next), true))
      return true;

    // Get all master permission in match permissions
    const masterPmsMatch = matchPms.filter((item) => item.match(/^.*::\*$/));

    // Remove permission under master permission match in permission match
    reqPms = reqPms.filter(
      (pms) => !masterPmsMatch.includes(`${pms.split('::')[0]}::*`),
    );

    if (!reqPms.length) return true;

    // Check if all request permission in match permission
    return reqPms.reduce((cur, next) => cur && matchPms.includes(next), true);
  }

  private async _syncPermissions() {
    const permissionCodes = this._scanPermissionCodes();
    const permissionEntities: PermissionEntity[] = await Promise.all(
      permissionCodes.map(async (permissionCode) =>
        this._makePermissionFromCode(permissionCode),
      ),
    );
    return this.permissionRepository.upsert(permissionEntities);
  }

  @Command({
    command: 'sync-authorization',
    description:
      'Scan permissions in the system and save them in the database.',
  })
  private async _syncPermissionInSystem(): Promise<void> {
    console.time('Total run time: ');
    const result = await this._syncPermissions();
    console.log(
      `Successfully scanned and synchronized ${result.raw.length} permissions in the system.`,
    );
    console.timeEnd('Total run time: ');

    process.exit(0);
  }

  private _scanPermissionCodes(): string[] {
    const permissionCodes: Set<string> = new Set(['*::*']);
    const controllers = this.discover.getControllers();

    controllers.forEach((controller) => {
      const prototype = Object.getPrototypeOf(controller.instance);
      const controllerMethods =
        this.metadataScanner.getAllMethodNames(prototype);
      controllerMethods.forEach((method: string) => {
        const handler = prototype[method];
        const decorators = Reflect.getMetadataKeys(handler);
        if (decorators.includes(PERMISSIONS_KEY)) {
          const moduleMasterRoles: Set<string> = new Set();
          const controllerPermissionCodes =
            Reflect.getMetadata(PERMISSIONS_KEY, handler)?.permissionCodes ||
            [];

          controllerPermissionCodes.forEach((permissionCode) => {
            moduleMasterRoles.add(`${permissionCode.split('::')[0]}::*`);
            permissionCodes.add(permissionCode);
          });

          if (moduleMasterRoles.size)
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            permissionCodes.add(...Array.from(moduleMasterRoles));
        }
      });
    });
    return Array.from(permissionCodes);
  }

  private async _makePermissionFromCode(
    permissionCode: string,
  ): Promise<PermissionEntity> {
    const permissionInfo = this.authFactory.genPermissionInfo(permissionCode);

    const [module, action] = await Promise.all([
      this.moduleRepository.upsertModule(
        this.moduleRepository.create({
          name:
            permissionCode.split('::')[0] === '*'
              ? 'All Module'
              : this.authFactory.normalizeSentence(
                  permissionCode.split('::')[0],
                ),
          code: permissionCode.split('::')[0],
        }),
      ),
      this.actionRepository.upsertAction(
        this.actionRepository.create({
          name:
            permissionCode.split('::')[1] === '*'
              ? 'Allow All'
              : this.authFactory.normalizeSentence(
                  permissionCode.split('::')[1],
                ),
          code: permissionCode.split('::')[1],
        }),
      ),
    ]);

    return this.permissionRepository.create({
      ...permissionInfo,
      module,
      action,
    });
  }

  @Command({
    command: 'generate-admin-role',
    description: 'Generate role for super admin.',
    options: [
      {
        flags: '--name',
        defaultValue: 'Super admin',
        description: 'Role name. Default is Super admin.',
      },
    ],
  })
  private async _genSuperAdminRole(input): Promise<void> {
    console.time('Total run time: ');
    const superAdminPms = await this.permissionRepository.findOne({
      where: {
        code: '*::*',
      },
    });

    const role = await this.creatRole({
      name: input.name,
      description: `${input.name} role with full power. Generate by command system.`,
      permissions: [superAdminPms.id],
    });

    console.log(`Successfully generate ${input.name} role for the system.`);

    const email = 'admin@admin.com';
    const password = this.authFactory.passwordFactory();

    await this.usersService.create({
      name: 'Super Admin',
      role: role.id,
      description: 'Super admin of the system. Generate by command system.',
      email: email,
      password: password,
    });

    console.log(`.=========================================================.`);
    console.log(`|     Successfully generate super admin for the system.   |`);
    console.log(`|     Super admin email: ${email}                  | `);
    console.log(`|     Super admin password: ${password}                    |`);
    console.log(`.=========================================================.`);

    console.timeEnd('Total run time: ');

    process.exit(0);
  }

  @Command({
    command: 'generate-default-role',
    description: 'Generate role for default.',
    options: [
      {
        flags: '--name',
        defaultValue: 'Default',
        description: 'Role name. Default is Default role.',
      },
    ],
  })
  private async _genDefaultRole(input): Promise<void> {
    console.time('Total run time: ');
    const defaultRolePms = await this.permissionRepository.findOne({
      where: {
        code: `${EModule.PROFILE_MANAGEMENT}::*`,
      },
    });

    await this.creatRole(
      {
        name: input.name,
        description: `${input.name} role with default access to user. Generate by command system.`,
        permissions: [defaultRolePms.id],
      },
      true,
    );

    console.log(`Successfully generate ${input.name} role for the system.`);
    console.timeEnd('Total run time: ');

    process.exit(0);
  }
}
