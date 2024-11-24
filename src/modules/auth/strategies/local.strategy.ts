import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-local';

import { AuthenticationService } from '../authentication.service';
import { STRATEGY_LOCAL } from '../constants/auth.constant';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, STRATEGY_LOCAL) {
  constructor(private authService: AuthenticationService) {
    // Add option passReqToCallback: true to configure strategy to be request-scoped.
    super({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    });
  }

  async validate(request: Request, username: string, password: string) {
    return await this.authService.validateUser(username, password);
  }
}
