import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Prisma } from '@prisma/client';
import { UserRole } from '../../common/enums/user-role.enum';
import { MediaAccessType } from '../../common/enums/media-access-type.enum';
import { MediaCategory } from '../../common/enums/media-category.enum';
import { MediaUploadStatus } from '../../common/enums/media-upload-status.enum';
import { MediaFileRecord } from '../../common/interfaces/media-file.interface';
import { PrismaService } from '../../prisma/prisma.service';
import { env } from '../../common/config/env.config';
import { R2StorageService } from './r2-storage.service';
import {
  MEDIA_POLICY,
  validateMediaPolicy,
} from './media-policy.config';
import { PresignUploadDto } from './dto/presign-upload.dto';

export interface FormattedMediaResponse {
  id: string;
  key: string;
  bucket: string;
  originalName: string;
  mimeType: string;
  sizeBytes: string;
  accessType: MediaAccessType;
  category: MediaCategory;
  status: MediaUploadStatus;
  url: string | null;
  uploadedById: string;
  createdAt: Date;
  activatedAt: Date | null;
}

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly r2StorageService: R2StorageService,
  ) {}

  /**
   * Helper to format MediaFile entity for API output, serializing BigInt and deriving public URL.
   */
  formatMedia(media: MediaFileRecord): FormattedMediaResponse {
    let url: string | null = null;
    if (media.accessType === MediaAccessType.PUBLIC && env.R2_PUBLIC_URL) {
      url = this.derivePublicUrl(media.key);
    }

    return {
      id: media.id,
      key: media.key,
      bucket: media.bucket,
      originalName: media.originalName,
      mimeType: media.mimeType,
      sizeBytes: media.sizeBytes.toString(),
      accessType: media.accessType,
      category: media.category,
      status: media.status,
      url,
      uploadedById: media.uploadedById,
      createdAt: media.createdAt,
      activatedAt: media.activatedAt ?? null,
    };
  }

  /**
   * Derives full public URL from base configuration and object key.
   */
  derivePublicUrl(key: string): string {
    const base = env.R2_PUBLIC_URL.replace(/\/+$/, '');
    return `${base}/${key}`;
  }

  /**
   * 1. Presign Direct Upload
   * Validates metadata against server policy, generates an R2 object key, registers
   * MediaFile record in PENDING_UPLOAD status, and returns a 15-minute Presigned PUT URL.
   */
  async presignUpload(
    userId: string,
    dto: PresignUploadDto,
  ): Promise<{
    mediaId: string;
    uploadUrl: string;
    key: string;
    bucket: string;
    accessType: MediaAccessType;
    category: MediaCategory;
    expiresInSeconds: number;
  }> {
    let policyDetails;
    try {
      policyDetails = validateMediaPolicy(
        dto.category,
        dto.fileType,
        dto.fileSize,
        dto.fileName,
      );
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }

    const { policy, extension } = policyDetails;

    // Resolve target bucket based on policy
    const bucket =
      policy.targetBucketEnv === 'R2_PUBLIC_BUCKET_NAME'
        ? env.R2_PUBLIC_BUCKET_NAME
        : env.R2_PRIVATE_BUCKET_NAME;

    if (!bucket) {
      this.logger.error(`Storage bucket for ${policy.targetBucketEnv} is not configured.`);
      throw new InternalServerErrorException('Storage bucket configuration error.');
    }

    // Generate safe unique key: prefix/userId/uuid.extension
    const fileId = randomUUID();
    const key = `${policy.keyPrefix}/${userId}/${fileId}.${extension}`;

    // Create DB record with PENDING_UPLOAD
    const media = await this.prisma.mediaFile.create({
      data: {
        id: fileId,
        key,
        bucket,
        originalName: dto.fileName.substring(0, 255),
        mimeType: dto.fileType.toLowerCase().trim(),
        sizeBytes: BigInt(dto.fileSize),
        accessType: policy.accessType,
        category: dto.category,
        status: MediaUploadStatus.PENDING_UPLOAD,
        uploadedById: userId,
      },
    });

    const expiresInSeconds = 900; // 15 minutes
    const uploadUrl = await this.r2StorageService.createPresignedPutUrl(
      bucket,
      key,
      dto.fileType,
      expiresInSeconds,
    );

    return {
      mediaId: media.id,
      uploadUrl,
      key,
      bucket,
      accessType: media.accessType,
      category: media.category,
      expiresInSeconds,
    };
  }

  /**
   * 2. Confirm Upload
   * Checks file existence and byte size via R2 HeadObject, and promotes
   * status from PENDING_UPLOAD to UPLOADED (NOT ACTIVE).
   */
  async confirmUpload(
    userId: string,
    mediaId: string,
  ): Promise<FormattedMediaResponse> {
    const media = await this.prisma.mediaFile.findUnique({
      where: { id: mediaId },
    });

    if (!media) {
      throw new NotFoundException('Media record not found.');
    }

    if (media.uploadedById !== userId) {
      throw new ForbiddenException('You do not own this media record.');
    }

    if (media.status === MediaUploadStatus.DELETED) {
      throw new BadRequestException('This media record was previously deleted.');
    }

    // Verify object in Cloudflare R2
    const head = await this.r2StorageService.headObject(media.bucket, media.key);
    const actualBytes = head.ContentLength ?? 0;

    if (actualBytes === 0) {
      throw new BadRequestException('Uploaded object in storage is empty (0 bytes).');
    }

    // If size differs by more than 10% from declared size, reject
    const declaredBytes = Number(media.sizeBytes);
    if (declaredBytes > 0 && Math.abs(actualBytes - declaredBytes) / declaredBytes > 0.1) {
      this.logger.warn(
        `Upload size mismatch for ${media.key}: declared ${declaredBytes}, got ${actualBytes}`,
      );
      throw new BadRequestException(
        'Uploaded file size differs significantly from initial declaration.',
      );
    }

    // Promote to UPLOADED (retains UPLOADED until attached to a business entity)
    const updated = await this.prisma.mediaFile.update({
      where: { id: media.id },
      data: {
        status: MediaUploadStatus.UPLOADED,
        sizeBytes: BigInt(actualBytes),
      },
    });

    return this.formatMedia(updated);
  }

  /**
   * 3. Download / View URL Generation
   * If PUBLIC: returns derived public URL.
   * If PRIVATE: checks authorization (owner, compliance admin), and issues a temporary signed GET URL.
   */
  async getMediaAccessUrl(
    userId: string,
    userRole: UserRole,
    mediaId: string,
  ): Promise<{
    url: string;
    isPublic: boolean;
    expiresInSeconds?: number;
    mimeType: string;
    originalName: string;
  }> {
    const media = await this.prisma.mediaFile.findUnique({
      where: { id: mediaId },
    });

    if (!media || media.status === MediaUploadStatus.DELETED) {
      throw new NotFoundException('Media file not found or has been deleted.');
    }

    // If PUBLIC, return derived URL directly
    if (media.accessType === MediaAccessType.PUBLIC) {
      return {
        url: this.derivePublicUrl(media.key),
        isPublic: true,
        mimeType: media.mimeType,
        originalName: media.originalName,
      };
    }

    // If PRIVATE, enforce authorization
    const isOwner = media.uploadedById === userId;
    const isAdmin = userRole === UserRole.ADMIN;

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException(
        'You are not authorized to view or download this private file.',
      );
    }

    const expiresInSeconds = 900; // 15 minutes
    const signedUrl = await this.r2StorageService.createPresignedGetUrl(
      media.bucket,
      media.key,
      expiresInSeconds,
    );

    return {
      url: signedUrl,
      isPublic: false,
      expiresInSeconds,
      mimeType: media.mimeType,
      originalName: media.originalName,
    };
  }

  /**
   * 4. Explicit Delete Media
   * Allows owner or admin to delete an unattached UPLOADED or active file.
   */
  async deleteMedia(
    userId: string,
    userRole: UserRole,
    mediaId: string,
  ): Promise<{ success: boolean; message: string }> {
    const media = await this.prisma.mediaFile.findUnique({
      where: { id: mediaId },
    });

    if (!media || media.status === MediaUploadStatus.DELETED) {
      return { success: true, message: 'Media is already deleted.' };
    }

    if (media.uploadedById !== userId && userRole !== UserRole.ADMIN) {
      throw new ForbiddenException('You do not have permission to delete this file.');
    }

    // Transition to DELETE_PENDING
    await this.prisma.mediaFile.update({
      where: { id: media.id },
      data: { status: MediaUploadStatus.DELETE_PENDING },
    });

    // Delete from R2
    const r2Success = await this.r2StorageService.deleteObject(
      media.bucket,
      media.key,
    );

    if (r2Success) {
      await this.prisma.mediaFile.update({
        where: { id: media.id },
        data: {
          status: MediaUploadStatus.DELETED,
          deletedAt: new Date(),
        },
      });
    }

    return {
      success: true,
      message: 'Media deleted successfully.',
    };
  }

  /**
   * 5. Safe Media Replacement Helper
   * Can be called inside database transactions when updating a parent entity.
   * Promotes newMediaId to ACTIVE.
   * If oldMediaId exists and differs, sets oldMediaId to DELETE_PENDING and deletes it.
   */
  async replaceEntityMedia(
    newMediaId: string,
    oldMediaId: string | null | undefined,
    tx: Prisma.TransactionClient,
  ): Promise<void> {
    // Promote new media to ACTIVE
    await tx.mediaFile.update({
      where: { id: newMediaId },
      data: {
        status: MediaUploadStatus.ACTIVE,
        activatedAt: new Date(),
      },
    });

    // If replacing an existing active media
    if (oldMediaId && oldMediaId !== newMediaId) {
      await tx.mediaFile.update({
        where: { id: oldMediaId },
        data: { status: MediaUploadStatus.DELETE_PENDING },
      });

      // Post-commit async deletion attempt
      setImmediate(async () => {
        try {
          const oldMedia = await this.prisma.mediaFile.findUnique({
            where: { id: oldMediaId },
          });
          if (oldMedia) {
            await this.r2StorageService.deleteObject(oldMedia.bucket, oldMedia.key);
            await this.prisma.mediaFile.update({
              where: { id: oldMediaId },
              data: {
                status: MediaUploadStatus.DELETED,
                deletedAt: new Date(),
              },
            });
          }
        } catch (err: any) {
          this.logger.warn(
            `Asynchronous cleanup failed for old media ${oldMediaId}: ${err.message}`,
          );
        }
      });
    }
  }

  /**
   * 6. Free-Hosting-Compatible Orphan Cleanup
   * Purges PENDING_UPLOAD or unattached UPLOADED records older than 24 hours,
   * as well as stuck DELETE_PENDING records.
   */
  async cleanupStaleMedia(secret: string): Promise<{
    deletedCount: number;
    failedCount: number;
  }> {
    if (!secret || secret !== env.MEDIA_CLEANUP_SECRET) {
      throw new UnauthorizedException('Invalid maintenance secret.');
    }

    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago

    // Find candidate stale files
    const staleMedia = await this.prisma.mediaFile.findMany({
      where: {
        OR: [
          {
            status: {
              in: [
                MediaUploadStatus.PENDING_UPLOAD,
                MediaUploadStatus.UPLOADED,
              ],
            },
            createdAt: { lt: cutoff },
          },
          {
            status: MediaUploadStatus.DELETE_PENDING,
          },
        ],
      },
      take: 100, // Batch limit
    });

    let deletedCount = 0;
    let failedCount = 0;

    for (const item of staleMedia) {
      try {
        await this.r2StorageService.deleteObject(item.bucket, item.key);
        await this.prisma.mediaFile.update({
          where: { id: item.id },
          data: {
            status: MediaUploadStatus.DELETED,
            deletedAt: new Date(),
          },
        });
        deletedCount++;
      } catch (err: any) {
        this.logger.error(
          `Failed cleaning stale media ${item.id} (${item.key}): ${err.message}`,
        );
        failedCount++;
      }
    }

    this.logger.log(
      `Cleanup routine executed: ${deletedCount} purged, ${failedCount} errors.`,
    );

    return { deletedCount, failedCount };
  }
}
