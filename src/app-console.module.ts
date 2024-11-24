import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configurations from './configs/configurations';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthCheckerModule } from './modules/health-checker/health-checker.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConsoleModule } from 'nestjs-console';
import { FormModule } from './modules/form/form.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configurations],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => config.get('database'),
    }),
    ConsoleModule,
    HealthCheckerModule,
    UserModule,
    AuthModule,
    FormModule,
  ],
})
export class AppConsoleModule {}
