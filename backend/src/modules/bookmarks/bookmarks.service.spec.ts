import { Test, type TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('BookmarksService', () => {
  let service: BookmarksService;

  const mockPrismaService = {
    business: {
      findUnique: jest.fn(),
    },
    bookmark: {
      upsert: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookmarksService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<BookmarksService>(BookmarksService);
  });

  describe('addBookmark', () => {
    it('should throw NotFoundException if business campaign does not exist', async () => {
      mockPrismaService.business.findUnique.mockResolvedValue(null);

      await expect(
        service.addBookmark('user-1', 'invalid-biz'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should upsert bookmark and return success payload', async () => {
      mockPrismaService.business.findUnique.mockResolvedValue({ id: 'b1', title: 'SolarGrid' });
      const mockResult = {
        id: 'bm-1',
        userId: 'user-1',
        businessId: 'b1',
        business: { id: 'b1', title: 'SolarGrid' },
      };
      mockPrismaService.bookmark.upsert.mockResolvedValue(mockResult);

      const res = await service.addBookmark('user-1', 'b1');
      expect(res.success).toBe(true);
      expect(res.bookmark).toEqual(mockResult);
      expect(mockPrismaService.bookmark.upsert).toHaveBeenCalled();
    });
  });

  describe('removeBookmark', () => {
    it('should delete bookmark if found', async () => {
      mockPrismaService.bookmark.findUnique.mockResolvedValue({ id: 'bm-1' });
      mockPrismaService.bookmark.delete.mockResolvedValue({ id: 'bm-1' });

      const res = await service.removeBookmark('user-1', 'b1');
      expect(res.success).toBe(true);
      expect(mockPrismaService.bookmark.delete).toHaveBeenCalledWith({
        where: { id: 'bm-1' },
      });
    });

    it('should succeed gracefully if bookmark already does not exist', async () => {
      mockPrismaService.bookmark.findUnique.mockResolvedValue(null);

      const res = await service.removeBookmark('user-1', 'b1');
      expect(res.success).toBe(true);
      expect(mockPrismaService.bookmark.delete).not.toHaveBeenCalled();
    });
  });

  describe('getBookmarks', () => {
    it('should return list of user bookmarks', async () => {
      const mockList = [{ id: 'bm-1', businessId: 'b1' }];
      mockPrismaService.bookmark.findMany.mockResolvedValue(mockList);

      const res = await service.getBookmarks('user-1');
      expect(res).toEqual(mockList);
      expect(mockPrismaService.bookmark.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: 'user-1' },
        }),
      );
    });
  });

  describe('getBookmarkIds', () => {
    it('should return array of business IDs', async () => {
      mockPrismaService.bookmark.findMany.mockResolvedValue([
        { businessId: 'b1' },
        { businessId: 'b2' },
      ]);

      const res = await service.getBookmarkIds('user-1');
      expect(res).toEqual(['b1', 'b2']);
    });
  });
});
