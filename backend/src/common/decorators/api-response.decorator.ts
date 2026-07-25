import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, ApiCreatedResponse, getSchemaPath, ApiResponse } from '@nestjs/swagger';

interface ApiSuccessResponseOptions {
  status?: 200 | 201;
  message?: string;
  description?: string;
  type?: Type<any>;
  isArray?: boolean;
  schema?: any; // Fallback for custom inline schemas
}

export function ApiSuccessResponse(options: ApiSuccessResponseOptions) {
  const status = options.status || 200;
  const description = options.description || 'Request completed successfully';
  const messageExample = options.message || 'Request completed successfully';

  let dataSchema: any;

  if (options.schema) {
    dataSchema = options.schema;
  } else if (options.type) {
    if (options.isArray) {
      dataSchema = {
        type: 'array',
        items: { $ref: getSchemaPath(options.type) },
      };
    } else {
      dataSchema = { $ref: getSchemaPath(options.type) };
    }
  } else {
    dataSchema = { type: 'object', nullable: true, example: null };
  }

  const decorators: Array<ClassDecorator | MethodDecorator | PropertyDecorator> = [];

  // Register extra models if a DTO class is provided
  if (options.type) {
    decorators.push(ApiExtraModels(options.type));
  }

  const responseSchema = {
    properties: {
      success: { type: 'boolean', example: true },
      statusCode: { type: 'number', example: status },
      message: { type: 'string', example: messageExample },
      data: dataSchema,
      timestamp: { type: 'string', example: '2026-07-24T13:48:36.000Z' },
    },
  };

  if (status === 201) {
    decorators.push(
      ApiCreatedResponse({
        description,
        schema: responseSchema,
      }),
    );
  } else {
    decorators.push(
      ApiOkResponse({
        description,
        schema: responseSchema,
      }),
    );
  }

  return applyDecorators(...decorators);
}

export function ApiErrorResponse(options: {
  status: number;
  description: string;
  error: string;
  message: string;
  errors?: Record<string, string>;
}) {
  return ApiResponse({
    status: options.status,
    description: options.description,
    schema: {
      properties: {
        success: { type: 'boolean', example: false },
        statusCode: { type: 'number', example: options.status },
        message: { type: 'string', example: options.message },
        error: { type: 'string', example: options.error },
        path: { type: 'string', example: '/auth/route-path' },
        timestamp: { type: 'string', example: '2026-07-24T13:48:36.000Z' },
        ...(options.errors
          ? {
              errors: {
                type: 'object',
                additionalProperties: { type: 'string' },
                example: options.errors,
              },
            }
          : {}),
      },
    },
  });
}

export function ApiBadRequestResponseWrapped(description = 'Invalid input data or validation failed.') {
  return ApiErrorResponse({
    status: 400,
    error: 'Bad Request',
    message: 'Validation failed',
    description,
    errors: {
      email: 'Please provide a valid email address',
      password: 'Password must be at least 8 characters long',
    },
  });
}

export function ApiUnauthorizedResponseWrapped(description = 'Unauthorized access.') {
  return ApiErrorResponse({
    status: 401,
    error: 'Unauthorized',
    message: 'Invalid credentials or expired session',
    description,
  });
}

export function ApiForbiddenResponseWrapped(description = 'Forbidden access.') {
  return ApiErrorResponse({
    status: 403,
    error: 'Forbidden',
    message: 'Access denied / Insufficient permissions',
    description,
  });
}

export function ApiConflictResponseWrapped(description = 'Conflict / Resource already exists.') {
  return ApiErrorResponse({
    status: 409,
    error: 'Conflict',
    message: 'A user with this email already exists',
    description,
  });
}

