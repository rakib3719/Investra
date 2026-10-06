import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { KycService } from './kyc.service';
import { SubmitKycDto } from './dto/submit-kyc.dto';
import { ReviewKycDto } from './dto/review-kyc.dto';
import { KycListQueryDto } from './dto/kyc-list-query.dto';

@ApiTags('kyc')
@Controller('api/v1/kyc')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class KycController {
  constructor(private readonly kycService: KycService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user KYC status and submission details' })
  @ApiResponse({ status: 200, description: 'User KYC status retrieved' })
  async getMyKyc(@CurrentUser('id') userId: string) {
    return this.kycService.getMyKyc(userId);
  }

  @Post('submit')
  @ApiOperation({ summary: 'Submit or re-submit KYC verification documents' })
  @ApiResponse({ status: 201, description: 'KYC documents submitted for review' })
  @ApiResponse({ status: 400, description: 'Invalid documents or category mismatch' })
  async submitKyc(
    @CurrentUser('id') userId: string,
    @Body() dto: SubmitKycDto,
  ) {
    return this.kycService.submitKyc(userId, dto);
  }

  // --- ADMIN & SUB_ADMIN Moderation Endpoints ---

  @Get('admin/submissions')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUB_ADMIN)
  @ApiOperation({ summary: 'Admin: List KYC verification submissions with filtering' })
  @ApiResponse({ status: 200, description: 'List of submissions returned' })
  async listKycSubmissions(@Query() query: KycListQueryDto) {
    return this.kycService.listKycSubmissions(query);
  }

  @Get('admin/submissions/:id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUB_ADMIN)
  @ApiOperation({ summary: 'Admin: Get KYC verification submission by ID with secure signed document preview URLs' })
  @ApiResponse({ status: 200, description: 'KYC details with private R2 signed URLs' })
  async getKycSubmissionById(
    @CurrentUser('id') adminId: string,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    return this.kycService.getKycSubmissionById(adminId, id);
  }

  @Patch('admin/submissions/:id/review')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUB_ADMIN)
  @ApiOperation({ summary: 'Admin: Approve, reject, or mark under review for a KYC submission' })
  @ApiResponse({ status: 200, description: 'KYC submission reviewed successfully' })
  async reviewKycSubmission(
    @CurrentUser('id') adminId: string,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: ReviewKycDto,
  ) {
    return this.kycService.reviewKycSubmission(adminId, id, dto);
  }
}
