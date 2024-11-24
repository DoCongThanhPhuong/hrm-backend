import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export function IsBeforeNow(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: IsBeforeNowConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'IsBeforeNow' })
export class IsBeforeNowConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    return new Date(value) < new Date();
  }
}
