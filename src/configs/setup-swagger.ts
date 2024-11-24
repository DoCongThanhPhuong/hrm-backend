import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Environment } from 'src/constants';

export function setupSwagger(app: INestApplication): void {
  const configService = app.get(ConfigService);

  if (
    [Environment.test, Environment.production].indexOf(
      configService.get('ENV') as Environment,
    ) === -1
  ) {
    const serverUrl = `${configService.get(
      'APP_SERVER_METHOD',
    )}://${configService.get('APP_SERVER_HOST')}`;

    const serviceApi = `${configService
      .get('APP_NAME')
      .slice(0, 1)
      .toUpperCase()}${configService.get('APP_NAME').slice(1)}`;
    const apiDocOptions = new DocumentBuilder()
      .setTitle(`${serviceApi} API`)
      .setVersion('1.0')
      .setDescription(`API Documentation for ${serviceApi}`)
      .addServer(serverUrl, `api server`)
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, apiDocOptions, {
      operationIdFactory: (controllerKey: string, methodKey: string) =>
        methodKey,
    });
    SwaggerModule.setup('documentation', app, document);
  }
}
