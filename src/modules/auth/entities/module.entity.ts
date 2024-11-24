import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '../../../database';

@Entity({ name: 'modules' })
export class ModuleEntity extends AbstractEntity {
  @Column({ nullable: true })
  name: string;

  @Column({ nullable: false, unique: true })
  code: string;
}
