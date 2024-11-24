import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailFactoryHelper {
  getStringBeforeAtSign(email: string) {
    const atSignIndex = email.indexOf('@');
    const firstChar = email.charAt(0).toUpperCase();
    return firstChar + email.slice(1, atSignIndex);
  }
}
