import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { UserRole } from '../../common/enums/user-role.enum';
import { MediaAccessType } from '../../common/enums/media-access-type.enum';
import { MediaCategory } from '../../common/enums/media-category.enum';
import { MediaUploadStatus } from '../../common/enums/media-upload-status.enum';
import { env } from '../../common/config/env.config';
import { MediaService } from './media.service';

describe('MediaService', () => {
  let mediaService: MediaService;
  let prismaMock: any;
  let r2Mock: any;

  beforeEach(() => {
    prismaMock = {
      mediaFile: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
      },
      user: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      $transaction: jest.fn(),
    };

    r2Mock = {
      createPresignedPutUrl: jest.fn().mockResolvedValue('https://r2.cloudflarestorage.com/presigned-put'),
      createPresignedGetUrl: jest.fn().mockResolvedValue('https://r2.cloudflarestorage.com/presigned-get'),
      headObject: jest.fn(),
      deleteObject: jest.fn().mockResolvedValue(true),
    };

    mediaService = new MediaService(prismaMock, r2Mock);
  });

  describe('6.1: Presigned PUT Policy Validation', () => {
    it('should reject file exceeding category max size limit', async () => {
      await expect(
        mediaService.presignUpload('user-1', {
          fileName: 'avatar.jpg',
          fileType: 'image/jpeg',
          fileSize: 6 * 1024 * 1024, // 6MB > 5MB limit
          category: MediaCategory.AVATAR,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should reject file with unsupported MIME type', async () => {
      await expect(
        mediaService.presignUpload('user-1', {
          fileName: 'malware.exe',
          fileType: 'application/x-msdownload',
          fileSize: 1024,
          category: MediaCategory.AVATAR,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should issue presigned PUT URL and record PENDING_UPLOAD for valid file', async () => {
      prismaMock.mediaFile.create.mockResolvedValue({
        id: 'media-1',
        accessType: MediaAccessType.PUBLIC,
        category: MediaCategory.AVATAR,
      });

      const result = await mediaService.presignUpload('user-1', {
        fileName: 'photo.webp',
        fileType: 'image/webp',
        fileSize: 1024 * 1024,
        category: MediaCategory.AVATAR,
      });

      expect(result.mediaId).toBe('media-1');
      expect(result.uploadUrl).toBe('https://r2.cloudflarestorage.com/presigned-put');
      expect(prismaMock.mediaFile.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            status: MediaUploadStatus.PENDING_UPLOAD,
            accessType: MediaAccessType.PUBLIC,
          }),
        }),
      );
    });
  });

  describe('6.2: Confirm Upload Verification', () => {
    it('should verify HeadObject and promote status to UPLOADED, not ACTIVE', async () => {
      prismaMock.mediaFile.findUnique.mockResolvedValue({
        id: 'media-1',
        uploadedById: 'user-1',
        bucket: 'test-bucket',
        key: 'users/user-1/photo.webp',
        sizeBytes: BigInt(1024),
        status: MediaUploadStatus.PENDING_UPLOAD,
        accessType: MediaAccessType.PUBLIC,
      });

      r2Mock.headObject.mockResolvedValue({
        ContentLength: 1024,
      });

      prismaMock.mediaFile.update.mockResolvedValue({
        id: 'media-1',
        key: 'users/user-1/photo.webp',
        bucket: 'test-bucket',
        originalName: 'photo.webp',
        mimeType: 'image/webp',
        sizeBytes: BigInt(1024),
        accessType: MediaAccessType.PUBLIC,
        category: MediaCategory.AVATAR,
        status: MediaUploadStatus.UPLOADED,
        uploadedById: 'user-1',
        createdAt: new Date(),
        activatedAt: null,
      });

      const response = await mediaService.confirmUpload('user-1', 'media-1');

      expect(r2Mock.headObject).toHaveBeenCalledWith('test-bucket', 'users/user-1/photo.webp');
      expect(prismaMock.mediaFile.update).toHaveBeenCalledWith({
        where: { id: 'media-1' },
        data: expect.objectContaining({
          status: MediaUploadStatus.UPLOADED, // NOT ACTIVE
        }),
      });
      expect(response.status).toBe(MediaUploadStatus.UPLOADED);
    });
  });

  describe('6.3 & 6.4: Safe Entity Attachment and Replacement', () => {
    it('promotes new media to ACTIVE and transitions old media to DELETE_PENDING', async () => {
      const txMock: any = {
        mediaFile: {
          update: jest.fn().mockResolvedValue({}),
        },
      };

      await mediaService.replaceEntityMedia('new-media-id', 'old-media-id', txMock);

      // Verify new media promoted to ACTIVE
      expect(txMock.mediaFile.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'new-media-id' },
          data: expect.objectContaining({
            status: MediaUploadStatus.ACTIVE,
          }),
        }),
      );

      // Verify old media set to DELETE_PENDING
      expect(txMock.mediaFile.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'old-media-id' },
          data: expect.objectContaining({
            status: MediaUploadStatus.DELETE_PENDING,
          }),
        }),
      );
    });
  });

  describe('6.5: Private Media Authorization', () => {
    it('should throw ForbiddenException if user is not the owner or admin for private file', async () => {
      prismaMock.mediaFile.findUnique.mockResolvedValue({
        id: 'priv-doc-1',
        uploadedById: 'user-owner',
        accessType: MediaAccessType.PRIVATE,
        status: MediaUploadStatus.ACTIVE,
      });

      await expect(
        mediaService.getMediaAccessUrl('unauthorized-user', UserRole.INVESTOR, 'priv-doc-1'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should allow owner or admin to receive temporary signed GET URL for private file', async () => {
      prismaMock.mediaFile.findUnique.mockResolvedValue({
        id: 'priv-doc-1',
        uploadedById: 'user-owner',
        bucket: 'private-bucket',
        key: 'kyc/user-owner/passport.pdf',
        accessType: MediaAccessType.PRIVATE,
        status: MediaUploadStatus.ACTIVE,
        mimeType: 'application/pdf',
        originalName: 'passport.pdf',
      });

      const res = await mediaService.getMediaAccessUrl('user-owner', UserRole.ENTREPRENEUR, 'priv-doc-1');
      expect(res.url).toBe('https://r2.cloudflarestorage.com/presigned-get');
      expect(res.isPublic).toBe(false);
      expect(r2Mock.createPresignedGetUrl).toHaveBeenCalledWith('private-bucket', 'kyc/user-owner/passport.pdf', 900);
    });
  });

  describe('6.6: Cleanup Routine for Orphaned Media', () => {
    it('purges unattached UPLOADED and PENDING_UPLOAD records older than 24h', async () => {
      prismaMock.mediaFile.findMany.mockResolvedValue([
        { id: 'stale-1', bucket: 'test-bucket', key: 'stale-key-1' },
        { id: 'stale-2', bucket: 'test-bucket', key: 'stale-key-2' },
      ]);
      prismaMock.mediaFile.update.mockResolvedValue({});

      const result = await mediaService.cleanupStaleMedia(env.MEDIA_CLEANUP_SECRET);

      expect(result.deletedCount).toBe(2);
      expect(r2Mock.deleteObject).toHaveBeenCalledTimes(2);
      expect(prismaMock.mediaFile.update).toHaveBeenCalledTimes(2);
    });
  });
});
