import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { env } from '../../../common/config/env.config';
import { PrismaService } from '../../../prisma/prisma.service';

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  tokenVersion: number;
  type: string;
}

const cookieExtractor = (req: Request): string | null => {
  const cookies = req.cookies as Record<string, unknown> | undefined;
  const token = cookies?.accessToken;

  return typeof token === 'string'
    ? token
    : ExtractJwt.fromAuthHeaderAsBearerToken()(req);
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: env.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload) {
    if (payload.type !== 'access') {
      throw new UnauthorizedException('Invalid access token');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        email: true,
        phone: true,
        image: true,
        avatarMedia: { select: { key: true } },
        coverImage: true,
        coverMedia: { select: { key: true } },
        role: true,
        tokenVersion: true,
        isEmailVerified: true,
        accountStatus: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User no longer exists');
    }

    const resolvedImage = user.avatarMedia
      ? (env.R2_PUBLIC_URL
          ? `${env.R2_PUBLIC_URL.replace(/\/+$/, '')}/${user.avatarMedia.key}`
          : user.image)
      : user.image;

    const resolvedCoverImage = user.coverMedia
      ? (env.R2_PUBLIC_URL
          ? `${env.R2_PUBLIC_URL.replace(/\/+$/, '')}/${user.coverMedia.key}`
          : user.coverImage)
      : user.coverImage;

    const { avatarMedia: _avatarMedia, coverMedia: _coverMedia, ...userData } = user;

    if (!user.isEmailVerified || user.accountStatus !== 'ACTIVE') {
      throw new UnauthorizedException('Your account is not active');
    }

    if (payload.tokenVersion !== user.tokenVersion) {
      throw new UnauthorizedException('Your session is no longer valid');
    }

    return {
      ...userData,
      image: resolvedImage,
      coverImage: resolvedCoverImage,
    };
  }
}
