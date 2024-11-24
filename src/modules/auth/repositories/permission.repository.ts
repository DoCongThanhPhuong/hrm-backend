import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TypeORMRepository } from '../../../database';
import { PermissionEntity } from '../entities';

export class PermissionRepository extends TypeORMRepository<PermissionEntity> {
  constructor(
    @InjectRepository(PermissionEntity)
    repository: Repository<PermissionEntity>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async upsert(permissionEntities: PermissionEntity[]) {
    return this.createQueryBuilder()
      .insert()
      .values(permissionEntities)
      .orIgnore('("code")')
      .execute();
  }
}
