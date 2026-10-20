import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { MediaUploadStatus, PortfolioItemType, UserRole } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { MediaService } from '../media/media.service';
import { R2StorageService } from '../media/r2-storage.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { CreatePortfolioItemDto } from './dto/create-portfolio-item.dto';
import { UpdateInvestorPortfolioMetaDto } from './dto/update-investor-portfolio-meta.dto';
import { UpdatePortfolioItemDto } from './dto/update-portfolio-item.dto';
import { CreateIntroRequestDto } from './dto/create-intro-request.dto';
import { UpdateIntroStatusDto } from './dto/update-intro-status.dto';
import { IntroRequestStatus } from '@prisma/client';

@Injectable()
export class PortfolioService {
  private readonly logger = new Logger(PortfolioService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mediaService: MediaService,
    private readonly r2StorageService: R2StorageService,
    private readonly subscriptionsService: SubscriptionsService,
  ) {}

  /**
   * Helper: Find or initialize an InvestorProfile for a user.
   */
  private async getOrCreateInvestorProfile(userId: string) {
    let profile = await this.prisma.investorProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            email: true,
            image: true,
            coverImage: true,
            bio: true,
            country: true,
            city: true,
            role: true,
            website: true,
          },
        },
        videoIntroMedia: true,
      },
    });

    if (!profile) {
      profile = await this.prisma.investorProfile.create({
        data: {
          userId,
          verificationStatus: 'PENDING',
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              username: true,
              email: true,
              image: true,
              coverImage: true,
              bio: true,
              country: true,
              city: true,
              role: true,
              website: true,
            },
          },
          videoIntroMedia: true,
        },
      });
    }

    return profile;
  }

  /**
   * Helper: Resolve presigned GET URL for a private media file if available.
   */
  private async resolveMediaUrl(media: any | null | undefined): Promise<string | null> {
    if (!media) return null;
    if (media.accessType === 'PUBLIC') {
      return this.mediaService.derivePublicUrl(media.key);
    }
    try {
      return await this.r2StorageService.createPresignedGetUrl(
        media.bucket,
        media.key,
        900,
      );
    } catch (err: any) {
      this.logger.warn(`Could not generate presigned GET for media ${media.id}: ${err.message}`);
      return null;
    }
  }

  /**
   * 1. GET MY PORTFOLIO (for authenticated investor)
   */
  async getMyPortfolio(userId: string) {
    const profile = await this.getOrCreateInvestorProfile(userId);

    const items = await this.prisma.investorPortfolioItem.findMany({
      where: { investorProfileId: profile.id },
      include: {
        mediaFile: true,
      },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });

    // Resolve media URLs for items
    const enrichedItems = await Promise.all(
      items.map(async (item) => {
        let mediaUrl = item.logoUrl || item.videoUrl || null;
        let signedDocumentUrl: string | null = null;

        if (item.mediaFile) {
          signedDocumentUrl = await this.resolveMediaUrl(item.mediaFile);
          if (!mediaUrl && (item.type === 'VIDEO_PRESENTATION' || item.type === 'CERTIFICATION')) {
            mediaUrl = signedDocumentUrl;
          }
        }

        return {
          ...item,
          amountInvested: item.amountInvested ? Number(item.amountInvested) : null,
          valuation: item.valuation ? Number(item.valuation) : null,
          signedDocumentUrl,
          resolvedUrl: mediaUrl,
        };
      }),
    );

    // Resolve video intro URL
    let videoIntroUrl = profile.videoIntroUrl;
    if (profile.videoIntroMedia) {
      videoIntroUrl = await this.resolveMediaUrl(profile.videoIntroMedia) || videoIntroUrl;
    }

    // Calculate dynamic stats
    const investments = enrichedItems.filter((i) => i.type === PortfolioItemType.INVESTMENT);
    const sumDeployed = investments.reduce((acc, curr) => acc + (curr.amountInvested || 0), 0);
    const exitsCount = investments.filter((i) => i.status && i.status.toUpperCase().includes('EXIT')).length;

    const stats = {
      totalInvestments: profile.totalInvestmentsCount || investments.length,
      totalCapitalDeployed: profile.totalCapitalDeployed
        ? Number(profile.totalCapitalDeployed)
        : sumDeployed,
      totalExits: profile.totalExitsCount || exitsCount,
      certificationsCount: enrichedItems.filter((i) => i.type === PortfolioItemType.CERTIFICATION).length,
      experienceCount: enrichedItems.filter((i) => i.type === PortfolioItemType.EXPERIENCE).length,
      videosCount: enrichedItems.filter((i) => i.type === PortfolioItemType.VIDEO_PRESENTATION).length,
      caseStudiesCount: enrichedItems.filter((i) => i.type === PortfolioItemType.CASE_STUDY).length,
    };

    return {
      investor: {
        ...profile,
        videoIntroUrl,
        investmentRangeMin: profile.investmentRangeMin ? Number(profile.investmentRangeMin) : null,
        investmentRangeMax: profile.investmentRangeMax ? Number(profile.investmentRangeMax) : null,
        totalCapitalDeployed: profile.totalCapitalDeployed ? Number(profile.totalCapitalDeployed) : sumDeployed,
      },
      portfolioItems: enrichedItems,
      stats,
    };
  }

  /**
   * 2. UPDATE MY PORTFOLIO METADATA
   */
  async updateMyPortfolioMeta(userId: string, dto: UpdateInvestorPortfolioMetaDto) {
    const profile = await this.getOrCreateInvestorProfile(userId);

    // If bio is updated, update user table
    if (dto.bio !== undefined) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { bio: dto.bio },
      });
    }

    // If videoIntroMediaId provided, activate the media
    if (dto.videoIntroMediaId) {
      await this.prisma.mediaFile.updateMany({
        where: {
          id: dto.videoIntroMediaId,
          uploadedById: userId,
        },
        data: {
          status: MediaUploadStatus.ACTIVE,
          activatedAt: new Date(),
        },
      });
    }

    const updated = await this.prisma.investorProfile.update({
      where: { id: profile.id },
      data: {
        headline: dto.headline !== undefined ? dto.headline : profile.headline,
        investmentThesis: dto.investmentThesis !== undefined ? dto.investmentThesis : profile.investmentThesis,
        companyName: dto.companyName !== undefined ? dto.companyName : profile.companyName,
        designation: dto.designation !== undefined ? dto.designation : profile.designation,
        yearsOfExperience: dto.yearsOfExperience !== undefined ? dto.yearsOfExperience : profile.yearsOfExperience,
        investmentRangeMin: dto.investmentRangeMin !== undefined ? dto.investmentRangeMin : profile.investmentRangeMin,
        investmentRangeMax: dto.investmentRangeMax !== undefined ? dto.investmentRangeMax : profile.investmentRangeMax,
        preferredCurrency: dto.preferredCurrency !== undefined ? dto.preferredCurrency : profile.preferredCurrency,
        accreditedInvestor: dto.accreditedInvestor !== undefined ? dto.accreditedInvestor : profile.accreditedInvestor,
        preferredStage: dto.preferredStage !== undefined ? dto.preferredStage : profile.preferredStage,
        linkedinUrl: dto.linkedinUrl !== undefined ? dto.linkedinUrl : profile.linkedinUrl,
        twitterUrl: dto.twitterUrl !== undefined ? dto.twitterUrl : profile.twitterUrl,
        crunchbaseUrl: dto.crunchbaseUrl !== undefined ? dto.crunchbaseUrl : profile.crunchbaseUrl,
        websiteUrl: dto.websiteUrl !== undefined ? dto.websiteUrl : profile.websiteUrl,
        videoIntroUrl: dto.videoIntroUrl !== undefined ? dto.videoIntroUrl : profile.videoIntroUrl,
        videoIntroMediaId: dto.videoIntroMediaId !== undefined ? dto.videoIntroMediaId : profile.videoIntroMediaId,
        sectors: dto.sectors !== undefined ? dto.sectors : profile.sectors,
        totalInvestmentsCount: dto.totalInvestmentsCount !== undefined ? dto.totalInvestmentsCount : profile.totalInvestmentsCount,
        totalExitsCount: dto.totalExitsCount !== undefined ? dto.totalExitsCount : profile.totalExitsCount,
        totalCapitalDeployed: dto.totalCapitalDeployed !== undefined ? dto.totalCapitalDeployed : profile.totalCapitalDeployed,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            email: true,
            image: true,
            coverImage: true,
            bio: true,
          },
        },
        videoIntroMedia: true,
      },
    });

    return {
      message: 'Investor portfolio overview updated successfully',
      investor: updated,
    };
  }

  /**
   * 3. CREATE PORTFOLIO ITEM
   */
  async createPortfolioItem(userId: string, dto: CreatePortfolioItemDto) {
    const profile = await this.getOrCreateInvestorProfile(userId);

    // If mediaFileId is supplied, activate it
    if (dto.mediaFileId) {
      await this.prisma.mediaFile.updateMany({
        where: {
          id: dto.mediaFileId,
          uploadedById: userId,
        },
        data: {
          status: MediaUploadStatus.ACTIVE,
          activatedAt: new Date(),
        },
      });
    }

    const item = await this.prisma.investorPortfolioItem.create({
      data: {
        investorProfileId: profile.id,
        type: dto.type,
        title: dto.title,
        subtitle: dto.subtitle,
        description: dto.description,
        sector: dto.sector,
        stage: dto.stage,
        amountInvested: dto.amountInvested !== undefined ? dto.amountInvested : null,
        valuation: dto.valuation !== undefined ? dto.valuation : null,
        returnMultiple: dto.returnMultiple,
        status: dto.status || 'ACTIVE',
        year: dto.year,
        startDate: dto.startDate ? new Date(dto.startDate) : null,
        endDate: dto.endDate ? new Date(dto.endDate) : null,
        issuer: dto.issuer,
        credentialId: dto.credentialId,
        credentialUrl: dto.credentialUrl,
        videoProvider: dto.videoProvider,
        videoUrl: dto.videoUrl,
        externalUrl: dto.externalUrl,
        logoUrl: dto.logoUrl,
        mediaFileId: dto.mediaFileId,
        isFeatured: dto.isFeatured ?? false,
        isPrivate: dto.isPrivate ?? false,
        sortOrder: dto.sortOrder ?? 0,
      },
      include: {
        mediaFile: true,
      },
    });

    // Automatically keep totalInvestmentsCount up-to-date
    if (dto.type === PortfolioItemType.INVESTMENT) {
      const currentCount = await this.prisma.investorPortfolioItem.count({
        where: { investorProfileId: profile.id, type: PortfolioItemType.INVESTMENT },
      });
      await this.prisma.investorProfile.update({
        where: { id: profile.id },
        data: { totalInvestmentsCount: currentCount },
      });
    }

    let signedDocumentUrl: string | null = null;
    if (item.mediaFile) {
      signedDocumentUrl = await this.resolveMediaUrl(item.mediaFile);
    }

    return {
      message: 'Portfolio item added successfully',
      item: {
        ...item,
        amountInvested: item.amountInvested ? Number(item.amountInvested) : null,
        valuation: item.valuation ? Number(item.valuation) : null,
        signedDocumentUrl,
      },
    };
  }

  /**
   * 4. UPDATE PORTFOLIO ITEM
   */
  async updatePortfolioItem(userId: string, itemId: string, dto: UpdatePortfolioItemDto) {
    const profile = await this.getOrCreateInvestorProfile(userId);

    const existing = await this.prisma.investorPortfolioItem.findFirst({
      where: {
        id: itemId,
        investorProfileId: profile.id,
      },
    });

    if (!existing) {
      throw new NotFoundException('Portfolio item not found or you do not have permission.');
    }

    if (dto.mediaFileId && dto.mediaFileId !== existing.mediaFileId) {
      await this.prisma.mediaFile.updateMany({
        where: {
          id: dto.mediaFileId,
          uploadedById: userId,
        },
        data: {
          status: MediaUploadStatus.ACTIVE,
          activatedAt: new Date(),
        },
      });
    }

    const updated = await this.prisma.investorPortfolioItem.update({
      where: { id: itemId },
      data: {
        type: dto.type ?? existing.type,
        title: dto.title ?? existing.title,
        subtitle: dto.subtitle !== undefined ? dto.subtitle : existing.subtitle,
        description: dto.description !== undefined ? dto.description : existing.description,
        sector: dto.sector !== undefined ? dto.sector : existing.sector,
        stage: dto.stage !== undefined ? dto.stage : existing.stage,
        amountInvested: dto.amountInvested !== undefined ? dto.amountInvested : existing.amountInvested,
        valuation: dto.valuation !== undefined ? dto.valuation : existing.valuation,
        returnMultiple: dto.returnMultiple !== undefined ? dto.returnMultiple : existing.returnMultiple,
        status: dto.status !== undefined ? dto.status : existing.status,
        year: dto.year !== undefined ? dto.year : existing.year,
        startDate: dto.startDate ? new Date(dto.startDate) : existing.startDate,
        endDate: dto.endDate ? new Date(dto.endDate) : existing.endDate,
        issuer: dto.issuer !== undefined ? dto.issuer : existing.issuer,
        credentialId: dto.credentialId !== undefined ? dto.credentialId : existing.credentialId,
        credentialUrl: dto.credentialUrl !== undefined ? dto.credentialUrl : existing.credentialUrl,
        videoProvider: dto.videoProvider !== undefined ? dto.videoProvider : existing.videoProvider,
        videoUrl: dto.videoUrl !== undefined ? dto.videoUrl : existing.videoUrl,
        externalUrl: dto.externalUrl !== undefined ? dto.externalUrl : existing.externalUrl,
        logoUrl: dto.logoUrl !== undefined ? dto.logoUrl : existing.logoUrl,
        mediaFileId: dto.mediaFileId !== undefined ? dto.mediaFileId : existing.mediaFileId,
        isFeatured: dto.isFeatured !== undefined ? dto.isFeatured : existing.isFeatured,
        isPrivate: dto.isPrivate !== undefined ? dto.isPrivate : existing.isPrivate,
        sortOrder: dto.sortOrder !== undefined ? dto.sortOrder : existing.sortOrder,
      },
      include: {
        mediaFile: true,
      },
    });

    let signedDocumentUrl: string | null = null;
    if (updated.mediaFile) {
      signedDocumentUrl = await this.resolveMediaUrl(updated.mediaFile);
    }

    return {
      message: 'Portfolio item updated successfully',
      item: {
        ...updated,
        amountInvested: updated.amountInvested ? Number(updated.amountInvested) : null,
        valuation: updated.valuation ? Number(updated.valuation) : null,
        signedDocumentUrl,
      },
    };
  }

  /**
   * 5. DELETE PORTFOLIO ITEM
   */
  async deletePortfolioItem(userId: string, itemId: string) {
    const profile = await this.getOrCreateInvestorProfile(userId);

    const existing = await this.prisma.investorPortfolioItem.findFirst({
      where: {
        id: itemId,
        investorProfileId: profile.id,
      },
    });

    if (!existing) {
      throw new NotFoundException('Portfolio item not found.');
    }

    await this.prisma.investorPortfolioItem.delete({
      where: { id: itemId },
    });

    if (existing.type === PortfolioItemType.INVESTMENT) {
      const currentCount = await this.prisma.investorPortfolioItem.count({
        where: { investorProfileId: profile.id, type: PortfolioItemType.INVESTMENT },
      });
      await this.prisma.investorProfile.update({
        where: { id: profile.id },
        data: { totalInvestmentsCount: currentCount },
      });
    }

    return {
      success: true,
      message: 'Portfolio item deleted successfully',
    };
  }

  /**
   * 6. GET PUBLIC / ENTREPRENEUR-FACING INVESTOR PROFILE & PORTFOLIO (PREMIUM GATED)
   * If viewer is subscribed entrepreneur / admin / owner -> full portfolio unlocked with signed URLs.
   * If viewer is unsubscribed / free -> high-level teaser with locked items and upgrade CTA.
   */
  async getPublicInvestorPortfolio(
    viewerUserId: string | null,
    viewerRole: UserRole | null,
    identifier: string,
  ) {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(identifier);

    // Lookup by user ID, investorProfile ID, or username
    const investor = await this.prisma.investorProfile.findFirst({
      where: isUuid
        ? {
            OR: [
              { id: identifier },
              { userId: identifier },
              { user: { username: identifier } },
            ],
          }
        : {
            user: { username: identifier },
          },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            email: true,
            image: true,
            coverImage: true,
            bio: true,
            country: true,
            city: true,
            role: true,
            website: true,
            createdAt: true,
          },
        },
        videoIntroMedia: true,
      },
    });

    if (!investor) {
      throw new NotFoundException(`Investor profile "${identifier}" not found.`);
    }

    // Check if viewer has premium access
    let isPremiumUnlocked = false;

    if (viewerUserId) {
      const isOwner = viewerUserId === investor.userId;
      const isAdmin = viewerRole === UserRole.ADMIN || (viewerRole as string) === 'SUB_ADMIN';

      if (isOwner || isAdmin) {
        isPremiumUnlocked = true;
      } else {
        // Check if entrepreneur has active paid subscription
        const activeSub = await this.prisma.userSubscription.findFirst({
          where: {
            userId: viewerUserId,
            status: 'ACTIVE',
            currentPeriodEnd: { gte: new Date() },
          },
          include: { plan: true },
        });

        if (activeSub && activeSub.plan && Number(activeSub.plan.priceMonthly) > 0) {
          isPremiumUnlocked = true;
        } else if (activeSub && activeSub.featureSnapshot) {
          const snapshot = activeSub.featureSnapshot as Record<string, any>;
          if (snapshot.investor_analytics?.isEnabled || snapshot.view_investor_portfolio?.isEnabled) {
            isPremiumUnlocked = true;
          }
        }
      }
    }

    // Fetch portfolio items
    const rawItems = await this.prisma.investorPortfolioItem.findMany({
      where: { investorProfileId: investor.id },
      include: {
        mediaFile: true,
      },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });

    // Map items depending on premium unlock status
    const mappedItems = await Promise.all(
      rawItems.map(async (item) => {
        if (isPremiumUnlocked) {
          let signedDocumentUrl: string | null = null;
          if (item.mediaFile) {
            signedDocumentUrl = await this.resolveMediaUrl(item.mediaFile);
          }
          return {
            id: item.id,
            type: item.type,
            title: item.title,
            subtitle: item.subtitle,
            description: item.description,
            sector: item.sector,
            stage: item.stage,
            amountInvested: item.amountInvested ? Number(item.amountInvested) : null,
            valuation: item.valuation ? Number(item.valuation) : null,
            returnMultiple: item.returnMultiple,
            status: item.status,
            year: item.year,
            issuer: item.issuer,
            credentialId: item.credentialId,
            credentialUrl: item.credentialUrl,
            videoProvider: item.videoProvider,
            videoUrl: item.videoUrl,
            externalUrl: item.externalUrl,
            logoUrl: item.logoUrl,
            isFeatured: item.isFeatured,
            signedDocumentUrl,
            isLocked: false,
          };
        } else {
          // Locked / Teaser format
          const isInvestment = item.type === PortfolioItemType.INVESTMENT;
          const isCertification = item.type === PortfolioItemType.CERTIFICATION;
          const isVideo = item.type === PortfolioItemType.VIDEO_PRESENTATION;

          return {
            id: item.id,
            type: item.type,
            title: item.title,
            subtitle: item.subtitle,
            description: item.description ? `${item.description.slice(0, 100)}...` : null,
            sector: item.sector,
            stage: item.stage,
            year: item.year,
            issuer: item.issuer,
            // Masked financial & private data
            amountInvested: null,
            valuation: null,
            returnMultiple: isInvestment ? '🔒 Premium Subscribers' : null,
            status: item.status,
            credentialId: isCertification ? 'VERIFIED_ON_FILE' : null,
            credentialUrl: null,
            videoProvider: isVideo ? item.videoProvider : null,
            videoUrl: null,
            externalUrl: null,
            logoUrl: item.logoUrl,
            isFeatured: item.isFeatured,
            signedDocumentUrl: null,
            isLocked: true,
          };
        }
      }),
    );

    // Resolve video intro URL
    let videoIntroUrl: string | null = null;
    if (isPremiumUnlocked) {
      if (investor.videoIntroMedia) {
        videoIntroUrl = await this.resolveMediaUrl(investor.videoIntroMedia);
      } else {
        videoIntroUrl = investor.videoIntroUrl;
      }
    }

    const investments = rawItems.filter((i) => i.type === PortfolioItemType.INVESTMENT);
    const sumDeployed = investments.reduce((acc, curr) => acc + (curr.amountInvested ? Number(curr.amountInvested) : 0), 0);

    return {
      isPremiumUnlocked,
      premiumGate: {
        isLocked: !isPremiumUnlocked,
        title: 'Investor Portfolio & Due Diligence Dossier',
        message: 'Full track record, audited certificate verification files, ROI return multiples, and private video presentations are exclusively available to Premium Subscribers.',
        upgradeUrl: '/subscription?role=entrepreneur',
      },
      investor: {
        id: investor.id,
        userId: investor.userId,
        name: `${investor.user?.firstName || ''} ${investor.user?.lastName || ''}`.trim() || investor.user?.username || 'Verified Investor',
        username: investor.user?.username,
        image: investor.user?.image,
        coverImage: investor.user?.coverImage,
        headline: investor.headline,
        companyName: investor.companyName,
        designation: investor.designation,
        yearsOfExperience: investor.yearsOfExperience,
        investmentRangeMin: isPremiumUnlocked ? (investor.investmentRangeMin ? Number(investor.investmentRangeMin) : null) : null,
        investmentRangeMax: isPremiumUnlocked ? (investor.investmentRangeMax ? Number(investor.investmentRangeMax) : null) : null,
        preferredCurrency: investor.preferredCurrency || 'USD',
        accreditedInvestor: investor.accreditedInvestor,
        verificationStatus: investor.verificationStatus,
        preferredStage: investor.preferredStage,
        investmentThesis: isPremiumUnlocked ? investor.investmentThesis : (investor.investmentThesis ? `${investor.investmentThesis.slice(0, 160)}...` : null),
        bio: investor.user?.bio,
        country: investor.user?.country,
        city: investor.user?.city,
        linkedinUrl: isPremiumUnlocked ? investor.linkedinUrl : null,
        twitterUrl: isPremiumUnlocked ? investor.twitterUrl : null,
        crunchbaseUrl: isPremiumUnlocked ? investor.crunchbaseUrl : null,
        websiteUrl: isPremiumUnlocked ? investor.websiteUrl : null,
        videoIntroUrl,
        sectors: investor.sectors || [],
        memberSince: investor.user?.createdAt,
      },
      stats: {
        totalInvestmentsCount: investor.totalInvestmentsCount || investments.length,
        totalExitsCount: investor.totalExitsCount,
        totalCapitalDeployed: isPremiumUnlocked ? (investor.totalCapitalDeployed ? Number(investor.totalCapitalDeployed) : sumDeployed) : null,
        certificationsCount: rawItems.filter((i) => i.type === PortfolioItemType.CERTIFICATION).length,
        experienceCount: rawItems.filter((i) => i.type === PortfolioItemType.EXPERIENCE).length,
      },
      portfolioItems: mappedItems,
    };
  }

  /**
   * 7. LIST VERIFIED INVESTORS DIRECTORY
   */
  async listVerifiedInvestors(page = 1, limit = 20, sector?: string, query?: string) {
    const skip = (page - 1) * limit;

    const where: any = {
      user: {
        accountStatus: 'ACTIVE',
      },
    };

    if (sector) {
      where.sectors = { has: sector };
    }

    if (query) {
      where.OR = [
        { headline: { contains: query, mode: 'insensitive' } },
        { companyName: { contains: query, mode: 'insensitive' } },
        { designation: { contains: query, mode: 'insensitive' } },
        { user: { firstName: { contains: query, mode: 'insensitive' } } },
        { user: { lastName: { contains: query, mode: 'insensitive' } } },
      ];
    }

    const [total, profiles] = await Promise.all([
      this.prisma.investorProfile.count({ where }),
      this.prisma.investorProfile.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              username: true,
              image: true,
              coverImage: true,
              country: true,
              city: true,
            },
          },
          _count: {
            select: {
              portfolioItems: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data: profiles.map((p) => ({
        id: p.id,
        userId: p.userId,
        name: `${p.user?.firstName || ''} ${p.user?.lastName || ''}`.trim() || p.user?.username || 'Verified Investor',
        username: p.user?.username,
        image: p.user?.image,
        coverImage: p.user?.coverImage,
        headline: p.headline,
        companyName: p.companyName,
        designation: p.designation,
        sectors: p.sectors,
        preferredStage: p.preferredStage,
        verificationStatus: p.verificationStatus,
        portfolioCount: p._count.portfolioItems,
        totalInvestmentsCount: p.totalInvestmentsCount,
        location: [p.user?.city, p.user?.country].filter(Boolean).join(', '),
      })),
    };
  }

  /**
   * 8. CREATE INTRO REQUEST (Entrepreneur -> Investor, requires active subscription)
   */
  async createIntroRequest(entrepreneurId: string, dto: CreateIntroRequestDto) {
    // A. Check entrepreneur subscription requirement
    const activeSub = await this.prisma.userSubscription.findFirst({
      where: {
        userId: entrepreneurId,
        status: 'ACTIVE',
      },
    });

    if (!activeSub) {
      throw new ForbiddenException(
        'Pro Subscription Required. Only active Entrepreneur Pro subscribers can submit direct deal introductions to verified accredited investors.',
      );
    }

    // B. Resolve target investor
    let targetInvestorUserId: string | null = null;
    let targetInvestorProfileId: string | null = null;

    // Check if dto.investorId is a User with INVESTOR role
    const investorUser = await this.prisma.user.findFirst({
      where: { id: dto.investorId, role: UserRole.INVESTOR },
      include: { investorProfile: true },
    });

    if (investorUser) {
      targetInvestorUserId = investorUser.id;
      targetInvestorProfileId = investorUser.investorProfile?.id || null;
    } else {
      // Check if dto.investorId is an InvestorProfile id
      const investorProfile = await this.prisma.investorProfile.findUnique({
        where: { id: dto.investorId },
      });
      if (investorProfile) {
        targetInvestorProfileId = investorProfile.id;
        targetInvestorUserId = investorProfile.userId;
      }
    }

    if (!targetInvestorUserId) {
      throw new NotFoundException('Target investor not found.');
    }

    if (targetInvestorUserId === entrepreneurId) {
      throw new BadRequestException('You cannot send an introduction request to yourself.');
    }

    const intro = await this.prisma.investorIntroRequest.create({
      data: {
        entrepreneurId,
        investorId: targetInvestorUserId,
        investorProfileId: targetInvestorProfileId,
        startupName: dto.startupName,
        pitchMessage: dto.pitchMessage,
        businessOverview: dto.businessOverview,
        targetSector: dto.targetSector,
        roundStage: dto.roundStage,
        raisingAmount: dto.raisingAmount,
        deckUrl: dto.deckUrl,
        websiteUrl: dto.websiteUrl,
        contactEmail: dto.contactEmail,
        contactPhone: dto.contactPhone,
        status: IntroRequestStatus.PENDING,
      },
      include: {
        investor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            email: true,
            image: true,
          },
        },
        investorProfile: {
          select: {
            id: true,
            companyName: true,
            designation: true,
            headline: true,
          },
        },
      },
    });

    return {
      message: 'Introduction request submitted successfully to investor!',
      data: intro,
    };
  }

  /**
   * 9. GET SENT INTRO REQUESTS (Entrepreneur view)
   */
  async getEntrepreneurSentIntros(entrepreneurId: string) {
    const intros = await this.prisma.investorIntroRequest.findMany({
      where: { entrepreneurId },
      include: {
        investor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            email: true,
            image: true,
          },
        },
        investorProfile: {
          select: {
            id: true,
            companyName: true,
            designation: true,
            headline: true,
            sectors: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      total: intros.length,
      data: intros,
    };
  }

  /**
   * 10. GET INCOMING INTRO REQUESTS (Investor view)
   */
  async getInvestorIncomingIntros(investorUserId: string) {
    const intros = await this.prisma.investorIntroRequest.findMany({
      where: { investorId: investorUserId },
      include: {
        entrepreneur: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            email: true,
            image: true,
            country: true,
            city: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      total: intros.length,
      data: intros,
    };
  }

  /**
   * 11. UPDATE INTRO STATUS (Investor accepts/declines/reviews)
   */
  async updateIntroStatus(investorUserId: string, introId: string, dto: UpdateIntroStatusDto) {
    const existing = await this.prisma.investorIntroRequest.findFirst({
      where: { id: introId, investorId: investorUserId },
    });

    if (!existing) {
      throw new NotFoundException('Introduction request not found or unauthorized.');
    }

    const updated = await this.prisma.investorIntroRequest.update({
      where: { id: introId },
      data: {
        status: dto.status,
        investorFeedback: dto.investorFeedback !== undefined ? dto.investorFeedback : existing.investorFeedback,
        reviewedAt: new Date(),
      },
      include: {
        entrepreneur: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    // When an intro is accepted, automatically initiate a Deal Room Conversation
    let conversationId: string | null = null;
    if (dto.status === 'ACCEPTED') {
      try {
        let conv = await this.prisma.conversation.findFirst({
          where: {
            OR: [
              { participant1Id: investorUserId, participant2Id: existing.entrepreneurId },
              { participant1Id: existing.entrepreneurId, participant2Id: investorUserId },
            ],
            introRequestId: introId,
          },
        });

        if (!conv) {
          const introNote = dto.investorFeedback?.trim()
            ? `Pitch accepted. Note from investor: "${dto.investorFeedback.trim()}"`
            : `Pitch accepted for ${existing.startupName}. Diligence deal room is open.`;

          conv = await this.prisma.conversation.create({
            data: {
              participant1Id: investorUserId,
              participant2Id: existing.entrepreneurId,
              introRequestId: introId,
              subject: `Deal Room: ${existing.startupName}`,
              lastMessageText: introNote,
              unreadCountUser1: 0,
              unreadCountUser2: 1,
            },
          });

          await this.prisma.directMessage.create({
            data: {
              conversationId: conv.id,
              senderId: investorUserId,
              content: introNote,
            },
          });
        }
        conversationId = conv.id;
      } catch (err) {
        console.error('Failed to auto-create conversation on intro acceptance', err);
      }
    }

    return {
      message: `Introduction request marked as ${dto.status}`,
      data: {
        ...updated,
        conversationId,
      },
    };
  }
}

