import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '../../common/enums/user-role.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CsrfOriginGuard } from '../../common/guards/csrf-origin.guard';
import { SubAdminService } from './sub-admin.service';
import { CreateSubAdminDto } from './dto/create-sub-admin.dto';
import { UpdateSubAdminPermissionsDto } from './dto/update-sub-admin-permissions.dto';

@ApiTags('Admin - Sub-Admin Management')
@Controller('admin/sub-admins')
@UseGuards(JwtAuthGuard, RolesGuard, CsrfOriginGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
@ApiCookieAuth('accessToken')
export class SubAdminController {
  constructor(private readonly subAdminService: SubAdminService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new sub-admin with assigned permissions' })
  async createSubAdmin(
    @CurrentUser('id') adminId: string,
    @Body() dto: CreateSubAdminDto,
  ) {
    return this.subAdminService.createSubAdmin(adminId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all sub-administrators and their active permissions' })
  async listSubAdmins() {
    return this.subAdminService.listSubAdmins();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a single sub-administrator' })
  async getSubAdminById(@Param('id', ParseUUIDPipe) id: string) {
    return this.subAdminService.getSubAdminById(id);
  }

  @Patch(':id/permissions')
  @ApiOperation({ summary: 'Update permissions and scope for a sub-administrator' })
  async updateSubAdminPermissions(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateSubAdminPermissionsDto,
  ) {
    return this.subAdminService.updateSubAdminPermissions(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete or revoke a sub-administrator account' })
  async deleteSubAdmin(@Param('id', ParseUUIDPipe) id: string) {
    return this.subAdminService.deleteSubAdmin(id);
  }
}
