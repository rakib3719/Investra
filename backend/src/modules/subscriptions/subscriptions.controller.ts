import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { CreatePlanTierDto, UpdatePlanTierDto } from './dto/plan-tier.dto';
import { QueryPlansDto } from './dto/query-plans.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';

import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('subscriptions')
export class SubscriptionsPublicController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get('plans')
  async getPublicPlans(@Query() query: QueryPlansDto) {
    return this.subscriptionsService.getPublicPlans(query.role);
  }

  @Get('my-entitlements')
  @UseGuards(JwtAuthGuard)
  async getMyEntitlements(
    @CurrentUser('id') userId: string,
    @CurrentUser('role') role: any,
  ) {
    const sub = await this.subscriptionsService.checkUserEntitlement(userId, 'campaign_post_limit', role);
    return sub;
  }

  @Post('checkout')
  @UseGuards(JwtAuthGuard)
  async checkoutPlan(
    @CurrentUser('id') userId: string,
    @Body('planId', ParseUUIDPipe) planId: string,
    @Body('billingInterval') billingInterval?: any,
  ) {
    return this.subscriptionsService.subscribeUserToPlan(userId, planId, billingInterval);
  }
}

@Controller('admin/subscriptions')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUB_ADMIN)
export class SubscriptionsAdminController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get('features')
  async getFeatures(@Query() query: QueryPlansDto) {
    return this.subscriptionsService.getPlatformFeatures(query.role);
  }

  @Get('plans')
  async getPlans(@Query() query: QueryPlansDto) {
    return this.subscriptionsService.getAdminPlans(query.role);
  }

  @Get('plans/:id')
  async getPlanById(@Param('id', ParseUUIDPipe) id: string) {
    return this.subscriptionsService.getPlanById(id);
  }

  @Post('plans')
  async createPlan(@Body() dto: CreatePlanTierDto) {
    return this.subscriptionsService.createPlan(dto);
  }

  @Patch('plans/:id')
  async updatePlan(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePlanTierDto,
  ) {
    return this.subscriptionsService.updatePlan(id, dto);
  }

  @Delete('plans/:id')
  async deletePlan(@Param('id', ParseUUIDPipe) id: string) {
    return this.subscriptionsService.deletePlan(id);
  }
}
