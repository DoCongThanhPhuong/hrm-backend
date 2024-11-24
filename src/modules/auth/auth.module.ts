import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DiscoveryModule, DiscoveryService } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController } from './auth.controller';
import { AuthenticationService } from './authentication.service';
import { AuthorizationService } from './authorization.service';
import { STRATEGY_JWT_AUTH } from './constants/auth.constant';
import {
  ActionEntity,
  ModuleEntity,
  PermissionEntity,
  RoleEntity,
} from './entities';
import { AuthFactoryHelper } from './helpers/auth-factory.helper';
import {
  ActionRepository,
  ModuleRepository,
  PermissionRepository,
  RoleRepository,
} from './repositories';
import {
  JwtAuthStrategy,
  JwtRefreshStrategy,
  LocalStrategy,
} from './strategies';
import { FactoryHelper } from '../../common/helpers/factory.helper';
// import { MailClientModule } from '../mail-client/mail-client.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    // UserModule,
    forwardRef(() => UserModule),
    PassportModule.register({
      defaultStrategy: STRATEGY_JWT_AUTH,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => config.get('jwt'),
    }),
    TypeOrmModule.forFeature([
      PermissionEntity,
      ActionEntity,
      ModuleEntity,
      RoleEntity,
    ]),
    // MailClientModule,
    DiscoveryModule,
  ],
  controllers: [AuthController],
  providers: [
    RoleRepository,
    PermissionRepository,
    ModuleRepository,
    ActionRepository,
    DiscoveryService,
    AuthFactoryHelper,
    FactoryHelper,
    AuthenticationService,
    ConfigService,
    LocalStrategy,
    JwtAuthStrategy,
    JwtRefreshStrategy,
    AuthorizationService,
  ],
  exports: [AuthorizationService],
})
export class AuthModule {}
