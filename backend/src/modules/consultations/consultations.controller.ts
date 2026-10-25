import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ConsultationsService } from './consultations.service';
import { CreateSlotDto } from './dto/create-slot.dto';
import {
  BookSessionDto,
  UpdateMeetingLinkDto,
  UpdateConsultantMeetingPreferenceDto,
} from './dto/book-session.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../../common/enums/user-role.enum';

@Controller('consultations')
export class ConsultationsController {
  constructor(private readonly consultationsService: ConsultationsService) {}

  // ==========================================
  // 1. PUBLIC: GET AVAILABLE SLOTS FOR A CONSULTANT
  // ==========================================
  @Get('slots/public/:consultantId')
  async getPublicAvailableSlots(
    @Param('consultantId', ParseUUIDPipe) consultantId: string,
  ) {
    return this.consultationsService.getPublicAvailableSlots(consultantId);
  }

  // ==========================================
  // 2. CONSULTANT: SLOTS MANAGEMENT
  // ==========================================
  @Post('slots')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CONSULTANT, UserRole.ADMIN)
  async createSlot(
    @CurrentUser('id') consultantId: string,
    @Body() dto: CreateSlotDto,
  ) {
    return this.consultationsService.createSlot(consultantId, dto);
  }

  @Get('slots/my-slots')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CONSULTANT, UserRole.ADMIN)
  async getMySlots(@CurrentUser('id') consultantId: string) {
    return this.consultationsService.getMySlots(consultantId);
  }

  @Delete('slots/:slotId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CONSULTANT, UserRole.ADMIN)
  async deleteSlot(
    @CurrentUser('id') consultantId: string,
    @Param('slotId', ParseUUIDPipe) slotId: string,
  ) {
    return this.consultationsService.deleteSlot(consultantId, slotId);
  }

  // ==========================================
  // 3. BOOKING SESSION (CLIENT)
  // ==========================================
  @Post('bookings/checkout')
  @UseGuards(JwtAuthGuard)
  async bookSession(
    @CurrentUser('id') clientId: string,
    @Body() dto: BookSessionDto,
  ) {
    return this.consultationsService.bookSession(clientId, dto);
  }

  @Get('bookings/my-bookings')
  @UseGuards(JwtAuthGuard)
  async getMyClientBookings(@CurrentUser('id') clientId: string) {
    return this.consultationsService.getMyClientBookings(clientId);
  }

  // ==========================================
  // 4. CONSULTANT SESSIONS & PREFERENCES
  // ==========================================
  @Get('bookings/my-sessions')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CONSULTANT, UserRole.ADMIN)
  async getMyConsultantSessions(@CurrentUser('id') consultantId: string) {
    return this.consultationsService.getMyConsultantSessions(consultantId);
  }

  @Patch('bookings/:bookingId/meeting-link')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CONSULTANT, UserRole.ADMIN)
  async updateMeetingLink(
    @CurrentUser('id') consultantId: string,
    @Param('bookingId', ParseUUIDPipe) bookingId: string,
    @Body() dto: UpdateMeetingLinkDto,
  ) {
    return this.consultationsService.updateMeetingLink(
      consultantId,
      bookingId,
      dto,
    );
  }

  @Patch('preference/meeting-link')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CONSULTANT, UserRole.ADMIN)
  async updateDefaultMeetingPreference(
    @CurrentUser('id') consultantId: string,
    @Body() dto: UpdateConsultantMeetingPreferenceDto,
  ) {
    return this.consultationsService.updateDefaultMeetingPreference(
      consultantId,
      dto,
    );
  }

  // ==========================================
  // 5. FINANCIAL BREAKDOWN (COURSES + SESSIONS)
  // ==========================================
  @Get('earnings/breakdown')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CONSULTANT, UserRole.ADMIN)
  async getConsultantUnifiedEarnings(@CurrentUser('id') consultantId: string) {
    return this.consultationsService.getConsultantUnifiedEarnings(consultantId);
  }

  // ==========================================
  // 6. ADMIN: ALL SESSIONS & 10% PLATFORM REVENUE
  // ==========================================
  @Get('admin/overview')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUB_ADMIN)
  async getAdminSessionOverview() {
    return this.consultationsService.getAdminSessionOverview();
  }
}
