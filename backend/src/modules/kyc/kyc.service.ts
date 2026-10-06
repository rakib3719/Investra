import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MediaService } from '../media/media.service';
import { SubmitKycDto } from './dto/submit-kyc.dto';
import { ReviewKycDto } from './dto/review-kyc.dto';
import { KycListQueryDto } from './dto/kyc-list-query.dto';
import { UserRole } from '../../common/enums/user-role.enum';
import { VerificationStatus, MediaUploadStatus, MediaCategory } from '@prisma/client';

@Injectable()
export class KycService {
  private readonly logger = new Logger(KycService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mediaService: MediaService,
  ) {}

  /**
   * Get authenticated user's current verification status & document details
   */
  async getMyKyc(userId: string) {
    const verification = await this.prisma.userVerification.findUnique({
      where: { userId },
      include: {
        frontMedia: true,
        backMedia: true,
        selfieMedia: true,
      },
    });

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        accountStatus: true,
        investorProfile: { select: { verificationStatus: true } },
        entrepreneurProfile: { select: { verificationStatus: true } },
        consultantProfile: { select: { verificationStatus: true } },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const roleStatus =
      user.role === UserRole.INVESTOR
        ? user.investorProfile?.verificationStatus
        : user.role === UserRole.ENTREPRENEUR
          ? user.entrepreneurProfile?.verificationStatus
          : user.role === UserRole.CONSULTANT
            ? user.consultantProfile?.verificationStatus
            : VerificationStatus.PENDING;

    return {
      verification: verification
        ? {
            id: verification.id,
            nidNumber: verification.nidNumber,
            passportNumber: verification.passportNumber,
            verificationStatus: verification.verificationStatus,
            rejectionReason: verification.rejectionReason,
            reviewedAt: verification.reviewedAt,
            createdAt: verification.createdAt,
            updatedAt: verification.updatedAt,
            frontMediaId: verification.frontMediaId,
            backMediaId: verification.backMediaId,
            selfieMediaId: verification.selfieMediaId,
            hasFront: Boolean(verification.frontMediaId),
            hasBack: Boolean(verification.backMediaId),
            hasSelfie: Boolean(verification.selfieMediaId),
          }
        : null,
      status: verification?.verificationStatus || roleStatus || VerificationStatus.PENDING,
      role: user.role,
      accountStatus: user.accountStatus,
    };
  }

  /**
   * Submit KYC documents for verification (Investors, Entrepreneurs, Consultants)
   */
  async submitKyc(userId: string, dto: SubmitKycDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    // Validate media files belong to KYC category and were uploaded by this user or are pending
    const mediaIds = [dto.frontMediaId, dto.backMediaId, dto.selfieMediaId].filter(
      (id): id is string => Boolean(id),
    );

    const mediaRecords = await this.prisma.mediaFile.findMany({
      where: { id: { in: mediaIds } },
    });

    if (mediaRecords.length < 2) {
      throw new BadRequestException('Required front and selfie verification media files were not found.');
    }

    for (const record of mediaRecords) {
      if (record.category !== MediaCategory.KYC_DOCUMENT) {
        throw new BadRequestException(`Media file ${record.id} is not classified as a KYC document.`);
      }
      if (record.uploadedById && record.uploadedById !== userId) {
        throw new ForbiddenException(`You do not own media file ${record.id}.`);
      }
    }

    // Upsert UserVerification record
    const result = await this.prisma.$transaction(async (tx) => {
      // Mark media as ACTIVE and owned by this user
      await tx.mediaFile.updateMany({
        where: { id: { in: mediaIds } },
        data: {
          uploadedById: userId,
          status: MediaUploadStatus.ACTIVE,
          activatedAt: new Date(),
        },
      });

      const upserted = await tx.userVerification.upsert({
        where: { userId },
        create: {
          userId,
          nidNumber: dto.nidNumber || null,
          passportNumber: dto.passportNumber || null,
          frontMediaId: dto.frontMediaId,
          backMediaId: dto.backMediaId || null,
          selfieMediaId: dto.selfieMediaId,
          verificationStatus: VerificationStatus.PENDING,
          rejectionReason: null,
        },
        update: {
          nidNumber: dto.nidNumber || null,
          passportNumber: dto.passportNumber || null,
          frontMediaId: dto.frontMediaId,
          backMediaId: dto.backMediaId || null,
          selfieMediaId: dto.selfieMediaId,
          verificationStatus: VerificationStatus.PENDING,
          rejectionReason: null,
          reviewedAt: null,
          reviewedBy: null,
        },
      });

      // Synchronize role profile verification status to PENDING
      if (user.role === UserRole.INVESTOR) {
        await tx.investorProfile.updateMany({
          where: { userId },
          data: { verificationStatus: VerificationStatus.PENDING },
        });
      } else if (user.role === UserRole.ENTREPRENEUR) {
        await tx.entrepreneurProfile.updateMany({
          where: { userId },
          data: { verificationStatus: VerificationStatus.PENDING },
        });
      } else if (user.role === UserRole.CONSULTANT) {
        await tx.consultantProfile.updateMany({
          where: { userId },
          data: { verificationStatus: VerificationStatus.PENDING },
        });
      }

      return upserted;
    });

    this.logger.log(`User ${userId} submitted KYC verification files.`);
    return {
      message: 'KYC documents submitted successfully. An administrator will review your application.',
      verification: result,
    };
  }

  /**
   * Admin: List all KYC submissions with filtering and pagination
   */
  async listKycSubmissions(query: KycListQueryDto) {
    const page = Math.max(1, query.page || 1);
    const limit = Math.min(100, Math.max(1, query.limit || 15));
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.status) {
      where.verificationStatus = query.status;
    }

    if (query.role) {
      where.user = { role: query.role };
    }

    if (query.search?.trim()) {
      const term = query.search.trim();
      where.OR = [
        { nidNumber: { contains: term, mode: 'insensitive' } },
        { passportNumber: { contains: term, mode: 'insensitive' } },
        {
          user: {
            OR: [
              { email: { contains: term, mode: 'insensitive' } },
              { firstName: { contains: term, mode: 'insensitive' } },
              { lastName: { contains: term, mode: 'insensitive' } },
            ],
          },
        },
      ];
    }

    const [total, items] = await Promise.all([
      this.prisma.userVerification.count({ where }),
      this.prisma.userVerification.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              image: true,
              role: true,
              accountStatus: true,
              createdAt: true,
            },
          },
          frontMedia: {
            select: { id: true, originalName: true, mimeType: true, sizeBytes: true, key: true },
          },
          backMedia: {
            select: { id: true, originalName: true, mimeType: true, sizeBytes: true, key: true },
          },
          selfieMedia: {
            select: { id: true, originalName: true, mimeType: true, sizeBytes: true, key: true },
          },
        },
      }),
    ]);

    // Format safe response (BigInt serialization safe)
    const formatted = items.map((item) => ({
      ...item,
      frontMedia: item.frontMedia
        ? { ...item.frontMedia, sizeBytes: Number(item.frontMedia.sizeBytes) }
        : null,
      backMedia: item.backMedia
        ? { ...item.backMedia, sizeBytes: Number(item.backMedia.sizeBytes) }
        : null,
      selfieMedia: item.selfieMedia
        ? { ...item.selfieMedia, sizeBytes: Number(item.selfieMedia.sizeBytes) }
        : null,
    }));

    return {
      items: formatted,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Admin: Get single KYC submission with pre-generated secure access URLs
   */
  async getKycSubmissionById(adminId: string, verificationId: string) {
    const item = await this.prisma.userVerification.findUnique({
      where: { id: verificationId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            image: true,
            role: true,
            accountStatus: true,
            createdAt: true,
            entrepreneurProfile: true,
            investorProfile: true,
            consultantProfile: true,
          },
        },
        frontMedia: true,
        backMedia: true,
        selfieMedia: true,
      },
    });

    if (!item) {
      throw new NotFoundException('KYC verification application not found.');
    }

    // Generate secure 15-minute temporary presigned URLs for each document
    let frontAccessUrl: string | null = null;
    let backAccessUrl: string | null = null;
    let selfieAccessUrl: string | null = null;

    if (item.frontMediaId) {
      const res = await this.mediaService.getMediaAccessUrl(adminId, UserRole.ADMIN, item.frontMediaId);
      frontAccessUrl = res.url;
    }
    if (item.backMediaId) {
      const res = await this.mediaService.getMediaAccessUrl(adminId, UserRole.ADMIN, item.backMediaId);
      backAccessUrl = res.url;
    }
    if (item.selfieMediaId) {
      const res = await this.mediaService.getMediaAccessUrl(adminId, UserRole.ADMIN, item.selfieMediaId);
      selfieAccessUrl = res.url;
    }

    return {
      ...item,
      frontMedia: item.frontMedia
        ? {
            ...item.frontMedia,
            sizeBytes: Number(item.frontMedia.sizeBytes),
            accessUrl: frontAccessUrl,
          }
        : null,
      backMedia: item.backMedia
        ? {
            ...item.backMedia,
            sizeBytes: Number(item.backMedia.sizeBytes),
            accessUrl: backAccessUrl,
          }
        : null,
      selfieMedia: item.selfieMedia
        ? {
            ...item.selfieMedia,
            sizeBytes: Number(item.selfieMedia.sizeBytes),
            accessUrl: selfieAccessUrl,
          }
        : null,
    };
  }

  /**
   * Admin: Approve or Reject KYC application
   */
  async reviewKycSubmission(adminId: string, verificationId: string, dto: ReviewKycDto) {
    const verification = await this.prisma.userVerification.findUnique({
      where: { id: verificationId },
      include: { user: true },
    });

    if (!verification) {
      throw new NotFoundException('Verification submission not found.');
    }

    const { status, rejectionReason } = dto;
    const targetUserId = verification.userId;
    const userRole = verification.user.role;

    const updated = await this.prisma.$transaction(async (tx) => {
      const rec = await tx.userVerification.update({
        where: { id: verificationId },
        data: {
          verificationStatus: status,
          rejectionReason: status === VerificationStatus.REJECTED ? rejectionReason : null,
          reviewedBy: adminId,
          reviewedAt: new Date(),
        },
      });

      // Synchronize role profile status
      if (userRole === UserRole.INVESTOR) {
        await tx.investorProfile.updateMany({
          where: { userId: targetUserId },
          data: { verificationStatus: status },
        });
      } else if (userRole === UserRole.ENTREPRENEUR) {
        await tx.entrepreneurProfile.updateMany({
          where: { userId: targetUserId },
          data: { verificationStatus: status },
        });
      } else if (userRole === UserRole.CONSULTANT) {
        await tx.consultantProfile.updateMany({
          where: { userId: targetUserId },
          data: { verificationStatus: status },
        });
      }

      return rec;
    });

    this.logger.log(`Admin ${adminId} reviewed KYC ${verificationId} -> ${status}`);

    return {
      message: `KYC submission successfully updated to ${status}.`,
      verification: updated,
    };
  }
}
