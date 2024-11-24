import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { FieldValueType } from '../types';
import { FieldEntity } from './field.entity';
import { SubmissionEntity } from './submission.entity';

@Entity('field_values')
export class FieldValueEntity {
  @PrimaryColumn({ name: 'submission_id' })
  submissionId: number;

  @PrimaryColumn({ name: 'field_id' })
  fieldId: number;

  @Column({ type: 'simple-json', name: 'value' })
  value: FieldValueType;

  @ManyToOne(() => SubmissionEntity, (submission) => submission.fieldValues)
  @JoinColumn({ name: 'submission_id' })
  submission: SubmissionEntity;

  @ManyToOne(() => FieldEntity, (field) => field.fieldValue)
  @JoinColumn({ name: 'field_id' })
  field: FieldEntity;
}
