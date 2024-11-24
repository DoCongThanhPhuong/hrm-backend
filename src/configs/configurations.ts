import { join } from 'path';

import { IConfiguration } from './interfaces/configuration.interface';
import connectionOptions from '../database/ormconfig';

export default (): IConfiguration => ({
  environment: process.env.ENV || 'development',
  app: {
    appName: process.env.APP_NAME,
    port: parseInt(process.env.APP_PORT) || 3000,
    cors: {
      origin: process.env.CORS_ORIGIN,
      methods: process.env.CORS_METHODS,
      allowedHeaders: process.env.CORS_ALLOWED_HEADERS,
      exposedHeaders: process.env.CORS_EXPOSED_HEADERS,
      credentials: process.env.CORS_CREDENTIALS === 'true',
      preflightContinue: process.env.CORS_PREFLIGHT_CONTINUE === 'true',
    },
  },
  database: connectionOptions,
  jwt: {
    privateKey: Buffer.from(
      process.env.JWT_PRIVATE_KEY_BASE64,
      'base64',
    ).toString('utf8'),
    publicKey: Buffer.from(
      process.env.JWT_PUBLIC_KEY_BASE64,
      'base64',
    ).toString('utf8'),
    signOptions: {
      allowInsecureKeySizes: true,
      algorithm: 'RS256',
    },
  },
  authentication: {
    accessTokenExpiresInSec: parseInt(
      process.env.JWT_ACCESS_TOKEN_EXP_IN_SEC,
      10,
    ),
    refreshTokenExpiresInSec: parseInt(
      process.env.JWT_REFRESH_TOKEN_EXP_IN_SEC,
      10,
    ),
    resetPasswordUrl:
      process.env.AUTHENCATION_RESET_PASSWORD_PATH ||
      '/forget-password/reset-password',
    resetPasswordExpire:
      parseInt(process.env.AUTHENCATION_RESET_PASSWORD_EXPIRE, 10) || 900,
    registerUrl: process.env.AUTHENCATION_REGISTER_PATH || '/register',
    loginUrl: process.env.AUTHENCATION_LOGIN_PATH || '/login',
  },
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  s3: {
    region: process.env.AWS_REGION,
    publicFolder: process.env.AWS_FOLDER_DEFAULT,
    publicBucketName: process.env.AWS_PUBLIC_BUCKET_NAME,
  },
});
