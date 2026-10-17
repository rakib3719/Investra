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
  Req,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { RequestPayoutDto, UpdatePayoutStatusDto } from './dto/payout.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { CourseLevel, CourseStatus, PayoutStatus } from '@prisma/client';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  // ==========================================
  // 1. PUBLIC ROUTES
  // ==========================================
  @Get('public')
  async getPublicCourses(
    @Query('category') category?: string,
    @Query('level') level?: CourseLevel,
    @Query('search') search?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.coursesService.getPublicCourses({
      category,
      level,
      search,
      minPrice,
      maxPrice,
      page,
      limit,
    });
  }

  @Get('public/consultants')
  async getVerifiedConsultants() {
    return this.coursesService.getVerifiedConsultants();
  }

  @Get('public/:slug')
  @UseGuards(OptionalJwtAuthGuard)
  async getPublicCourseBySlug(
    @Param('slug') slug: string,
    @Req() req: any,
  ) {
    const userId = req.user?.id || undefined;
    return this.coursesService.getPublicCourseBySlug(slug, userId);
  }

  // ==========================================
  // 2. ENROLLMENT & CHECKOUT
  // ==========================================
  @Post(':id/enroll')
  @UseGuards(JwtAuthGuard)
  async enrollInCourse(
    @Param('id', ParseUUIDPipe) courseId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.coursesService.enrollInCourse(courseId, userId);
  }

  @Post('verify-session')
  @UseGuards(JwtAuthGuard)
  async verifySession(
    @CurrentUser('id') userId: string,
    @Body('sessionId') sessionId: string,
  ) {
    return this.coursesService.verifyAndEnrollPaidCourse(userId, sessionId);
  }

  // ==========================================
  // 3. STUDENT (ENROLLED) CLASSROOM & PROGRESS
  // ==========================================
  @Get('my-enrolled')
  @UseGuards(JwtAuthGuard)
  async getMyEnrolledCourses(@CurrentUser('id') userId: string) {
    return this.coursesService.getStudentEnrolledCourses(userId);
  }

  @Get('my-enrolled/:slug')
  @UseGuards(JwtAuthGuard)
  async getMyEnrolledCourseClassroom(
    @Param('slug') slug: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.coursesService.getStudentClassroom(slug, userId);
  }

  @Post('my-enrolled/:courseId/lessons/:lessonId/complete')
  @UseGuards(JwtAuthGuard)
  async toggleLessonComplete(
    @Param('courseId', ParseUUIDPipe) courseId: string,
    @Param('lessonId', ParseUUIDPipe) lessonId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.coursesService.toggleLessonCompletion(courseId, lessonId, userId);
  }

  // ==========================================
  // 4. CONSULTANT CREATOR STUDIO (KYC GATED)
  // ==========================================
  @Get('creator/my-courses')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CONSULTANT, UserRole.ADMIN, UserRole.SUB_ADMIN)
  async getMyCreatedCourses(@CurrentUser('id') userId: string) {
    return this.coursesService.getConsultantCourses(userId);
  }

  @Get('creator/my-courses/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CONSULTANT, UserRole.ADMIN, UserRole.SUB_ADMIN)
  async getCourseByIdForCreator(
    @Param('id', ParseUUIDPipe) courseId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.coursesService.getConsultantCourseById(courseId, userId);
  }

  @Post('creator')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CONSULTANT, UserRole.ADMIN, UserRole.SUB_ADMIN)
  async createCourse(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateCourseDto,
  ) {
    return this.coursesService.createCourse(userId, dto);
  }

  @Patch('creator/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CONSULTANT, UserRole.ADMIN, UserRole.SUB_ADMIN)
  async updateCourse(
    @Param('id', ParseUUIDPipe) courseId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateCourseDto,
  ) {
    return this.coursesService.updateCourse(courseId, userId, dto);
  }

  @Delete('creator/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CONSULTANT, UserRole.ADMIN, UserRole.SUB_ADMIN)
  async deleteCourse(
    @Param('id', ParseUUIDPipe) courseId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.coursesService.deleteCourse(courseId, userId);
  }

  @Post('creator/:courseId/lessons')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CONSULTANT, UserRole.ADMIN, UserRole.SUB_ADMIN)
  async addLesson(
    @Param('courseId', ParseUUIDPipe) courseId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: CreateLessonDto,
  ) {
    return this.coursesService.addLesson(courseId, userId, dto);
  }

  @Patch('creator/:courseId/lessons/:lessonId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CONSULTANT, UserRole.ADMIN, UserRole.SUB_ADMIN)
  async updateLesson(
    @Param('courseId', ParseUUIDPipe) courseId: string,
    @Param('lessonId', ParseUUIDPipe) lessonId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateLessonDto,
  ) {
    return this.coursesService.updateLesson(courseId, lessonId, userId, dto);
  }

  @Delete('creator/:courseId/lessons/:lessonId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CONSULTANT, UserRole.ADMIN, UserRole.SUB_ADMIN)
  async deleteLesson(
    @Param('courseId', ParseUUIDPipe) courseId: string,
    @Param('lessonId', ParseUUIDPipe) lessonId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.coursesService.deleteLesson(courseId, lessonId, userId);
  }

  @Get('creator/earnings')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CONSULTANT, UserRole.ADMIN, UserRole.SUB_ADMIN)
  async getEarnings(@CurrentUser('id') userId: string) {
    return this.coursesService.getConsultantEarnings(userId);
  }

  @Post('creator/withdraw')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CONSULTANT, UserRole.ADMIN, UserRole.SUB_ADMIN)
  async requestWithdrawal(
    @CurrentUser('id') userId: string,
    @Body() dto: RequestPayoutDto,
  ) {
    return this.coursesService.requestWithdrawal(userId, dto);
  }

  // ==========================================
  // 5. ADMIN MANAGEMENT & PAYOUTS
  // ==========================================
  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUB_ADMIN)
  async getAdminAllCourses() {
    return this.coursesService.getAdminCourses();
  }

  @Patch('admin/:id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUB_ADMIN)
  async updateCourseStatusByAdmin(
    @Param('id', ParseUUIDPipe) courseId: string,
    @Body('status') status?: CourseStatus,
    @Body('isFeatured') isFeatured?: boolean,
  ) {
    return this.coursesService.updateCourseStatusByAdmin(courseId, status, isFeatured);
  }

  @Get('admin/payouts')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUB_ADMIN)
  async getAdminPayouts(@Query('status') status?: PayoutStatus) {
    return this.coursesService.getAdminPayouts(status);
  }

  @Patch('admin/payouts/:id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUB_ADMIN)
  async updatePayoutStatus(
    @Param('id', ParseUUIDPipe) payoutId: string,
    @CurrentUser('id') adminUserId: string,
    @Body() dto: UpdatePayoutStatusDto,
  ) {
    return this.coursesService.updatePayoutStatus(payoutId, adminUserId, dto);
  }
}
