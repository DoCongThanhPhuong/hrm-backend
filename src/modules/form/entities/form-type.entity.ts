import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EFormTypeScope } from '../constants/form.enum';
import { FormEntity } from './form.entity';
import { AbstractEntity } from 'src/database';

@Entity('form_types')
export class FormTypeEntity extends AbstractEntity {
  @Column({ name: 'name', unique: true, nullable: false })
  name: string;

  @Column({
    name: 'scope',
    type: 'enum',
    enum: EFormTypeScope,
    default: EFormTypeScope.ALL,
    nullable: false,
  })
  scope: EFormTypeScope;

  @OneToMany(() => FormEntity, (form) => form.formType)
  forms: FormEntity[];
}
