import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FieldEntity } from './field.entity';
import { FormTypeEntity } from './form-type.entity';
import { SubmissionEntity } from './submission.entity';
import { AbstractEntity } from 'src/database';

@Entity('forms')
export class FormEntity extends AbstractEntity {
  @Column({ name: 'title', nullable: false })
  title: string;

  @Column({ name: 'description', type: 'text', default: null })
  description: string;

  @Column({ name: 'form_type_id' })
  formTypeId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'creator_id' })
  creatorId: number;

  @Column({ name: 'published_at', default: null })
  publishedAt: Date;

  @Column({ name: 'is_published', default: false, nullable: false })
  isPublished: boolean;

  @Column({ name: 'closed_at', default: null })
  closedAt: Date;

  @ManyToOne(() => FormTypeEntity, (formType) => formType.forms)
  @JoinColumn({ name: 'form_type_id' })
  formType: FormTypeEntity;

  // @ManyToOne(() => UserEntity, (user) => user.forms)
  // @JoinColumn({ name: 'creator_id' })
  // creator: UserEntity;

  @OneToMany(() => SubmissionEntity, (submission) => submission.form)
  submissions: SubmissionEntity[];

  @OneToMany(() => FieldEntity, (field) => field.form, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  fields: FieldEntity[];
}
