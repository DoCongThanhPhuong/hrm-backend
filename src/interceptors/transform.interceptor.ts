import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  StreamableFile,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        if (data instanceof StreamableFile) {
          return data;
        }

        if (['statusCode', 'message'].every((key) => data.hasOwnProperty(key)))
          return data;

        if (
          ['data', 'count', 'currentPage', 'totalPage'].every((key) =>
            data.hasOwnProperty(key),
          )
        )
          return {
            statusCode: context.switchToHttp().getResponse().statusCode,
            ...data,
          };

        return {
          statusCode: context.switchToHttp().getResponse().statusCode,
          data: data,
        };
      }),
    );
  }
}
