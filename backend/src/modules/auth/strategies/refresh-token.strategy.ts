import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { env } from '../../../common/config/env.config';

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  sid: string;
  type: string;
  tokenVersion: number;
}

const cookieExtractor = (req: Request): string | null => {
  const cookies = req.cookies as Record<string, unknown> | undefined;
  const token = cookies?.refreshToken;

  return typeof token === 'string'
    ? token
    : ExtractJwt.fromAuthHeaderAsBearerToken()(req);
};

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: env.JWT_SECRET,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: JwtPayload) {
    const cookies = req.cookies as Record<string, unknown> | undefined;
    const cookieToken = cookies?.refreshToken;
    const headerToken = req.get('Authorization')?.replace('Bearer ', '').trim();
    const refreshToken =
      typeof cookieToken === 'string' ? cookieToken : headerToken;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }
    if (payload.type !== 'refresh' || !payload.sid) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      sessionId: payload.sid,
      tokenVersion: payload.tokenVersion,
      refreshToken,
    };
  }
}
