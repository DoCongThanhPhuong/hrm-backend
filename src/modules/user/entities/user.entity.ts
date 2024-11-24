import { Exclude } from 'class-transformer';
import { Column, Entity, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../../database';
import { RoleEntity } from '../../auth/entities';
import { EUserStatus } from '../constants/user.enum';

@Entity({ name: 'users' })
export class UserEntity extends AbstractEntity {
  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => RoleEntity, (role) => role.users, {
    nullable: true,
  })
  role?: RoleEntity;

  @Column({ unique: true, nullable: true })
  email: string;

  @Exclude()
  @Column({ nullable: true })
  password: string;

  @Exclude({ toPlainOnly: true })
  @Column({
    type: 'timestamptz',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  lastUpdatePasswordAt: Date;

  @Column({ type: 'enum', enum: EUserStatus, default: EUserStatus.ACTIVE })
  status: EUserStatus;
}
