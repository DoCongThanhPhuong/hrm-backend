import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EFieldType } from '../constants/form.enum';
import { FieldOptionsType } from '../types';
import { FieldValueEntity } from './field-value.entity';
import { FormEntity } from './form.entity';
import { AbstractEntity } from 'src/database';

@Entity('fields')
export class FieldEntity extends AbstractEntity {
  @Column({ name: 'label', nullable: false })
  label: string;

  @Column({ name: 'type', type: 'enum', enum: EFieldType, nullable: false })
  type: EFieldType;

  @Column({ name: 'required', default: true, nullable: false })
  required: boolean;

  @Column({ name: 'options', type: 'simple-json', nullable: true })
  options: FieldOptionsType;

  @Column({ name: 'form_id', nullable: false })
  formId: number;

  @OneToMany(() => FieldValueEntity, (FieldValue) => FieldValue.field)
  fieldValue: FieldValueEntity[];

  @ManyToOne(() => FormEntity, (form) => form.fields, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'form_id' })
  form: FormEntity;
}
