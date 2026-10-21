import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CampaignStatus, Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateCampaignDto } from "./dto/create-campaign.dto";
import { UpdateCampaignDto } from "./dto/update-campaign.dto";
import { CreateMilestoneDto } from "./dto/create-milestone.dto";
import { UpdateCampaignStatusDto } from "./dto/update-campaign-status.dto";
import { CampaignQueryDto } from "./dto/campaign-query.dto";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

@Injectable()
export class CampaignsService {
  constructor(private readonly prisma: PrismaService) {}

  private async generateUniqueSlug(title: string): Promise<string> {
    const baseSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    let slug = baseSlug || "campaign";
    let count = 0;

    while (true) {
      const existing = await this.prisma.business.findUnique({
        where: { slug },
      });
      if (!existing) return slug;
      count++;
      slug = `${baseSlug}-${count}`;
    }
  }

  async getCategories() {
    return this.prisma.category.findMany({
      where: { status: "ACTIVE" },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
  }

  async createCampaign(entrepreneurId: string, dto: CreateCampaignDto) {
    // 1. Check user role and active subscription / free plan campaign limit
    const user = this.prisma.user
      ? await this.prisma.user.findUnique({
          where: { id: entrepreneurId },
          select: { role: true },
        })
      : null;

    if (user && user.role === 'ENTREPRENEUR' && this.prisma.business && this.prisma.userSubscription) {
      const activeCampaignsCount = await this.prisma.business.count({
        where: {
          entrepreneurId,
          status: { in: [CampaignStatus.ACTIVE, CampaignStatus.UNDER_REVIEW, CampaignStatus.DRAFT] },
          deletedAt: null,
        },
      });

      // Check user subscription snapshot
      const sub = await this.prisma.userSubscription.findFirst({
        where: {
          userId: entrepreneurId,
          status: 'ACTIVE',
          currentPeriodEnd: { gte: new Date() },
        },
        include: { plan: true },
      });

      let allowedLimit = 1; // Default Free Tier limit
      let planName = 'Free Tier';

      if (sub && sub.featureSnapshot) {
        const snapshot = sub.featureSnapshot as Record<string, any>;
        const feat = snapshot['campaign_post_limit'];
        if (feat && feat.limitValue !== undefined && feat.limitValue !== null) {
          allowedLimit = feat.limitValue;
          planName = sub.plan.name;
        }
      } else {
        // Fallback to default starter plan from DB
        const starterPlan = await this.prisma.planTier.findFirst({
          where: { targetRole: 'ENTREPRENEUR', priceMonthly: 0, isActive: true },
          include: {
            features: {
              where: { feature: { code: 'campaign_post_limit' } },
            },
          },
        });
        if (starterPlan && starterPlan.features.length > 0) {
          allowedLimit = starterPlan.features[0].limitValue ?? 1;
          planName = starterPlan.name;
        }
      }

      if (allowedLimit !== -1 && activeCampaignsCount >= allowedLimit) {
        throw new ForbiddenException(
          `Your current subscription (${planName}) allows up to ${allowedLimit} active campaign(s). You currently have ${activeCampaignsCount}. Please upgrade your subscription plan to publish more campaigns.`
        );
      }
    }

    const slug = await this.generateUniqueSlug(dto.title);

    return this.prisma.business.create({
      data: {
        entrepreneurId,
        title: dto.title,
        slug,
        tagline: dto.tagline,
        pitchText: dto.pitchText,
        categoryId: dto.categoryId,
        stage: dto.stage,
        targetAmount: dto.targetAmount,
        minInvestment: dto.minInvestment,
        projectedIrr: dto.projectedIrr,
        valuation: dto.valuation,
        riskLevel: dto.riskLevel,
        esgRating: dto.esgRating,
        impactMetric: dto.impactMetric,
        bannerImage: dto.bannerImage,
        coverMediaId: dto.coverMediaId || undefined,
        gallery: dto.gallery || [],
        status: CampaignStatus.DRAFT,
        ...(dto.pitchDeckUrl
          ? {
              pitchDecks: {
                create: {
                  title: dto.pitchDeckTitle || `${dto.title} Pitch Deck`,
                  fileUrl: dto.pitchDeckUrl,
                  mediaFileId: dto.pitchDeckMediaId || undefined,
                  isConfidential: dto.isPitchDeckConfidential ?? false,
                },
              },
            }
          : {}),
      },
      include: {
        category: true,
        coverMedia: true,
        milestones: true,
        pitchDecks: true,
      },
    });
  }

  async updateCampaign(
    userId: string,
    campaignId: string,
    dto: UpdateCampaignDto,
    isAdmin = false,
  ) {
    const campaign = await this.prisma.business.findUnique({
      where: { id: campaignId },
    });

    if (!campaign) {
      throw new NotFoundException("Campaign not found");
    }

    if (!isAdmin && campaign.entrepreneurId !== userId) {
      throw new ForbiddenException("You do not own this campaign");
    }

    if (
      !isAdmin &&
      campaign.status !== CampaignStatus.DRAFT &&
      campaign.status !== CampaignStatus.REJECTED
    ) {
      throw new BadRequestException(
        "Only draft or rejected campaigns can be modified",
      );
    }

    const {
      pitchDeckUrl,
      pitchDeckTitle,
      pitchDeckMediaId,
      isPitchDeckConfidential,
      ...businessData
    } = dto;

    const updated = await this.prisma.business.update({
      where: { id: campaignId },
      data: {
        ...businessData,
      },
      include: {
        category: true,
        coverMedia: true,
        milestones: true,
        pitchDecks: true,
      },
    });

    if (pitchDeckUrl && this.prisma.pitchDeck) {
      await this.prisma.pitchDeck.create({
        data: {
          businessId: campaignId,
          title: pitchDeckTitle || `${campaign.title} Pitch Deck`,
          fileUrl: pitchDeckUrl,
          mediaFileId: pitchDeckMediaId || undefined,
          isConfidential: isPitchDeckConfidential ?? false,
        },
      });
      return this.prisma.business.findUnique({
        where: { id: campaignId },
        include: {
          category: true,
          coverMedia: true,
          milestones: true,
          pitchDecks: true,
        },
      });
    }

    return updated;
  }

  async submitForReview(userId: string, campaignId: string) {
    const campaign = await this.prisma.business.findUnique({
      where: { id: campaignId },
      include: { milestones: true },
    });

    if (!campaign) {
      throw new NotFoundException("Campaign not found");
    }

    if (campaign.entrepreneurId !== userId) {
      throw new ForbiddenException("You do not own this campaign");
    }

    if (
      campaign.status !== CampaignStatus.DRAFT &&
      campaign.status !== CampaignStatus.REJECTED
    ) {
      throw new BadRequestException(
        "Campaign cannot be submitted from current status",
      );
    }

    return this.prisma.business.update({
      where: { id: campaignId },
      data: {
        status: CampaignStatus.UNDER_REVIEW,
        rejectionReason: null,
      },
    });
  }

  async updateCampaignStatus(
    campaignId: string,
    dto: UpdateCampaignStatusDto,
  ) {
    const campaign = await this.prisma.business.findUnique({
      where: { id: campaignId },
    });

    if (!campaign) {
      throw new NotFoundException("Campaign not found");
    }

    return this.prisma.business.update({
      where: { id: campaignId },
      data: {
        status: dto.status,
        rejectionReason: dto.rejectionReason || null,
      },
    });
  }

  async getAdminCampaigns(status?: CampaignStatus, page = 1, limit = 20) {
    const take = Math.min(50, Math.max(1, limit));
    const skip = (Math.max(1, page) - 1) * take;

    const where: Prisma.BusinessWhereInput = {};
    if (status) {
      where.status = status;
    }

    const [total, items] = await Promise.all([
      this.prisma.business.count({ where }),
      this.prisma.business.findMany({
        where,
        skip,
        take,
        include: {
          category: true,
          entrepreneur: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              image: true,
              entrepreneurProfile: true,
            },
          },
          milestones: true,
          _count: {
            select: { bookmarks: true },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return {
      items,
      meta: {
        total,
        page,
        limit: take,
        totalPages: Math.ceil(total / take),
      },
    };
  }

  async getMyCampaigns(userId: string) {
    return this.prisma.business.findMany({
      where: { entrepreneurId: userId },
      include: {
        category: true,
        coverMedia: true,
        pitchDecks: {
          include: { mediaFile: true },
        },
        milestones: {
          orderBy: { sortOrder: "asc" },
        },
        _count: {
          select: { bookmarks: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getPublicCampaigns(query: CampaignQueryDto) {
    const page = Math.max(1, query.page || 1);
    const limit = Math.min(50, Math.max(1, query.limit || 10));
    const skip = (page - 1) * limit;

    const where: Prisma.BusinessWhereInput = {
      status: CampaignStatus.ACTIVE,
    };

    if (query.category) {
      if (UUID_REGEX.test(query.category)) {
        where.categoryId = query.category;
      } else {
        where.category = {
          OR: [
            { slug: query.category.toLowerCase() },
            { name: { contains: query.category, mode: "insensitive" } },
          ],
        };
      }
    }

    if (query.stage) {
      where.stage = query.stage;
    }

    if (query.riskLevel) {
      where.riskLevel = query.riskLevel;
    }

    if (query.minIrr !== undefined) {
      where.projectedIrr = {
        gte: query.minIrr,
      };
    }

    if (query.maxTarget !== undefined) {
      where.targetAmount = {
        lte: query.maxTarget,
      };
    }

    if (query.search) {
      const searchTerm = query.search.trim();
      where.AND = [
        {
          OR: [
            { title: { contains: searchTerm, mode: "insensitive" } },
            { tagline: { contains: searchTerm, mode: "insensitive" } },
            { pitchText: { contains: searchTerm, mode: "insensitive" } },
          ],
        },
      ];
    }

    const [total, items] = await Promise.all([
      this.prisma.business.count({ where }),
      this.prisma.business.findMany({
        where,
        skip,
        take: limit,
        include: {
          category: true,
          entrepreneur: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              image: true,
              entrepreneurProfile: {
                select: {
                  companyName: true,
                  headline: true,
                },
              },
            },
          },
          milestones: {
            orderBy: { sortOrder: "asc" },
          },
          _count: {
            select: { bookmarks: true },
          },
        },
        orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      }),
    ]);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getCampaignBySlug(slug: string, userId?: string, userRole?: string) {
    const isUuid = UUID_REGEX.test(slug);
    const campaign = await this.prisma.business.findFirst({
      where: isUuid ? { OR: [{ id: slug }, { slug }] } : { slug },
      include: {
        category: true,
        coverMedia: true,
        entrepreneur: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            image: true,
            entrepreneurProfile: true,
          },
        },
        milestones: {
          orderBy: { sortOrder: "asc" },
        },
        pitchDecks: {
          include: {
            mediaFile: true,
          },
        },
        _count: {
          select: { bookmarks: true },
        },
      },
    });

    if (!campaign) {
      throw new NotFoundException("Campaign not found");
    }

    if (
      campaign.status !== CampaignStatus.ACTIVE &&
      campaign.entrepreneurId !== userId &&
      userRole !== "ADMIN" &&
      userRole !== "SUB_ADMIN"
    ) {
      throw new NotFoundException("Campaign not found");
    }

    let viewerHasSubscription = false;
    if (userId) {
      if (
        userRole === "ADMIN" ||
        userRole === "SUB_ADMIN" ||
        campaign.entrepreneurId === userId
      ) {
        viewerHasSubscription = true;
      } else {
        const activeSub = await this.prisma.userSubscription.findFirst({
          where: {
            userId,
            status: "ACTIVE",
            currentPeriodEnd: { gte: new Date() },
          },
        });
        if (activeSub) {
          viewerHasSubscription = true;
        }
      }
    }

    const pitchDecksSanitized = (campaign.pitchDecks || []).map((deck) => {
      const isLocked = Boolean(deck.isConfidential && !viewerHasSubscription);
      return {
        id: deck.id,
        businessId: deck.businessId,
        title: deck.title,
        fileUrl: isLocked ? null : deck.fileUrl,
        fileSize: deck.fileSize,
        version: deck.version,
        isConfidential: deck.isConfidential,
        isLocked,
        createdAt: deck.createdAt,
        updatedAt: deck.updatedAt,
      };
    });

    return {
      ...campaign,
      pitchDecks: pitchDecksSanitized,
      viewerHasSubscription,
    };
  }

  async addMilestone(
    userId: string,
    campaignId: string,
    dto: CreateMilestoneDto,
  ) {
    const campaign = await this.prisma.business.findUnique({
      where: { id: campaignId },
    });

    if (!campaign) {
      throw new NotFoundException("Campaign not found");
    }

    if (campaign.entrepreneurId !== userId) {
      throw new ForbiddenException("You do not own this campaign");
    }

    return this.prisma.campaignMilestone.create({
      data: {
        businessId: campaignId,
        title: dto.title,
        description: dto.description,
        targetDate: dto.targetDate ? new Date(dto.targetDate) : undefined,
        fundingNeeded: dto.fundingNeeded,
        isCompleted: dto.isCompleted || false,
        completionProof: dto.completionProof,
        sortOrder: dto.sortOrder || 0,
      },
    });
  }

  async updateMilestone(
    userId: string,
    milestoneId: string,
    dto: Partial<CreateMilestoneDto>,
  ) {
    const milestone = await this.prisma.campaignMilestone.findUnique({
      where: { id: milestoneId },
      include: { business: true },
    });

    if (!milestone) {
      throw new NotFoundException("Milestone not found");
    }

    if (milestone.business.entrepreneurId !== userId) {
      throw new ForbiddenException("You do not own this campaign milestone");
    }

    return this.prisma.campaignMilestone.update({
      where: { id: milestoneId },
      data: {
        title: dto.title,
        description: dto.description,
        targetDate: dto.targetDate ? new Date(dto.targetDate) : undefined,
        fundingNeeded: dto.fundingNeeded,
        isCompleted: dto.isCompleted,
        completionProof: dto.completionProof,
        sortOrder: dto.sortOrder,
      },
    });
  }
}
