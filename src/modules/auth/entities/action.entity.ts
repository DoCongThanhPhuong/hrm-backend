import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '../../../database';

@Entity({ name: 'actions' })
export class ActionEntity extends AbstractEntity {
  @Column({ nullable: true })
  name: string;

  @Column({ nullable: false, unique: true })
  code: string;
}
