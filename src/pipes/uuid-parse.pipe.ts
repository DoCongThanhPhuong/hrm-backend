import { ArgumentMetadata, ParseUUIDPipe } from '@nestjs/common';

export class EnhancedParseUUIDPipe extends ParseUUIDPipe {
  async transform(value: string, metadata: ArgumentMetadata): Promise<string> {
    try {
      return await super.transform(value, metadata);
    } catch {
      throw this.exceptionFactory(`COMMON::INVALID_UUID_FORMAT`);
    }
  }
}
