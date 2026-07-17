import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class TestUserDto {
  @IsString({ message: 'Name must be a text string' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email address is required' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}
