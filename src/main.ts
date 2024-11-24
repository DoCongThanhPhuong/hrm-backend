import {
  BadRequestException,
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { useContainer, ValidationError } from 'class-validator';
import * as compression from 'compression';
import helmet from 'helmet';
import * as morgan from 'morgan';

import { AppModule } from './app.module';
import { setupSwagger } from './configs/setup-swagger';
import { API_PREFIX, API_VERSION } from './constants';
import { TransformInterceptor } from './interceptors/transform.interceptor';

/*
                       _oo0oo_
                      o8888888o
                      88" . "88
                      (| -_- |)
                      0\  =  /0
                    ___/`---'\___
                  .' \\|     |// '.
                 / \\|||  :  |||// \
                / _||||| -:- |||||- \
               |   | \\\  -  /// |   |
               | \_|  ''\---/''  |_/ |
               \  .-\__  '-'  ___/-. /
             ___'. .'  /--.--\  `. .'___
          ."" '<  `.___\_<|>_/___.' >' "".
         | | :  `- \`.;`\ _ /`;.`/ - ` : | |
         \  \ `_.   \_ __\ /__ _/   .-` /  /
     =====`-.____`.___ \_____/___.-`___.-'=====
                       `=---='

             KEEP EVERYTHING IS SIMPLE!
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
       Buddha blesses you with no bugs forever
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors();
  app.setGlobalPrefix(`/${API_PREFIX}/${API_VERSION}`);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.use(helmet());
  app.use(compression());
  app.use(morgan('dev'));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      exceptionFactory: (errors: ValidationError[]) => {
        return new BadRequestException(errors);
      },
    }),
  );

  app.useGlobalInterceptors(
    new TransformInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),
  );

  setupSwagger(app);

  await app.startAllMicroservices();
  await app.listen(configService.get('app.port')).then(() => {
    Logger.log('Server listening on port ' + configService.get('app.port'));
  });
}

bootstrap();
