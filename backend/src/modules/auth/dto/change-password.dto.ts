import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'Current password is required' })
  currentPassword: string;

  @IsString()
  @MinLength(12, { message: 'New password must be at least 12 characters long' })
  @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/, {
    message: 'New password must include uppercase, lowercase, number, and symbol',
  })
  @IsNotEmpty({ message: 'New password is required' })
  newPassword: string;
}
