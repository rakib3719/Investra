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
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { CsrfOriginGuard } from "../../common/guards/csrf-origin.guard";
import { AdminUsersService } from "./admin-users.service";
import { AdminUsersQueryDto } from "./dto/admin-users-query.dto";
import { UpdateUserStatusDto } from "./dto/update-user-status.dto";

@Controller("admin")
@UseGuards(JwtAuthGuard, RolesGuard, CsrfOriginGuard)
@Roles(UserRole.ADMIN)
export class AdminUsersController {
  constructor(private readonly adminUsersService: AdminUsersService) {}

  @Get("users")
  getUsers(@Query() query: AdminUsersQueryDto) {
    return this.adminUsersService.getUsers(query);
  }

  @Get("users/:id")
  getUserById(@Param("id") id: string) {
    return this.adminUsersService.getUserById(id);
  }

  @Patch("users/:id/status")
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
  getOverviewStats() {
    return this.adminUsersService.getOverviewStats();
  }
}
