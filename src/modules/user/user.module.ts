import { forwardRef, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from './entities/user.entity';
import { UserFactoryHelper } from './helpers/user-factory.helper';
import { UserRepository } from './repositories/user.repository';
import { AdminUsersController } from './user-admin.controller';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthModule } from '../auth/auth.module';
// import { MailClientModule } from '../mail-client/mail-client.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    forwardRef(() => AuthModule),
    // MailClientModule,
  ],
  controllers: [UserController, AdminUsersController],
  providers: [UserRepository, UserService, ConfigService, UserFactoryHelper],
  exports: [UserService],
})
export class UserModule {}
