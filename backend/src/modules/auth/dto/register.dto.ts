import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserRole } from '../../../common/enums/user-role.enum';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'John', description: 'First name of the user' })
  @IsString()
  @MaxLength(100, { message: 'First name must be 100 characters or fewer' })
  @IsNotEmpty({ message: 'First name is required' })
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Last name of the user' })
  @IsString()
  @MaxLength(100, { message: 'Last name must be 100 characters or fewer' })
  @IsNotEmpty({ message: 'Last name is required' })
  lastName: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'Unique email address of the user' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({ example: 'Password123!', description: 'Strong password (minimum 8 characters)' })
  @IsString()
  @MinLength(12, { message: 'Password must be at least 12 characters long' })
  @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/, {
    message: 'Password must include uppercase, lowercase, number, and symbol',
  })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  @ApiProperty({ enum: UserRole, example: UserRole.INVESTOR, description: 'Role of the user (INVESTOR, ENTREPRENEUR, CONSULTANT)' })
  @IsEnum(UserRole, { message: 'Invalid user role' })
  @IsNotEmpty({ message: 'Role is required' })
  role: UserRole;
}
