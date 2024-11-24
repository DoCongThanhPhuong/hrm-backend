import { Exclude } from 'class-transformer';
import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Exclude({ toPlainOnly: true })
  @CreateDateColumn({
    type: 'timestamptz',
  })
  createdAt: Date;

  @Exclude({ toPlainOnly: true })
  @UpdateDateColumn({
    type: 'timestamptz',
  })
  updatedAt: Date;

  @Exclude({ toPlainOnly: true })
  @DeleteDateColumn({
    type: 'timestamptz',
  })
  deletedAt?: Date;
}
