import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TypeORMRepository } from '../../../database';
import { ModuleEntity } from '../entities';

export class ModuleRepository extends TypeORMRepository<ModuleEntity> {
  constructor(
    @InjectRepository(ModuleEntity)
    repository: Repository<ModuleEntity>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async upsertModule(module: ModuleEntity): Promise<ModuleEntity> {
    const result = await this.createQueryBuilder()
      .insert()
      .values(module)
      .returning('*')
      .orIgnore('("code")')
      .execute();

    if (result.raw.length > 0) return result.generatedMaps[0] as ModuleEntity;

    return this.findOne({
      where: {
        code: module.code,
      },
      cache: 30 * 1000,
    });
  }
}
