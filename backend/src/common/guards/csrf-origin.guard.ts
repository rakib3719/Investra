import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { env } from '../config/env.config';

/**
 * Cookie-authenticated browser writes must originate from an approved frontend.
 * Requests without an Origin header are allowed for server-to-server clients and
 * API tooling; browser requests always include one for cross-origin writes.
 */
@Injectable()
export class CsrfOriginGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) return true;

    const origin = request.get('Origin');
    if (origin) {
      const normalizedOrigin = origin.trim().replace(/\/+$/, '');
      if (!env.TRUSTED_ORIGINS.includes(normalizedOrigin) && !env.TRUSTED_ORIGINS.includes('*')) {
        throw new ForbiddenException('This request origin is not allowed');
      }
    }

    return true;
  }
}
