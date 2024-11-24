import { Column, Entity, Index, ManyToMany, ManyToOne } from 'typeorm';

import { ActionEntity } from './action.entity';
import { ModuleEntity } from './module.entity';
import { RoleEntity } from './role.entity';
import { AbstractEntity } from '../../../database';

@Entity({ name: 'permissions' })
export class PermissionEntity extends AbstractEntity {
  @Column({ nullable: true })
  name: string;

  @Index({
    unique: true,
  })
  @Column({ nullable: false })
  code: string;

  @Column({ type: 'text' })
  description: string;

  @ManyToMany(() => RoleEntity, (role) => role.permissions)
  roles: RoleEntity[];

  @ManyToOne(() => ActionEntity)
  action: ActionEntity;

  @ManyToOne(() => ModuleEntity)
  module: ModuleEntity;
}
