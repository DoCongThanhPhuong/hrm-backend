import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  VirtualColumn,
} from 'typeorm';

import { PermissionEntity } from './permission.entity';
import { AbstractEntity } from '../../../database';
import { UserEntity } from '../../user/entities/user.entity';

@Entity({ name: 'roles' })
export class RoleEntity extends AbstractEntity {
  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true, default: false })
  isDefault: boolean;

  @Column({ type: 'text' })
  description: string;

  @ManyToMany(() => PermissionEntity, (permission) => permission.roles, {})
  @JoinTable({
    name: 'roles_permissions',
  })
  permissions: PermissionEntity[];

  @OneToMany(() => UserEntity, (user) => user.role)
  users: UserEntity[];

  @VirtualColumn({
    query: (alias) =>
      `SELECT COUNT("id") FROM "users" WHERE "role_id" = ${alias}.id`,
  })
  totalUser: number;
}
