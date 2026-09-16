import { Test, type TestingModule } from '@nestjs/testing';
import { jest } from '@jest/globals';
import type { Response } from 'express';
import { UserRole } from '../../common/enums/user-role.enum';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { type ForgotPasswordDto } from './dto/forgot-password.dto';
import { type LoginDto } from './dto/login.dto';
import { type RegisterDto } from './dto/register.dto';
import { type ResendVerificationDto } from './dto/resend-verification.dto';
import { type ResetPasswordDto } from './dto/reset-password.dto';
import { type VerifyEmailDto } from './dto/verify-email.dto';

const registerDto: RegisterDto = {
  firstName: 'Amina',
  lastName: 'Rahman',
  email: 'amina@example.com',
  password: 'SecurePass123!',
  role: UserRole.INVESTOR,
};

const loginDto: LoginDto = {
  email: 'amina@example.com',
  password: 'SecurePass123!',
};

const currentUser = {
  id: 'user-123',
  firstName: 'Amina',
  lastName: 'Rahman',
  username: 'amina.rahman',
  email: 'amina@example.com',
  phone: null,
  role: UserRole.INVESTOR,
  tokenVersion: 0,
  accountStatus: 'ACTIVE',
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-02T00:00:00.000Z'),
};

const authServiceMock = {
  register: jest.fn(),
  login: jest.fn(),
  refreshTokens: jest.fn(),
  revokeRefreshSession: jest.fn(),
  verifyEmail: jest.fn(),
  resendVerificationEmail: jest.fn(),
  forgotPassword: jest.fn(),
  resetPassword: jest.fn(),
  changePassword: jest.fn(),
};

interface ResponseMock {
  response: Response;
  cookie: jest.Mock;
  clearCookie: jest.Mock;
}

function createResponseMock(): ResponseMock {
  const cookie = jest.fn();
  const clearCookie = jest.fn();

  return {
    response: { cookie, clearCookie } as unknown as Response,
    cookie,
    clearCookie,
  };
}

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  describe('POST /auth/register', () => {
    it('forwards the registration DTO and returns the service response', async () => {
      const result = {
        message:
          'Registration successful. Check your email to verify your account.',
        user: currentUser,
      };
      authServiceMock.register.mockResolvedValue(result);

      await expect(controller.register(registerDto)).resolves.toEqual(result);
      expect(authServiceMock.register).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('POST /auth/login', () => {
    it('sets HTTP-only access and refresh cookies without exposing tokens in the response', async () => {
      const response = createResponseMock();
      authServiceMock.login.mockResolvedValue({
        user: currentUser,
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });

      await expect(
        controller.login(loginDto, response.response),
      ).resolves.toEqual({
        message: 'Login successful',
        user: currentUser,
      });

      expect(authServiceMock.login).toHaveBeenCalledWith(loginDto);
      expect(response.cookie).toHaveBeenNthCalledWith(
        1,
        'accessToken',
        'access-token',
        {
          httpOnly: true,
          secure: false,
          sameSite: 'lax',
          path: '/',
          maxAge: 15 * 60 * 1000,
        },
      );
      expect(response.cookie).toHaveBeenNthCalledWith(
        2,
        'refreshToken',
        'refresh-token',
        {
          httpOnly: true,
          secure: false,
          sameSite: 'lax',
          path: '/',
          maxAge: 7 * 24 * 60 * 60 * 1000,
        },
      );
    });
  });

  describe('POST /auth/refresh', () => {
    it('rotates tokens from the authenticated refresh session and sets new cookies', async () => {
      const response = createResponseMock();
      const request = {
        user: {
          id: currentUser.id,
          sessionId: 'session-123',
          refreshToken: 'old-refresh-token',
          tokenVersion: 0,
        },
      };
      authServiceMock.refreshTokens.mockResolvedValue({
        message: 'Tokens refreshed successfully',
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      });

      await expect(
        controller.refresh(request as never, response.response),
      ).resolves.toEqual({
        message: 'Tokens refreshed successfully',
      });

      expect(authServiceMock.refreshTokens).toHaveBeenCalledWith(
        currentUser.id,
        'session-123',
        'old-refresh-token',
        0,
      );
      expect(response.cookie).toHaveBeenCalledTimes(2);
      expect(response.cookie).toHaveBeenNthCalledWith(
        1,
        'accessToken',
        'new-access-token',
        expect.objectContaining({ httpOnly: true, maxAge: 15 * 60 * 1000 }),
      );
      expect(response.cookie).toHaveBeenNthCalledWith(
        2,
        'refreshToken',
        'new-refresh-token',
        expect.objectContaining({
          httpOnly: true,
          maxAge: 7 * 24 * 60 * 60 * 1000,
        }),
      );
    });
  });

  describe('POST /auth/logout', () => {
    it('revokes the refresh session and clears both auth cookies', async () => {
      const response = createResponseMock();
      authServiceMock.revokeRefreshSession.mockResolvedValue(undefined);

      await expect(
        controller.logout(
          { cookies: { refreshToken: 'refresh-token' } } as never,
          response.response,
        ),
      ).resolves.toEqual({ message: 'Logged out successfully' });

      expect(authServiceMock.revokeRefreshSession).toHaveBeenCalledWith(
        'refresh-token',
      );
      expect(response.clearCookie).toHaveBeenNthCalledWith(1, 'accessToken', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/',
      });
      expect(response.clearCookie).toHaveBeenNthCalledWith(2, 'refreshToken', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/',
      });
    });

    it('remains safe when the request has no refresh cookie', async () => {
      const response = createResponseMock();
      authServiceMock.revokeRefreshSession.mockResolvedValue(undefined);

      await controller.logout({} as never, response.response);

      expect(authServiceMock.revokeRefreshSession).toHaveBeenCalledWith(
        undefined,
      );
      expect(response.clearCookie).toHaveBeenCalledTimes(2);
    });
  });

  describe('POST /auth/change-password', () => {
    it('changes the password and clears this browser session', async () => {
      const response = createResponseMock();
      const dto = {
        currentPassword: 'SecurePass123!',
        newPassword: 'NewSecurePass123!',
      };
      const result = {
        message: 'Password changed. Please sign in again on this device and your other devices.',
      };
      authServiceMock.changePassword.mockResolvedValue(result);

      await expect(
        controller.changePassword(currentUser, dto, response.response),
      ).resolves.toEqual(result);

      expect(authServiceMock.changePassword).toHaveBeenCalledWith(currentUser.id, dto);
      expect(response.clearCookie).toHaveBeenNthCalledWith(1, 'accessToken',
        expect.objectContaining({ httpOnly: true, sameSite: 'lax', path: '/' }),
      );
      expect(response.clearCookie).toHaveBeenNthCalledWith(2, 'refreshToken',
        expect.objectContaining({ httpOnly: true, sameSite: 'lax', path: '/' }),
      );
    });
  });

  describe('POST /auth/verify-email', () => {
    it('forwards the verification token to the service', async () => {
      const dto: VerifyEmailDto = { token: 'verification-token' };
      const result = {
        message: 'Email verified successfully. Your account is now active.',
      };
      authServiceMock.verifyEmail.mockResolvedValue(result);

      await expect(controller.verifyEmail(dto)).resolves.toEqual(result);
      expect(authServiceMock.verifyEmail).toHaveBeenCalledWith(dto);
    });
  });

  describe('POST /auth/resend-verification', () => {
    it('forwards the email to the resend service', async () => {
      const dto: ResendVerificationDto = { email: currentUser.email };
      const result = {
        message:
          'If the account needs verification, a new email has been sent.',
      };
      authServiceMock.resendVerificationEmail.mockResolvedValue(result);

      await expect(controller.resendVerificationEmail(dto)).resolves.toEqual(
        result,
      );
      expect(authServiceMock.resendVerificationEmail).toHaveBeenCalledWith(dto);
    });
  });

  describe('POST /auth/forgot-password', () => {
    it('forwards the reset request email to the service', async () => {
      const dto: ForgotPasswordDto = { email: currentUser.email };
      const result = {
        message:
          'If the email exists in our system, you will receive a reset link shortly.',
      };
      authServiceMock.forgotPassword.mockResolvedValue(result);

      await expect(controller.forgotPassword(dto)).resolves.toEqual(result);
      expect(authServiceMock.forgotPassword).toHaveBeenCalledWith(dto);
    });
  });

  describe('POST /auth/reset-password', () => {
    it('forwards the token and new password to the service', async () => {
      const dto: ResetPasswordDto = {
        token: 'reset-token',
        newPassword: 'NewSecurePass123!',
      };
      const result = {
        message: 'Password has been reset successfully. You can now login.',
      };
      authServiceMock.resetPassword.mockResolvedValue(result);

      await expect(controller.resetPassword(dto)).resolves.toEqual(result);
      expect(authServiceMock.resetPassword).toHaveBeenCalledWith(dto);
    });
  });

  describe('GET /auth/me', () => {
    it('returns the user attached by JwtAuthGuard and CurrentUser', () => {
      expect(controller.getProfile(currentUser)).toBe(currentUser);
    });
  });
});
