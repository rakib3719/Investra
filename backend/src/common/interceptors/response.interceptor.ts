import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: any;
  timestamp: string;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const statusCode = response.statusCode;

    return next.handle().pipe(
      map((res) => {
        // If response is already formatted as ApiResponse, return it as is
        if (
          res &&
          typeof res === 'object' &&
          'success' in res &&
          'statusCode' in res &&
          'message' in res &&
          'data' in res
        ) {
          return res as ApiResponse<T>;
        }

        let message = 'Request completed successfully';
        let data = res;
        let meta: any = undefined;

        // If the controller returns a structured object, we extract data, message, and meta
        if (res && typeof res === 'object' && !Array.isArray(res)) {
          if ('message' in res) {
            message = res.message;
          }
          if ('meta' in res) {
            meta = res.meta;
          }

          if ('data' in res) {
            data = res.data;
          } else if ('message' in res || 'meta' in res) {
            // Extract everything except message and meta as the data
            const { message: _, meta: __, ...rest } = res;
            data = Object.keys(rest).length > 0 ? rest : null;
          }
        }

        return {
          success: true,
          statusCode,
          message,
          data: data ?? null,
          ...(meta !== undefined ? { meta } : {}),
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
