import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Request, Response } from 'express';

type RateWindow = { limit: number; windowMs: number };

const windows: Record<string, RateWindow> = {
  '/auth/login': { limit: 5, windowMs: 15 * 60_000 },
  '/auth/register': { limit: 5, windowMs: 60 * 60_000 },
  '/auth/forgot-password': { limit: 5, windowMs: 60 * 60_000 },
  '/auth/resend-verification': { limit: 3, windowMs: 60 * 60_000 },
  '/auth/reset-password': { limit: 8, windowMs: 60 * 60_000 },
  '/auth/refresh': { limit: 30, windowMs: 15 * 60_000 },
};

interface Bucket {
  count: number;
  resetAt: number;
}

/** In-memory development/single-instance protection; replace with Redis for multi-instance production. */
@Injectable()
export class AuthRateLimitGuard implements CanActivate {
  private readonly buckets = new Map<string, Bucket>();

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const rule = windows[request.path];
    if (!rule || request.method !== 'POST') return true;

    const now = Date.now();
    const key = `${request.path}:${request.ip || request.socket.remoteAddress || 'unknown'}`;
    const current = this.buckets.get(key);
    const bucket = !current || current.resetAt <= now
      ? { count: 0, resetAt: now + rule.windowMs }
      : current;

    bucket.count += 1;
    this.buckets.set(key, bucket);
    response.setHeader('X-RateLimit-Limit', rule.limit);
    response.setHeader('X-RateLimit-Remaining', Math.max(0, rule.limit - bucket.count));

    if (bucket.count > rule.limit) {
      const retryAfter = Math.ceil((bucket.resetAt - now) / 1000);
      response.setHeader('Retry-After', retryAfter);
      throw new HttpException(
        'Too many attempts. Please wait a little and try again.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return true;
  }
}
