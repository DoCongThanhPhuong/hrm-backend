import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { STRATEGY_LOCAL } from '../constants/auth.constant';

@Injectable()
export class LocalAuthGuard extends AuthGuard(STRATEGY_LOCAL) {}
