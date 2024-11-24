import { AbstractEntity } from 'src/database';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ESubmissionStatus } from '../constants/form.enum';
import { FieldValueEntity } from './field-value.entity';
import { FormEntity } from './form.entity';

@Entity('submissions')
export class SubmissionEntity extends AbstractEntity {
  @Column({
    name: 'status',
    type: 'enum',
    enum: ESubmissionStatus,
    default: ESubmissionStatus.PENDING,
  })
  status: ESubmissionStatus;

  @Column({ name: 'rejection_reason', type: 'text', default: null })
  rejectionReason: string;

  @Column({ name: 'submitted_at', default: null })
  lastSubmitdAt: Date;

  @Column({ name: 'form_id', nullable: false })
  formId: number;

  @Column({ name: 'employee_id', nullable: false })
  employeeId: number;

  @Column({ name: 'manager_id', nullable: false })
  managerId: number;

  // @ManyToOne(() => UserEntity, (user) => user.submissions)
  // @JoinColumn({ name: 'employee_id' })
  // employee: UserEntity;

  // @ManyToOne(() => UserEntity, (user) => user.managedSubmissions)
  // @JoinColumn({ name: 'manager_id' })
  // manager: UserEntity;

  @ManyToOne(() => FormEntity, (form) => form.submissions)
  @JoinColumn({ name: 'form_id' })
  form: FormEntity;

  @OneToMany(() => FieldValueEntity, (fieldValue) => fieldValue.submission)
  fieldValues: FieldValueEntity[];
}
