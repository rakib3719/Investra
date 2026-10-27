import { Module } from "@nestjs/common";
import { AdminUsersController } from "./admin-users.controller";
import { AdminUsersService } from "./admin-users.service";
import { SubAdminController } from "./sub-admin.controller";
import { SubAdminService } from "./sub-admin.service";

@Module({
  controllers: [AdminUsersController, SubAdminController],
  providers: [AdminUsersService, SubAdminService],
  exports: [AdminUsersService, SubAdminService],
})
export class AdminModule {}
