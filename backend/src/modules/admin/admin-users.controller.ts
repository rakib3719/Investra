import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from "@nestjs/common";
import { UserRole } from "../../common/enums/user-role.enum";
import { AdminPermission } from "../../common/enums/admin-permission.enum";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { PermissionsGuard } from "../auth/guards/permissions.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { Permissions } from "../auth/decorators/permissions.decorator";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { CsrfOriginGuard } from "../../common/guards/csrf-origin.guard";
import { AdminUsersService } from "./admin-users.service";
import { AdminUsersQueryDto } from "./dto/admin-users-query.dto";
import { UpdateUserStatusDto } from "./dto/update-user-status.dto";

@Controller("admin")
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard, CsrfOriginGuard)
@Roles(UserRole.ADMIN, UserRole.SUB_ADMIN)
export class AdminUsersController {
  constructor(private readonly adminUsersService: AdminUsersService) {}

  @Get("users")
  @Permissions(AdminPermission.USER_MANAGEMENT)
  getUsers(@Query() query: AdminUsersQueryDto) {
    return this.adminUsersService.getUsers(query);
  }

  @Get("users/:id")
  @Permissions(AdminPermission.USER_MANAGEMENT)
  getUserById(@Param("id") id: string) {
    return this.adminUsersService.getUserById(id);
  }

  @Patch("users/:id/status")
  @Permissions(AdminPermission.USER_MANAGEMENT)
  updateUserStatus(
    @CurrentUser("id") adminUserId: string,
    @Param("id") targetUserId: string,
    @Body() dto: UpdateUserStatusDto,
  ) {
    return this.adminUsersService.updateUserStatus(
      adminUserId,
      targetUserId,
      dto,
    );
  }

  @Get("overview-stats")
  @Permissions(
    AdminPermission.ANALYTICS_ACCESS,
    AdminPermission.USER_MANAGEMENT,
    AdminPermission.KYC_MODERATION,
    AdminPermission.CAMPAIGN_MANAGEMENT,
    AdminPermission.SUBSCRIPTION_MANAGEMENT,
  )
  getOverviewStats() {
    return this.adminUsersService.getOverviewStats();
  }
}
