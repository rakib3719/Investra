import { UserRole } from '../../../common/enums/user-role.enum';
import { AccountStatus } from '../../../common/enums/account-status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: 'user-uuid-1234', description: 'The unique ID of the user' })
  id: string;

  @ApiProperty({ example: 'John', description: 'First name of the user', nullable: true })
  firstName: string | null;

  @ApiProperty({ example: 'Doe', description: 'Last name of the user', nullable: true })
  lastName: string | null;

  @ApiProperty({ example: 'johndoe', description: 'Unique username of the user', nullable: true })
  username: string | null;

  @ApiProperty({ example: 'john.doe@example.com', description: 'Email address of the user' })
  email: string;

  @ApiProperty({ example: '+1234567890', description: 'Phone number of the user', nullable: true })
  phone: string | null;

  @ApiProperty({ enum: UserRole, example: UserRole.INVESTOR, description: 'Role of the user' })
  role: UserRole;

  @ApiProperty({ enum: AccountStatus, example: AccountStatus.PENDING, description: 'Account status of the user' })
  accountStatus: AccountStatus;

  @ApiProperty({ example: '2026-07-24T13:20:47.000Z', description: 'User creation timestamp' })
  createdAt: Date;

  @ApiProperty({ example: '2026-07-24T13:20:47.000Z', description: 'User update timestamp' })
  updatedAt: Date;
}

export class LoginResponseDto {
  @ApiProperty({ type: () => UserResponseDto })
  user: UserResponseDto;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5...', description: 'Short-lived JWT access token' })
  accessToken: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5...', description: 'Long-lived JWT refresh token' })
  refreshToken: string;
}

export class RegistrationResponseDto {
  @ApiProperty({ example: 'Registration successful. Please verify your email to activate your account.' })
  message: string;

  @ApiProperty({ type: () => UserResponseDto })
  user: UserResponseDto;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5...', description: 'Email verification JWT token (stateless)' })
  verificationToken: string;
}

export class RegisterResponseDataDto {
  @ApiProperty({ type: () => UserResponseDto })
  user: UserResponseDto;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5...', description: 'Email verification JWT token (stateless)' })
  verificationToken: string;
}

export class ForgotPasswordResponseDataDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5...', description: 'Password reset token' })
  resetToken: string;
}

export class RefreshResponseDataDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5...', description: 'Short-lived JWT access token' })
  accessToken: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5...', description: 'Long-lived JWT refresh token' })
  refreshToken: string;
}


