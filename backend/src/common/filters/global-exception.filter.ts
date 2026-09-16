import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { STATUS_CODES } from 'http';
import { MulterError } from 'multer';

export interface ApiErrorResponse {
  success: boolean;
  statusCode: number;
  message: string;
  error: string;
  errors?: Record<string, string>;
  path: string;
  timestamp: string;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errorName = 'Internal Server Error';
    let validationErrors: Record<string, string> | undefined = undefined;

    if (exception instanceof MulterError) {
      const multerError = exception as MulterError;
      status = HttpStatus.BAD_REQUEST;
      message =
        multerError.code === 'LIMIT_FILE_SIZE'
          ? 'The selected file is too large. Choose an image up to 5 MB.'
          : 'The uploaded file could not be processed.';
      errorName = 'Bad Request';
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const resContent = exception.getResponse();

      if (typeof resContent === 'object' && resContent !== null) {
        const body = resContent as any;
        message = body.message || exception.message;
        errorName = body.error || STATUS_CODES[status] || 'Http Exception';
        
        // If our custom validation pipe formatted the errors
        if (body.errors) {
          validationErrors = body.errors;
        } 
        // If it is NestJS default class-validator error response (array of messages)
        else if (Array.isArray(body.message)) {
          message = 'Validation failed';
          validationErrors = {};
          body.message.forEach((msg: string) => {
            // Attempt to parse property name from default message (e.g. "email must be an email")
            const firstWord = msg.split(' ')[0];
            if (firstWord) {
              validationErrors![firstWord] = msg;
            }
          });
        }
      } else {
        message = typeof resContent === 'string' ? resContent : exception.message;
        errorName = STATUS_CODES[status] || 'Http Exception';
      }
    } else if (exception instanceof Error) {
      // Log the unexpected error stack trace for server-side debugging
      this.logger.error(
        `Unhandled Exception: ${exception.message}`,
        exception.stack,
      );
      message = exception.message;
      errorName = exception.name;
    } else {
      this.logger.error(`Unknown exception type caught: ${JSON.stringify(exception)}`);
    }

    // Do not leak detailed internal/database error messages in production
    const isProduction = process.env.NODE_ENV === 'production';
    if (status === HttpStatus.INTERNAL_SERVER_ERROR && isProduction) {
      message = 'An unexpected error occurred. Please try again later.';
    }

    const errorResponse: ApiErrorResponse = {
      success: false,
      statusCode: status,
      message,
      error: errorName,
      ...(validationErrors ? { errors: validationErrors } : {}),
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    response.status(status).json(errorResponse);
  }
}
