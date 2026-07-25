import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5...', description: 'Email verification JWT token' })
  @IsString()
  @IsNotEmpty({ message: 'Verification token is required' })
  token: string;
}

