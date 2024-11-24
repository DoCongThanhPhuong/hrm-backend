import { createParamDecorator } from '@nestjs/common';

import { IJwtPayload } from '../interfaces';

export const CurrentUser = createParamDecorator((_data, input): IJwtPayload => {
  return input.args[0].user as IJwtPayload;
});
