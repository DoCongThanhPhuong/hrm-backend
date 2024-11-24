import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import * as urlJoin from 'url-join';

import { FactoryHelper } from '../../../common/helpers/factory.helper';
import { AUTH_KEY } from '../constants/auth.enum';
import { IGenForgotPwdInfo, IGenInviteInfo } from '../interfaces';

@Injectable()
export class AuthFactoryHelper extends FactoryHelper {
  constructor(private readonly configService: ConfigService) {
    super();
  }

  async prepareForgotPwdInfo(): Promise<IGenForgotPwdInfo> {
    const token = await this._genToken();

    return {
      token: token,
      key: this.getKeyForgotPwd(token),
      url: this._getUrlForgotPwd(token),
    };
  }

  async prepareInviteInfo(code: string): Promise<IGenInviteInfo> {
    return {
      code: code,
      url: this._getUrlRegister(),
    };
  }

  genPermissionInfo(permissionCode: string) {
    let [module, action] = permissionCode.split('::');

    if (module === '*') module = 'entire';
    if (action === '*') action = 'perform operations on all';

    return {
      name: this.normalizeSentence(action),
      code: permissionCode,
      description: this.normalizeSentence(
        `This permission allows the user to ${action} records of the ${module} resource.`,
      ),
    };
  }

  comparePassword(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  }

  getKeyForgotPwd(token: string): string {
    return `${AUTH_KEY.FORGOT_PWD}::${token}`;
  }

  normalizeSentence(sentence: string): string {
    sentence = sentence.trim();
    sentence = sentence.toLowerCase();
    sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1);
    sentence = sentence.replace(/[_]/g, ' ');
    sentence = sentence.replace(/\s+/g, ' ');
    sentence = sentence.replace(/\b\w/g, (c) => c.toUpperCase());
    return sentence;
  }

  getUrlLogin(): string {
    return urlJoin(
      this.configService.get('frontend.baseUrl'),
      this.configService.get('authentication.loginUrl'),
    );
  }

  private _getUrlForgotPwd(token: string): string {
    return urlJoin(
      this.configService.get('frontend.baseUrl'),
      this.configService.get('authentication.resetPasswordUrl'),
      `?token=${token}&expireTime=${
        Math.floor(new Date().getTime() / 1000) +
        this.configService.get('authentication.resetPasswordExpire')
      }`,
    );
  }

  private _getUrlRegister(): string {
    return urlJoin(
      this.configService.get('frontend.baseUrl'),
      this.configService.get('authentication.registerUrl'),
    );
  }

  private async _genToken(): Promise<string> {
    return crypto.randomBytes(4).toString('hex');
  }
}
