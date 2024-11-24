import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configurations from './configs/configurations';
import { AuthModule } from './modules/auth/auth.module';
import { FormModule } from './modules/form/form.module';
import { HealthCheckerModule } from './modules/health-checker/health-checker.module';
import { UserModule } from './modules/user/user.module';

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
    HealthCheckerModule,
    UserModule,
    AuthModule,
    FormModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
