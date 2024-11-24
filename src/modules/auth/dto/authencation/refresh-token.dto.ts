import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
  @IsNotEmpty({ message: 'AUTH::TOKEN_IS_REQUIRED' })
  @ApiProperty()
  refreshToken: string;
}
