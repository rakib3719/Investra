import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BookmarksService {
  constructor(private readonly prisma: PrismaService) {}

  async addBookmark(userId: string, businessId: string) {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
      select: { id: true, title: true },
    });

    if (!business) {
      throw new NotFoundException('Business campaign not found');
    }

    const bookmark = await this.prisma.bookmark.upsert({
      where: {
        userId_businessId: {
          userId,
          businessId,
        },
      },
      create: {
        userId,
        businessId,
      },
      update: {},
      include: {
        business: {
          include: {
            category: true,
            milestones: {
              orderBy: { sortOrder: 'asc' },
            },
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
            _count: {
              select: { bookmarks: true },
            },
          },
        },
      },
    });

    return {
      success: true,
      message: 'Campaign bookmarked successfully',
      bookmark,
    };
  }

  async removeBookmark(userId: string, businessId: string) {
    const existing = await this.prisma.bookmark.findUnique({
      where: {
        userId_businessId: {
          userId,
          businessId,
        },
      },
    });

    if (existing) {
      await this.prisma.bookmark.delete({
        where: {
          id: existing.id,
        },
      });
    }

    return {
      success: true,
      message: 'Campaign removed from bookmarks',
    };
  }

  async getBookmarks(userId: string) {
    return this.prisma.bookmark.findMany({
      where: { userId },
      include: {
        business: {
          include: {
            category: true,
            milestones: {
              orderBy: { sortOrder: 'asc' },
            },
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
            _count: {
              select: { bookmarks: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getBookmarkIds(userId: string): Promise<string[]> {
    const bookmarks = await this.prisma.bookmark.findMany({
      where: { userId },
      select: { businessId: true },
      orderBy: { createdAt: 'desc' },
    });

    return bookmarks.map((b) => b.businessId);
  }
}
