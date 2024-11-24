import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { EUserStatus } from '../../user/constants/user.enum';
import { UserService } from '../../user/user.service';
import { STRATEGY_JWT_REFRESH } from '../constants/auth.constant';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  STRATEGY_JWT_REFRESH,
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      secretOrKey: configService.get<string>('jwt.publicKey'),
      algorithms: ['RS256'],
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findOne(payload.sub);

    if (
      user.status !== EUserStatus.ACTIVE ||
      Math.floor(new Date(user.lastUpdatePasswordAt).getTime() / 1000) >
        payload.issuedAt
    )
      throw new UnauthorizedException('AUTH::INVALID_TOKEN_OR_TOKEN_EXPIRE');

    // Passport automatically creates a user object, based on the value we return from the validate() method,
    // and assigns it to the Request object as req.user
    return payload;
  }
}
