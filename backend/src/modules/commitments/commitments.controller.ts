import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateCommitmentDto } from './dto/create-commitment.dto';
import { RespondCommitmentDto } from './dto/respond-commitment.dto';
import { CommitmentsService } from './commitments.service';

@ApiTags('Investment Commitments & Term Sheets')
@Controller('api/v1/commitments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiCookieAuth('accessToken')
export class CommitmentsController {
  constructor(private readonly commitmentsService: CommitmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Investor issues an investment commitment / term sheet proposal' })
  @ApiResponse({ status: 201, description: 'Commitment issued successfully' })
  async createCommitment(
    @CurrentUser('id') investorId: string,
    @Body() dto: CreateCommitmentDto,
  ) {
    return this.commitmentsService.createCommitment(investorId, dto);
  }

  @Get('investor/me')
  @ApiOperation({ summary: 'Get all capital commitments and positions for current investor' })
  @ApiResponse({ status: 200, description: 'Investor commitments and portfolio positions' })
  async getInvestorCommitments(@CurrentUser('id') investorId: string) {
    return this.commitmentsService.getInvestorCommitments(investorId);
  }

  @Get('entrepreneur/me')
  @ApiOperation({ summary: 'Get all incoming term sheets and commitments for current entrepreneur' })
  @ApiResponse({ status: 200, description: 'Entrepreneur incoming commitments' })
  async getEntrepreneurCommitments(@CurrentUser('id') entrepreneurId: string) {
    return this.commitmentsService.getEntrepreneurCommitments(entrepreneurId);
  }

  @Patch(':id/respond')
  @ApiOperation({ summary: 'Entrepreneur accepts, declines, or negotiates a term sheet' })
  @ApiResponse({ status: 200, description: 'Response recorded' })
  async respondToCommitment(
    @CurrentUser('id') entrepreneurId: string,
    @Param('id') commitmentId: string,
    @Body() dto: RespondCommitmentDto,
  ) {
    return this.commitmentsService.respondToCommitment(
      entrepreneurId,
      commitmentId,
      dto,
    );
  }
}
