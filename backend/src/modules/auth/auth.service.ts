import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { AccountStatus } from '@prisma/client';
import type { StringValue } from 'ms';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ResendVerificationDto } from './dto/resend-verification.dto';
import { UserRole } from '../../common/enums/user-role.enum';
import { env } from '../../common/config/env.config';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  /**
   * Registers a new user and creates the corresponding role-based profile inside a database transaction.
   */
  async register(dto: RegisterDto) {
    // 1. Prevent registering admin/sub-admin through public API
    if (dto.role === UserRole.ADMIN || dto.role === UserRole.SUB_ADMIN) {
      throw new ForbiddenException(
        'Admin roles cannot be registered through public registration API',
      );
    }

    // 2. Check if email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });
    if (existingUser) {
      throw new ConflictException('A user with this email already exists');
    }

    // 3. Hash the password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // 4. Generate unique username
    const username = await this.generateUniqueUsername(
      dto.firstName,
      dto.lastName,
    );

    // 5. Use Prisma transaction to create user and profile
    const newUser = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          firstName: dto.firstName,
          lastName: dto.lastName,
          username,
          email: dto.email.toLowerCase(),
          password: hashedPassword,
          role: dto.role,
          accountStatus: AccountStatus.PENDING, // default until email is verified
        },
      });

      // Create role-specific profiles
      if (dto.role === UserRole.INVESTOR) {
        await tx.investorProfile.create({
          data: { userId: user.id },
        });
      } else if (dto.role === UserRole.ENTREPRENEUR) {
        await tx.entrepreneurProfile.create({
          data: { userId: user.id },
        });
      } else if (dto.role === UserRole.CONSULTANT) {
        await tx.consultantProfile.create({
          data: { userId: user.id },
        });
      }

      return user;
    });

    await this.sendVerificationEmail(newUser.id, newUser.email);

    return {
      message:
        'Registration successful. Check your email to verify your account.',
      user: this.withoutPassword(newUser),
    };
  }

  /**
   * Logs in a user, returning user details and a pair of JWT access and refresh tokens.
   */
  async login(dto: LoginDto) {
    // 1. Find user by email
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // 2. Check password
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // 3. Only a verified and active account may receive a session.
    if (!user.isEmailVerified || user.accountStatus === AccountStatus.PENDING) {
      throw new ForbiddenException(
        'Please verify your email address before signing in',
      );
    }

    if (user.accountStatus !== AccountStatus.ACTIVE) {
      throw new ForbiddenException(
        `Your account is currently ${user.accountStatus.toLowerCase()}`,
      );
    }

    // 4. Update last login time
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // 5. Generate tokens
    const tokens = await this.createSessionTokens(
      user.id,
      user.email,
      user.role,
    );

    return {
      user: this.withoutPassword(user),
      ...tokens,
    };
  }

  /**
   * Refreshes access token using a valid refresh token.
   */
  async refreshTokens(userId: string, sessionId: string, refreshToken: string) {
    const session = await this.prisma.refreshSession.findUnique({
      where: { id: sessionId },
      include: { user: true },
    });

    if (
      !session ||
      session.userId !== userId ||
      session.revokedAt ||
      session.expiresAt <= new Date() ||
      !(await bcrypt.compare(refreshToken, session.tokenHash))
    ) {
      throw new UnauthorizedException('Refresh session is invalid or expired');
    }

    if (
      !session.user.isEmailVerified ||
      session.user.accountStatus !== AccountStatus.ACTIVE
    ) {
      throw new UnauthorizedException(
        'Your account is not eligible for a session',
      );
    }

    // Rotate the session: the current refresh token can be used exactly once.
    await this.prisma.refreshSession.update({
      where: { id: session.id },
      data: { revokedAt: new Date() },
    });

    const tokens = await this.createSessionTokens(
      session.user.id,
      session.user.email,
      session.user.role,
    );

    return {
      message: 'Tokens refreshed successfully',
      ...tokens,
    };
  }

  /**
   * Verifies the email address using the signed token.
   */
  async verifyEmail(dto: VerifyEmailDto) {
    try {
      const payload = this.verifyActionToken(dto.token, 'email-verification');

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (user.isEmailVerified) {
        return { message: 'Email is already verified' };
      }

      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          isEmailVerified: true,
          accountStatus:
            user.accountStatus === AccountStatus.PENDING
              ? AccountStatus.ACTIVE
              : user.accountStatus,
        },
      });

      return {
        message: 'Email verified successfully. Your account is now active.',
      };
    } catch {
      throw new BadRequestException('Invalid or expired verification token');
    }
  }

  /**
   * Initiates forgot password flow by generating a temporary password reset token.
   */
  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    // For security reasons, don't throw error if email does not exist (prevent enumeration)
    if (!user) {
      return {
        message:
          'If the email exists in our system, you will receive a reset link shortly.',
      };
    }

    const resetToken = this.jwtService.sign(
      { sub: user.id, type: 'password-reset' },
      { secret: env.JWT_SECRET, expiresIn: '1h' },
    );

    await this.mailService.sendPasswordResetEmail(user.email, resetToken);

    return {
      message:
        'If the email exists in our system, you will receive a reset link shortly.',
    };
  }

  /**
   * Resets password using a valid reset token.
   */
  async resetPassword(dto: ResetPasswordDto) {
    try {
      const payload = this.verifyActionToken(dto.token, 'password-reset');

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

      await this.prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });

      await this.prisma.refreshSession.updateMany({
        where: { userId: user.id, revokedAt: null },
        data: { revokedAt: new Date() },
      });

      return {
        message: 'Password has been reset successfully. You can now login.',
      };
    } catch {
      throw new BadRequestException('Invalid or expired password reset token');
    }
  }

  async resendVerificationEmail(dto: ResendVerificationDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (user && !user.isEmailVerified) {
      await this.sendVerificationEmail(user.id, user.email);
    }

    return {
      message: 'If the account needs verification, a new email has been sent.',
    };
  }

  async revokeRefreshSession(refreshToken?: string): Promise<void> {
    if (!refreshToken) {
      return;
    }

    try {
      const payload = this.jwtService.verify<{
        sub: string;
        sid: string;
        type: string;
      }>(refreshToken, { secret: env.JWT_SECRET });

      if (payload.type !== 'refresh' || !payload.sid) {
        return;
      }

      await this.prisma.refreshSession.updateMany({
        where: { id: payload.sid, userId: payload.sub, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    } catch {
      // Logout is idempotent. An expired/invalid cookie is still cleared by the controller.
    }
  }

  // HELPER METHODS

  private async sendVerificationEmail(
    userId: string,
    email: string,
  ): Promise<void> {
    const verificationToken = this.jwtService.sign(
      { sub: userId, type: 'email-verification' },
      { secret: env.JWT_SECRET, expiresIn: '24h' },
    );

    await this.mailService.sendVerificationEmail(email, verificationToken);
  }

  private verifyActionToken(
    token: string,
    expectedType: 'email-verification' | 'password-reset',
  ): { sub: string; type: string } {
    const payload: unknown = this.jwtService.verify(token, {
      secret: env.JWT_SECRET,
    });

    if (!this.isActionTokenPayload(payload) || payload.type !== expectedType) {
      throw new BadRequestException('Invalid token type');
    }

    return payload;
  }

  private isActionTokenPayload(
    payload: unknown,
  ): payload is { sub: string; type: string } {
    return (
      typeof payload === 'object' &&
      payload !== null &&
      'sub' in payload &&
      typeof payload.sub === 'string' &&
      'type' in payload &&
      typeof payload.type === 'string'
    );
  }

  private async createSessionTokens(
    userId: string,
    email: string,
    role: string,
  ) {
    const sessionId = randomUUID();
    const accessToken = this.jwtService.sign(
      { sub: userId, email, role, type: 'access' },
      { secret: env.JWT_SECRET, expiresIn: '15m' },
    );

    const refreshToken = this.jwtService.sign(
      { sub: userId, email, role, sid: sessionId, type: 'refresh' },
      {
        secret: env.JWT_SECRET,
        expiresIn: (env.JWT_EXPIRES_IN || '7d') as StringValue,
      },
    );

    await this.prisma.refreshSession.create({
      data: {
        id: sessionId,
        userId,
        tokenHash: await bcrypt.hash(refreshToken, 10),
        expiresAt: this.getRefreshExpirationDate(),
      },
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  private getRefreshExpirationDate(): Date {
    const match = /^(\d+)([smhd])$/.exec(env.JWT_EXPIRES_IN);
    const amount = match ? Number(match[1]) : 7;
    const unit = match?.[2] ?? 'd';
    const multipliers: Record<string, number> = {
      s: 1000,
      m: 60_000,
      h: 3_600_000,
      d: 86_400_000,
    };
    const multiplier = multipliers[unit] ?? multipliers.d;

    return new Date(Date.now() + amount * multiplier);
  }

  private async generateUniqueUsername(
    firstName: string,
    lastName: string,
  ): Promise<string> {
    const base = `${firstName.toLowerCase().replace(/[^a-z0-9]/g, '')}${lastName.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
    let username = base;
    let exists = await this.prisma.user.findUnique({ where: { username } });
    let counter = 1;

    while (exists) {
      username = `${base}${counter}`;
      exists = await this.prisma.user.findUnique({ where: { username } });
      counter++;
    }

    return username;
  }

  private withoutPassword<T extends { password: string }>(
    user: T,
  ): Omit<T, 'password'> {
    return Object.fromEntries(
      Object.entries(user).filter(([key]) => key !== 'password'),
    ) as Omit<T, 'password'>;
  }
}
