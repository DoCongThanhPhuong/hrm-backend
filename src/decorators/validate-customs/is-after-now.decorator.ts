import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export function IsAfterNow(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: IsAfterNowConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'IsAfterNow' })
export class IsAfterNowConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    return new Date(value) > new Date();
  }
}
