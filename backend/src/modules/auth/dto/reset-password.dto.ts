import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5...', description: 'Password reset JWT token' })
  @IsString()
  @IsNotEmpty({ message: 'Token is required' })
  token: string;

  @ApiProperty({ example: 'NewPassword123!', description: 'New password (minimum 8 characters)' })
  @IsString()
  @MinLength(12, { message: 'New password must be at least 12 characters long' })
  @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/, {
    message: 'New password must include uppercase, lowercase, number, and symbol',
  })
  @IsNotEmpty({ message: 'New password is required' })
  newPassword: string;
}
