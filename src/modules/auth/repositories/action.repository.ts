import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TypeORMRepository } from '../../../database';
import { ActionEntity, ModuleEntity } from '../entities';

export class ActionRepository extends TypeORMRepository<ActionEntity> {
  constructor(
    @InjectRepository(ActionEntity)
    repository: Repository<ActionEntity>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async upsertAction(action: ActionEntity): Promise<ActionEntity> {
    const result = await this.createQueryBuilder()
      .insert()
      .values(action)
      .returning('*')
      .orIgnore('("code")')
      .execute();

    if (result.raw.length > 0) return result.generatedMaps[0] as ModuleEntity;

    return this.findOne({
      where: {
        code: action.code,
      },
      cache: 30 * 1000,
    });
  }
}
