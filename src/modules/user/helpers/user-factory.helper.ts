import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as urlJoin from 'url-join';

import { FactoryHelper } from '../../../common/helpers/factory.helper';

@Injectable()
export class UserFactoryHelper extends FactoryHelper {
  constructor(private readonly configService: ConfigService) {
    super();
  }

  public getUrlLogin(): string {
    return urlJoin(
      this.configService.get('frontend.baseUrl'),
      this.configService.get('authentication.loginUrl'),
    );
  }
}
