import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';

interface Bucket {
  count: number;
  resetAt: number;
}

/** Replace this in-memory limiter with Redis before horizontally scaling the API. */
@Injectable()
export class VisitorInsightRateLimitGuard implements CanActivate {
  private readonly buckets = new Map<string, Bucket>();

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse();
    const now = Date.now();
    const key = request.ip || request.socket.remoteAddress || 'unknown';
    const windowMs = 60 * 60_000;
    const limit = 60;
    const current = this.buckets.get(key);
    const bucket = !current || current.resetAt <= now
      ? { count: 0, resetAt: now + windowMs }
      : current;

    bucket.count += 1;
    this.buckets.set(key, bucket);
    response.setHeader('X-RateLimit-Limit', limit);
    response.setHeader('X-RateLimit-Remaining', Math.max(0, limit - bucket.count));

    if (bucket.count > limit) {
      response.setHeader('Retry-After', Math.ceil((bucket.resetAt - now) / 1000));
      throw new HttpException('Too many telemetry requests. Please try again later.', HttpStatus.TOO_MANY_REQUESTS);
    }

    return true;
  }
}
