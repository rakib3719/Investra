import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import {
  AccountStatus,
  CampaignStatus,
  Prisma,
  UserRole,
} from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { AdminUsersQueryDto } from "./dto/admin-users-query.dto";
import { UpdateUserStatusDto } from "./dto/update-user-status.dto";

@Injectable()
export class AdminUsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getUsers(query: AdminUsersQueryDto) {
    const page = Math.max(1, query.page || 1);
    const limit = Math.min(100, Math.max(1, query.limit || 20));
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {};

    if (query.role) {
      where.role = query.role;
    }

    if (query.status) {
      where.accountStatus = query.status;
    }

    if (query.search) {
      const term = query.search.trim();
      where.OR = [
        { email: { contains: term, mode: "insensitive" } },
        { firstName: { contains: term, mode: "insensitive" } },
        { lastName: { contains: term, mode: "insensitive" } },
        { username: { contains: term, mode: "insensitive" } },
      ];
    }

    const [total, users] = await Promise.all([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          username: true,
          email: true,
          phone: true,
          image: true,
          role: true,
          accountStatus: true,
          isEmailVerified: true,
          createdAt: true,
          lastLoginAt: true,
          entrepreneurProfile: {
            select: {
              companyName: true,
              headline: true,
              verificationStatus: true,
            },
          },
          investorProfile: {
            select: {
              companyName: true,
              designation: true,
              accreditedInvestor: true,
              verificationStatus: true,
            },
          },
          consultantProfile: {
            select: {
              specialization: true,
              yearsOfExperience: true,
              verificationStatus: true,
            },
          },
          _count: {
            select: {
              businesses: true,
              bookmarks: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return {
      items: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        entrepreneurProfile: true,
        investorProfile: true,
        consultantProfile: true,
        businesses: {
          select: {
            id: true,
            title: true,
            slug: true,
            status: true,
            targetAmount: true,
            raisedAmount: true,
            createdAt: true,
          },
        },
        bookmarks: {
          select: {
            id: true,
            business: {
              select: {
                id: true,
                title: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const { password, ...safeUser } = user;
    return safeUser;
  }

  async updateUserStatus(
    adminUserId: string,
    targetUserId: string,
    dto: UpdateUserStatusDto,
  ) {
    if (adminUserId === targetUserId) {
      throw new BadRequestException(
        "Administrators cannot alter their own account status",
      );
    }

    const user = await this.prisma.user.findUnique({
      where: { id: targetUserId },
      select: { id: true, email: true, role: true, accountStatus: true },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (
      dto.status === AccountStatus.BLOCKED ||
      dto.status === AccountStatus.SUSPENDED
    ) {
      await this.prisma.$transaction([
        this.prisma.user.update({
          where: { id: targetUserId },
          data: { accountStatus: dto.status },
        }),
        this.prisma.refreshSession.deleteMany({
          where: { userId: targetUserId },
        }),
      ]);
    } else {
      await this.prisma.user.update({
        where: { id: targetUserId },
        data: { accountStatus: dto.status },
      });
    }

    return {
      success: true,
      message: `User status updated to ${dto.status}`,
      userId: targetUserId,
      newStatus: dto.status,
    };
  }

  async getOverviewStats() {
    const [
      totalUsers,
      investorCount,
      entrepreneurCount,
      consultantCount,
      adminCount,
      totalCampaigns,
      activeCampaigns,
      underReviewCampaigns,
      capitalAggregate,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { role: UserRole.INVESTOR } }),
      this.prisma.user.count({ where: { role: UserRole.ENTREPRENEUR } }),
      this.prisma.user.count({ where: { role: UserRole.CONSULTANT } }),
      this.prisma.user.count({ where: { role: UserRole.ADMIN } }),
      this.prisma.business.count(),
      this.prisma.business.count({ where: { status: CampaignStatus.ACTIVE } }),
      this.prisma.business.count({
        where: { status: CampaignStatus.UNDER_REVIEW },
      }),
      this.prisma.business.aggregate({
        _sum: {
          targetAmount: true,
          raisedAmount: true,
        },
      }),
    ]);

    return {
      users: {
        total: totalUsers,
        investors: investorCount,
        entrepreneurs: entrepreneurCount,
        consultants: consultantCount,
        admins: adminCount,
      },
      campaigns: {
        total: totalCampaigns,
        active: activeCampaigns,
        underReview: underReviewCampaigns,
        totalTargetCapital: Number(capitalAggregate._sum.targetAmount) || 0,
        totalRaisedCapital: Number(capitalAggregate._sum.raisedAmount) || 0,
      },
    };
  }
}
