import { ValidationPipe, ValidationError, BadRequestException } from '@nestjs/common';

/**
 * Recursively formats class-validator ValidationErrors into a flat key-value pair of { fieldPath: errorMessage }.
 * Supports nested objects and arrays.
 */
export function formatValidationErrors(
  errors: ValidationError[],
  parentProperty = '',
): Record<string, string> {
  const result: Record<string, string> = {};

  for (const error of errors) {
    const propertyPath = parentProperty
      ? `${parentProperty}.${error.property}`
      : error.property;

    if (error.constraints) {
      // Combine all constraint messages for the property
      result[propertyPath] = Object.values(error.constraints).join(', ');
    }

    if (error.children && error.children.length > 0) {
      Object.assign(
        result,
        formatValidationErrors(error.children, propertyPath),
      );
    }
  }

  return result;
}

/**
 * Custom ValidationPipe configured with industry-standard settings:
 * - whitelist: true (strips properties not in the DTO)
 * - transform: true (automatically transforms payloads to DTO instances)
 * - forbidNonWhitelisted: true (throws error if non-whitelisted properties are present)
 * - exceptionFactory: transforms validation errors to a flat key-value dictionary object
 */
export const customValidationPipe = new ValidationPipe({
  whitelist: true,
  transform: true,
  forbidNonWhitelisted: true,
  exceptionFactory: (errors: ValidationError[]) => {
    const formattedErrors = formatValidationErrors(errors);
    return new BadRequestException({
      message: 'Validation failed',
      errors: formattedErrors,
    });
  },
});
