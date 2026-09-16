import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { CsrfOriginGuard } from '../../common/guards/csrf-origin.guard';
import { CreateVisitorInsightDto } from './dto/create-visitor-insight.dto';
import { VisitorInsightsService } from './visitor-insights.service';
import { VisitorInsightRateLimitGuard } from './visitor-insight-rate-limit.guard';

@Controller()
export class VisitorInsightsController {
  constructor(private readonly visitorInsightsService: VisitorInsightsService) {}

  @Post('visitor-insights/collect')
  @UseGuards(VisitorInsightRateLimitGuard, CsrfOriginGuard)
  collect(@Req() request: Request, @Body() dto: CreateVisitorInsightDto) {
    return this.visitorInsightsService.collect(request, dto);
  }

  @Get('admin/visitor-insights')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  getAdminOverview(
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
  ) {
    return this.visitorInsightsService.getAdminOverview(limit);
  }
}
