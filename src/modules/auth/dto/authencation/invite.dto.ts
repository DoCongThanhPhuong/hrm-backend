import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
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
  @IsNotEmpty({ message: 'AUTH::CODE_IS_REQUIRED' })
  @IsString({ message: 'AUTH::CODE_MUST_BE_STRING' })
  code: string;

  @ApiProperty()
  @IsArray({ message: 'AUTH::EMAIL_LIST_IS_INVALID' })
  @ArrayMinSize(1, { message: 'USER::SIZE_INVALID' })
  @ArrayMaxSize(100, { message: 'USER::SIZE_INVALID' })
  @IsString({ each: true, message: 'AUTH::EMAIL_LIST_IS_INVALID' })
  @IsEmail({}, { message: 'USER::EMAIL_IS_INVALID', each: true })
  @Transform(({ value }) => value.map((it: string) => it.toLowerCase()))
  emails: string[];
}
