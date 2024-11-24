import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class InviteUserDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'USER::CODE_IS_REQUIRED' })
  @IsString({ each: true })
  code: string;

  @ApiProperty()
  @IsArray({ message: 'USER::EMAIL_LIST_IS_INVALID' })
  @ArrayMinSize(1, { message: 'USER::SIZE_INVALID' })
  @ArrayMaxSize(20, { message: 'USER::SIZE_INVALID' })
  @IsString({ each: true, message: 'USER::EMAIL_LIST_IS_INVALID' })
  @IsEmail({}, { message: 'USER::EMAIL_LIST_IS_INVALID', each: true })
  emails: string[];
}
