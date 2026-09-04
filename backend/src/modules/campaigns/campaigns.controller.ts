import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { CampaignStatus } from "@prisma/client";
import { UserRole } from "../../common/enums/user-role.enum";
import { CampaignsService } from "./campaigns.service";
import { CreateCampaignDto } from "./dto/create-campaign.dto";
import { UpdateCampaignDto } from "./dto/update-campaign.dto";
import { CreateMilestoneDto } from "./dto/create-milestone.dto";
import { UpdateCampaignStatusDto } from "./dto/update-campaign-status.dto";
import { CampaignQueryDto } from "./dto/campaign-query.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { CsrfOriginGuard } from "../../common/guards/csrf-origin.guard";

@Controller()
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Get("campaigns/categories")
  getCategories() {
    return this.campaignsService.getCategories();
  }

  @Get("categories")
  getAllCategories() {
    return this.campaignsService.getCategories();
  }

  @Get("campaigns")
  getPublicCampaigns(@Query() query: CampaignQueryDto) {
    return this.campaignsService.getPublicCampaigns(query);
  }

  @Get("campaigns/:slug")
  getCampaignBySlug(
    @Param("slug") slug: string,
    @CurrentUser("id") userId?: string,
    @CurrentUser("role") role?: string,
  ) {
    return this.campaignsService.getCampaignBySlug(slug, userId, role);
  }

  @Get("entrepreneur/my-campaigns")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ENTREPRENEUR, UserRole.ADMIN)
  getMyCampaigns(@CurrentUser("id") userId: string) {
    return this.campaignsService.getMyCampaigns(userId);
  }

  @Post("campaigns")
  @UseGuards(JwtAuthGuard, RolesGuard, CsrfOriginGuard)
  @Roles(UserRole.ENTREPRENEUR, UserRole.ADMIN)
  createCampaign(
    @CurrentUser("id") userId: string,
    @Body() dto: CreateCampaignDto,
  ) {
    return this.campaignsService.createCampaign(userId, dto);
  }

  @Patch("campaigns/:id")
  @UseGuards(JwtAuthGuard, RolesGuard, CsrfOriginGuard)
  @Roles(UserRole.ENTREPRENEUR, UserRole.ADMIN)
  updateCampaign(
    @CurrentUser("id") userId: string,
    @CurrentUser("role") role: string,
    @Param("id") campaignId: string,
    @Body() dto: UpdateCampaignDto,
  ) {
    return this.campaignsService.updateCampaign(
      userId,
      campaignId,
      dto,
      role === UserRole.ADMIN,
    );
  }

  @Post("campaigns/:id/submit-review")
  @UseGuards(JwtAuthGuard, RolesGuard, CsrfOriginGuard)
  @Roles(UserRole.ENTREPRENEUR)
  submitForReview(
    @CurrentUser("id") userId: string,
    @Param("id") campaignId: string,
  ) {
    return this.campaignsService.submitForReview(userId, campaignId);
  }

  @Post("campaigns/:id/milestones")
  @UseGuards(JwtAuthGuard, RolesGuard, CsrfOriginGuard)
  @Roles(UserRole.ENTREPRENEUR, UserRole.ADMIN)
  addMilestone(
    @CurrentUser("id") userId: string,
    @Param("id") campaignId: string,
    @Body() dto: CreateMilestoneDto,
  ) {
    return this.campaignsService.addMilestone(userId, campaignId, dto);
  }

  @Patch("campaigns/milestones/:id")
  @UseGuards(JwtAuthGuard, RolesGuard, CsrfOriginGuard)
  @Roles(UserRole.ENTREPRENEUR, UserRole.ADMIN)
  updateMilestone(
    @CurrentUser("id") userId: string,
    @Param("id") milestoneId: string,
    @Body() dto: Partial<CreateMilestoneDto>,
  ) {
    return this.campaignsService.updateMilestone(userId, milestoneId, dto);
  }

  @Get("admin/campaigns")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  getAdminCampaigns(
    @Query("status") status?: CampaignStatus,
    @Query("page") page?: number,
    @Query("limit") limit?: number,
  ) {
    return this.campaignsService.getAdminCampaigns(status, page, limit);
  }

  @Patch("admin/campaigns/:id/status")
  @UseGuards(JwtAuthGuard, RolesGuard, CsrfOriginGuard)
  @Roles(UserRole.ADMIN)
  updateCampaignStatus(
    @Param("id") campaignId: string,
    @Body() dto: UpdateCampaignStatusDto,
  ) {
    return this.campaignsService.updateCampaignStatus(campaignId, dto);
  }
}
