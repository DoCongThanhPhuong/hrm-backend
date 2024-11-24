import { OmitType, PartialType } from '@nestjs/swagger';

import { CreateUserDto } from './create-user.dto';

export class AdminCreateUserDto extends PartialType(
  OmitType(CreateUserDto, ['password']),
) {}
