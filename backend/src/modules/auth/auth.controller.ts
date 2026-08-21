import {
  Controller,
  Post,
  Body,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as express from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ResendVerificationDto } from './dto/resend-verification.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiCookieAuth,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  ApiSuccessResponse,
  ApiBadRequestResponseWrapped,
  ApiUnauthorizedResponseWrapped,
  ApiForbiddenResponseWrapped,
  ApiConflictResponseWrapped,
} from '../../common/decorators/api-response.decorator';
import {
  UserResponseDto,
  LoginResponseDto,
  RegisterResponseDataDto,
  ForgotPasswordResponseDataDto,
  RefreshResponseDataDto,
} from './dto/auth-response.dto';
import { AuthRateLimitGuard } from './guards/auth-rate-limit.guard';
import { CsrfOriginGuard } from '../../common/guards/csrf-origin.guard';
import { env } from '../../common/config/env.config';

interface RefreshRequestUser {
  id: string;
  sessionId: string;
  refreshToken: string;
  tokenVersion: number;
}

interface RefreshRequest extends express.Request {
  user: RefreshRequestUser;
}

interface CurrentAuthUser {
  id: string;
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  email: string;
  phone: string | null;
  role: string;
  accountStatus: string;
  createdAt: Date;
  updatedAt: Date;
}

@ApiTags('Authentication')
@UseGuards(AuthRateLimitGuard, CsrfOriginGuard)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Register a new user',
    description:
      'Creates a pending role-based profile and sends a verification email.',
  })
  @ApiSuccessResponse({
    status: 201,
    description: 'Registration successful. A verification email has been sent.',
    message:
      'Registration successful. Check your email to activate your account.',
    type: RegisterResponseDataDto,
  })
  @ApiBadRequestResponseWrapped()
  @ApiForbiddenResponseWrapped(
    'Admin roles cannot be registered through public registration API.',
  )
  @ApiConflictResponseWrapped()
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({
    summary: 'Login user',
    description:
      'Authenticates a verified account and sets HTTP-only access and refresh cookies.',
  })
  @ApiSuccessResponse({
    status: 200,
    description:
      'Login successful. Access and refresh tokens are stored only in HttpOnly cookies.',
    message: 'Login successful',
    type: LoginResponseDto,
  })
  @ApiBadRequestResponseWrapped()
  @ApiUnauthorizedResponseWrapped('Invalid email or password.')
  @ApiForbiddenResponseWrapped('Account is blocked or suspended.')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const result = await this.authService.login(dto);

    this.setAuthCookies(res, result.accessToken, result.refreshToken);

    return {
      message: 'Login successful',
      user: result.user,
    };
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('refresh')
  @ApiCookieAuth('refreshToken')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Refresh JWT tokens',
    description:
      'Rotates a valid refresh session and sets new HTTP-only cookies.',
  })
  @ApiSuccessResponse({
    status: 200,
    description:
      'Tokens refreshed successfully. New cookies are set without exposing tokens in JSON.',
    message: 'Tokens refreshed successfully',
    type: RefreshResponseDataDto,
  })
  @ApiUnauthorizedResponseWrapped(
    'Refresh token is missing, invalid, or expired.',
  )
  async refresh(
    @Req() req: RefreshRequest,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const user = req.user;
    const result = await this.authService.refreshTokens(
      user.id,
      user.sessionId,
      user.refreshToken,
      user.tokenVersion,
    );

    this.setAuthCookies(res, result.accessToken, result.refreshToken);

    return {
      message: result.message,
    };
  }

  @Post('logout')
  @ApiOperation({
    summary: 'Logout user',
    description:
      'Clears the access and refresh token cookies from the browser.',
  })
  @ApiSuccessResponse({
    status: 200,
    description: 'Logged out successfully. Cookies cleared.',
    message: 'Logged out successfully',
  })
  async logout(
    @Req() req: express.Request,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const cookies = req.cookies as Record<string, unknown> | undefined;
    const refreshToken =
      typeof cookies?.refreshToken === 'string'
        ? cookies.refreshToken
        : undefined;
    await this.authService.revokeRefreshSession(refreshToken);
    const cookieOptions = this.getCookieOptions();
    res.clearCookie('accessToken', cookieOptions);
    res.clearCookie('refreshToken', cookieOptions);
    return { message: 'Logged out successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  @ApiCookieAuth('accessToken')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Change password for the current user',
    description:
      'Requires the current password, revokes every session, and invalidates all existing access tokens.',
  })
  async changePassword(
    @CurrentUser() user: CurrentAuthUser,
    @Body() dto: ChangePasswordDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const result = await this.authService.changePassword(user.id, dto);
    const cookieOptions = this.getCookieOptions();
    res.clearCookie('accessToken', cookieOptions);
    res.clearCookie('refreshToken', cookieOptions);
    return result;
  }

  @Post('verify-email')
  @ApiOperation({
    summary: 'Verify email address',
    description:
      'Verifies user email using the signed token sent to their email.',
  })
  @ApiSuccessResponse({
    status: 200,
    description: 'Email verified successfully. Account is now active.',
    message: 'Email verified successfully. Your account is now active.',
  })
  @ApiBadRequestResponseWrapped('Invalid or expired verification token.')
  verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.authService.verifyEmail(dto);
  }

  @Post('resend-verification')
  @ApiOperation({ summary: 'Resend email verification link' })
  @ApiSuccessResponse({
    status: 200,
    description: 'A verification email is sent when needed.',
  })
  resendVerificationEmail(@Body() dto: ResendVerificationDto) {
    return this.authService.resendVerificationEmail(dto);
  }

  @Post('forgot-password')
  @ApiOperation({
    summary: 'Request password reset',
    description:
      'Generates a password reset token and returns it (sent to email in production).',
  })
  @ApiSuccessResponse({
    status: 200,
    description: 'Password reset flow initiated successfully.',
    message:
      'If the email exists in our system, you will receive a reset link shortly.',
    type: ForgotPasswordResponseDataDto,
  })
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Post('reset-password')
  @ApiOperation({
    summary: 'Reset password',
    description: 'Resets user password using a valid password reset token.',
  })
  @ApiSuccessResponse({
    status: 200,
    description: 'Password has been reset successfully.',
    message: 'Password has been reset successfully. You can now login.',
  })
  @ApiBadRequestResponseWrapped('Invalid or expired password reset token.')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiCookieAuth('accessToken')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get current user profile',
    description:
      'Returns the profile details of the currently authenticated user.',
  })
  @ApiSuccessResponse({
    status: 200,
    description: 'Current user profile data fetched successfully.',
    type: UserResponseDto,
  })
  @ApiUnauthorizedResponseWrapped('Missing, invalid, or expired access token.')
  getProfile(@CurrentUser() user: CurrentAuthUser) {
    return user;
  }

  private setAuthCookies(
    res: express.Response,
    accessToken: string,
    refreshToken: string,
  ): void {
    res.cookie('accessToken', accessToken, {
      ...this.getCookieOptions(),
      maxAge: this.durationToMilliseconds(env.JWT_ACCESS_EXPIRES_IN),
    });
    res.cookie('refreshToken', refreshToken, {
      ...this.getCookieOptions(),
      maxAge: this.durationToMilliseconds(env.JWT_EXPIRES_IN),
    });
  }

  private getCookieOptions() {
    return {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: env.COOKIE_SAME_SITE,
      path: '/',
      ...(env.COOKIE_DOMAIN ? { domain: env.COOKIE_DOMAIN } : {}),
    };
  }

  private durationToMilliseconds(value: string): number {
    const match = /^(\d+)([smhd])$/.exec(value);
    if (!match) return 7 * 24 * 60 * 60 * 1000;
    const multipliers: Record<string, number> = {
      s: 1_000,
      m: 60_000,
      h: 3_600_000,
      d: 86_400_000,
    };
    return Number(match[1]) * multipliers[match[2]];
  }
}
