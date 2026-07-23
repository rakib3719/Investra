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
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UserRole } from '../../common/enums/user-role.enum';
import { AccountStatus } from '../../common/enums/account-status.enum';
import { env } from '../../common/config/env.config';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Registers a new user and creates the corresponding role-based profile inside a database transaction.
   */
  async register(dto: RegisterDto) {
    // 1. Prevent registering admin/sub-admin through public API
    if (dto.role === UserRole.ADMIN || dto.role === UserRole.SUB_ADMIN) {
      throw new ForbiddenException('Admin roles cannot be registered through public registration API');
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
    const username = await this.generateUniqueUsername(dto.firstName, dto.lastName);

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

    // 6. Generate email verification token (stateless JWT token)
    const verificationToken = this.jwtService.sign(
      { sub: newUser.id, type: 'email-verification' },
      { secret: env.JWT_SECRET, expiresIn: '24h' },
    );

    // Exclude password from response
    const { password, ...userWithoutPassword } = newUser;

    return {
      message: 'Registration successful. Please verify your email to activate your account.',
      user: userWithoutPassword,
      verificationToken, // Returned for ease of testing in this phase
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

    // 3. Check account status
    if (user.accountStatus === AccountStatus.BLOCKED || user.accountStatus === AccountStatus.SUSPENDED) {
      throw new ForbiddenException(`Your account is currently ${user.accountStatus.toLowerCase()}`);
    }

    // 4. Update last login time
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // 5. Generate tokens
    const tokens = this.generateTokens(user.id, user.email, user.role);

    // Exclude password
    const { password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      ...tokens,
    };
  }

  /**
   * Refreshes access token using a valid refresh token.
   */
  async refreshTokens(userId: string, email: string, role: string) {
    const tokens = this.generateTokens(userId, email, role);
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
      const payload = this.jwtService.verify(dto.token, { secret: env.JWT_SECRET });
      
      if (payload.type !== 'email-verification') {
        throw new BadRequestException('Invalid token type');
      }

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
          accountStatus: AccountStatus.ACTIVE,
        },
      });

      return { message: 'Email verified successfully. Your account is now active.' };
    } catch (error) {
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
      return { message: 'If the email exists in our system, you will receive a reset link shortly.' };
    }

    const resetToken = this.jwtService.sign(
      { sub: user.id, type: 'password-reset' },
      { secret: env.JWT_SECRET, expiresIn: '1h' },
    );

    return {
      message: 'If the email exists in our system, you will receive a reset link shortly.',
      resetToken, // Returned for ease of testing in this phase
    };
  }

  /**
   * Resets password using a valid reset token.
   */
  async resetPassword(dto: ResetPasswordDto) {
    try {
      const payload = this.jwtService.verify(dto.token, { secret: env.JWT_SECRET });

      if (payload.type !== 'password-reset') {
        throw new BadRequestException('Invalid token type');
      }

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

      return { message: 'Password has been reset successfully. You can now login.' };
    } catch (error) {
      throw new BadRequestException('Invalid or expired password reset token');
    }
  }

  // ==========================================
  // HELPER METHODS
  // ==========================================

  private generateTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };

    const accessToken = this.jwtService.sign(payload, {
      secret: env.JWT_SECRET,
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: env.JWT_SECRET,
      expiresIn: (env.JWT_EXPIRES_IN || '7d') as any,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  private async generateUniqueUsername(firstName: string, lastName: string): Promise<string> {
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
}
