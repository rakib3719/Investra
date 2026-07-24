import { Controller, Post, Body, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as express from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiExtraModels,
  getSchemaPath,
  ApiCookieAuth,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UserResponseDto, LoginResponseDto, RegistrationResponseDto } from './dto/auth-response.dto';

@ApiTags('Authentication')
@ApiExtraModels(UserResponseDto, LoginResponseDto, RegistrationResponseDto)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user', description: 'Creates a new user account with role-based profile (Investor, Entrepreneur, or Consultant).' })
  @ApiResponse({
    status: 201,
    description: 'Registration successful. An email verification token is returned.',
    schema: {
      properties: {
        success: { type: 'boolean', example: true },
        statusCode: { type: 'number', example: 201 },
        message: { type: 'string', example: 'Registration successful. Please verify your email to activate your account.' },
        data: {
          properties: {
            user: { $ref: getSchemaPath(UserResponseDto) },
            verificationToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5...' },
          },
        },
        timestamp: { type: 'string', example: '2026-07-24T13:48:36.000Z' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid input data or validation failed.' })
  @ApiResponse({ status: 403, description: 'Admin roles cannot be registered through public registration API.' })
  @ApiResponse({ status: 409, description: 'A user with this email already exists.' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user', description: 'Authenticates user credentials, sets HTTP-only cookies (accessToken and refreshToken), and returns user details.' })
  @ApiResponse({
    status: 200,
    description: 'Login successful. Access and refresh tokens are stored in HttpOnly cookies and returned in JSON for compatibility.',
    headers: {
      'Set-Cookie': {
        description: 'Sets HttpOnly cookies `accessToken` (expires in 15m) and `refreshToken` (expires in 7d)',
        schema: { type: 'string', example: 'accessToken=...; HttpOnly; Path=/; Max-Age=900; SameSite=Lax' },
      },
    },
    schema: {
      properties: {
        success: { type: 'boolean', example: true },
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Login successful' },
        data: {
          properties: {
            user: { $ref: getSchemaPath(UserResponseDto) },
            accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5...' },
            refreshToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5...' },
          },
        },
        timestamp: { type: 'string', example: '2026-07-24T13:48:36.000Z' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid email or password.' })
  @ApiResponse({ status: 403, description: 'Account is blocked or suspended.' })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const result = await this.authService.login(dto);

    // Set Access Token cookie (15 mins)
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    });

    // Set Refresh Token cookie (7 days)
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      message: 'Login successful',
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    };
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('refresh')
  @ApiCookieAuth('refreshToken')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Refresh JWT tokens', description: 'Generates new access and refresh tokens using a valid refresh token cookie or Bearer token.' })
  @ApiResponse({
    status: 200,
    description: 'Tokens refreshed successfully. New cookies set and tokens returned in body.',
    schema: {
      properties: {
        success: { type: 'boolean', example: true },
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Tokens refreshed successfully' },
        data: {
          properties: {
            accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5...' },
            refreshToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5...' },
          },
        },
        timestamp: { type: 'string', example: '2026-07-24T13:48:36.000Z' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Refresh token is missing, invalid, or expired.' })
  async refresh(
    @Req() req: any,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const user = req.user;
    const result = await this.authService.refreshTokens(user.id, user.email, user.role);

    // Update Access Token cookie
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    });

    // Update Refresh Token cookie
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      message: result.message,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    };
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout user', description: 'Clears the access and refresh token cookies from the browser.' })
  @ApiResponse({
    status: 200,
    description: 'Logged out successfully. Cookies cleared.',
    schema: {
      properties: {
        success: { type: 'boolean', example: true },
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Logged out successfully' },
        data: { type: 'object', nullable: true, example: null },
        timestamp: { type: 'string', example: '2026-07-24T13:48:36.000Z' },
      },
    },
  })
  logout(@Res({ passthrough: true }) res: express.Response) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return { message: 'Logged out successfully' };
  }

  @Post('verify-email')
  @ApiOperation({ summary: 'Verify email address', description: 'Verifies user email using the signed token sent to their email.' })
  @ApiResponse({
    status: 200,
    description: 'Email verified successfully. Account is now active.',
    schema: {
      properties: {
        success: { type: 'boolean', example: true },
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Email verified successfully. Your account is now active.' },
        data: { type: 'object', nullable: true, example: null },
        timestamp: { type: 'string', example: '2026-07-24T13:48:36.000Z' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid or expired verification token.' })
  verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.authService.verifyEmail(dto);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Request password reset', description: 'Generates a password reset token and returns it (sent to email in production).' })
  @ApiResponse({
    status: 200,
    description: 'Password reset flow initiated successfully.',
    schema: {
      properties: {
        success: { type: 'boolean', example: true },
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'If the email exists in our system, you will receive a reset link shortly.' },
        data: {
          properties: {
            resetToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5...' },
          },
        },
        timestamp: { type: 'string', example: '2026-07-24T13:48:36.000Z' },
      },
    },
  })
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password', description: 'Resets user password using a valid password reset token.' })
  @ApiResponse({
    status: 200,
    description: 'Password has been reset successfully.',
    schema: {
      properties: {
        success: { type: 'boolean', example: true },
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Password has been reset successfully. You can now login.' },
        data: { type: 'object', nullable: true, example: null },
        timestamp: { type: 'string', example: '2026-07-24T13:48:36.000Z' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid or expired password reset token.' })
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiCookieAuth('accessToken')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile', description: 'Returns the profile details of the currently authenticated user.' })
  @ApiResponse({
    status: 200,
    description: 'Current user profile data fetched successfully.',
    schema: {
      properties: {
        success: { type: 'boolean', example: true },
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Request completed successfully' },
        data: { $ref: getSchemaPath(UserResponseDto) },
        timestamp: { type: 'string', example: '2026-07-24T13:48:36.000Z' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Missing, invalid, or expired access token.' })
  getProfile(@CurrentUser() user: any) {
    return user;
  }
}
