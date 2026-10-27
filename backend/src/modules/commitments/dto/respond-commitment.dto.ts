import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RespondCommitmentDto {
  @ApiProperty({
    description: 'Founder response action',
    enum: ['ACCEPT', 'DECLINE', 'NEGOTIATE'],
  })
  @IsIn(['ACCEPT', 'DECLINE', 'NEGOTIATE'])
  @IsNotEmpty()
  action: 'ACCEPT' | 'DECLINE' | 'NEGOTIATE';

  @ApiPropertyOptional({ description: 'Founder feedback or negotiation counter-note' })
  @IsOptional()
  @IsString()
  notes?: string;
}
