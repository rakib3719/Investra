import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { MediaService } from './media.service';
import { PresignUploadDto } from './dto/presign-upload.dto';
import { ConfirmUploadDto } from './dto/confirm-upload.dto';

@ApiTags('media')
@Controller('api/v1/media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('presign-upload')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Request a time-limited Presigned S3 PUT URL for direct browser upload to Cloudflare R2',
  })
  @ApiResponse({ status: 201, description: 'Presigned upload URL issued successfully' })
  @ApiResponse({ status: 400, description: 'File size, category, or MIME type rejected by policy' })
  async presignUpload(
    @CurrentUser('id') userId: string,
    @Body() dto: PresignUploadDto,
  ) {
    return this.mediaService.presignUpload(userId, dto);
  }

  @Post('confirm-upload')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Verify uploaded object existence in R2 via HeadObject and promote to UPLOADED status',
  })
  @ApiResponse({ status: 200, description: 'Upload confirmed into UPLOADED status' })
  @ApiResponse({ status: 400, description: 'Object not found or file size verification failed' })
  async confirmUpload(
    @CurrentUser('id') userId: string,
    @Body() dto: ConfirmUploadDto,
  ) {
    return this.mediaService.confirmUpload(userId, dto.mediaId);
  }

  @Get(':id/signed-url')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Retrieve access URL for media (derived CDN URL for public, temporary presigned GET for private)',
  })
  @ApiResponse({ status: 200, description: 'Access URL generated' })
  @ApiResponse({ status: 403, description: 'Unauthorized to access private media' })
  async getMediaUrl(
    @CurrentUser() user: any,
    @Param('id', new ParseUUIDPipe({ version: '4' })) mediaId: string,
  ) {
    return this.mediaService.getMediaAccessUrl(user.id, user.role, mediaId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Explicitly delete an unattached UPLOADED or owned active media file',
  })
  @ApiResponse({ status: 200, description: 'Media deleted' })
  @ApiResponse({ status: 403, description: 'Forbidden from deleting this media' })
  async deleteMedia(
    @CurrentUser() user: any,
    @Param('id', new ParseUUIDPipe({ version: '4' })) mediaId: string,
  ) {
    return this.mediaService.deleteMedia(user.id, user.role, mediaId);
  }

  @Post('internal/cleanup')
  @ApiOperation({
    summary: 'Idempotent orphan cleanup for stale PENDING_UPLOAD and unattached UPLOADED files (>24 hours)',
  })
  @ApiHeader({
    name: 'x-cleanup-secret',
    description: 'Shared maintenance secret token',
    required: true,
  })
  async cleanupStale(
    @Headers('x-cleanup-secret') cleanupSecret: string,
  ) {
    return this.mediaService.cleanupStaleMedia(cleanupSecret);
  }
}
