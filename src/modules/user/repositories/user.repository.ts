import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TypeORMRepository } from '../../../database';
import { EUserStatus } from '../constants/user.enum';
import { UserEntity } from '../entities/user.entity';

export class UserRepository extends TypeORMRepository<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    repository: Repository<UserEntity>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async findByEmail(email: string): Promise<UserEntity> {
    return this.findOne({
      where: {
        email,
        status: EUserStatus.ACTIVE,
      },
    });
  }
}
