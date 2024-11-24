import {
  CorsOptions,
  CorsOptionsDelegate,
} from '@nestjs/common/interfaces/external/cors-options.interface';
import { JwtModuleOptions } from '@nestjs/jwt/dist/interfaces/jwt-module-options.interface';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

export interface IConfiguration {
  database: TypeOrmModuleOptions & SeederOptions & DataSourceOptions;
  environment: string;
  app: {
    appName: string;
    port: number;
    cors: CorsOptions | CorsOptionsDelegate<any>;
  };
  jwt: JwtModuleOptions;
  authentication: {
    accessTokenExpiresInSec: number;
    refreshTokenExpiresInSec: number;
    resetPasswordUrl: string;
    resetPasswordExpire: number;
    registerUrl: string;
    loginUrl: string;
  };
  aws: {
    accessKeyId: string;
    secretAccessKey: string;
  };
  s3: {
    region: string;
    publicFolder: string;
    publicBucketName: string;
  };
}
