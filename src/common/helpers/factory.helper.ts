import { HttpStatus } from '@nestjs/common';

import { PASSWORD_CHARACTERS, PASSWORD_REGEX } from '../../constants';
import { IResponseMessage } from '../../interfaces';

export class FactoryHelper {
  resFactory(
    message: string,
    statusCode: HttpStatus = HttpStatus.OK,
  ): IResponseMessage {
    return {
      statusCode: statusCode,
      message: message,
    };
  }

  async sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  convertUnixTimeToDatetimeWithTz(
    unixTime: number,
    tzOffset: number = 0,
  ): string {
    const gmtDate = new Date(unixTime - tzOffset * 60 * 1000);

    return `${gmtDate.getFullYear()}-${
      gmtDate.getMonth() + 1
    }-${gmtDate.getDate()} ${gmtDate.getHours()}:${gmtDate.getMinutes()}:${gmtDate.getSeconds()} (GMT ${
      tzOffset >= 0 ? '-' : '+'
    }${-tzOffset / 60})`;
  }

  passwordFactory() {
    let password = '';
    do {
      password = '';
      for (let i = 0; i < 10; i++) {
        password +=
          PASSWORD_CHARACTERS[
            Math.floor(Math.random() * PASSWORD_CHARACTERS.length)
          ];
      }
    } while (!password.match(new RegExp(PASSWORD_REGEX, 'i')));
    return password;
  }
}
