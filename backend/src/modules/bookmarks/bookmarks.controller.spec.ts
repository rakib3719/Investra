import { Test, type TestingModule } from '@nestjs/testing';
import { BookmarksController } from './bookmarks.controller';
import { BookmarksService } from './bookmarks.service';

describe('BookmarksController', () => {
  let controller: BookmarksController;

  const mockBookmarksService = {
    getBookmarks: jest.fn(),
    getBookmarkIds: jest.fn(),
    addBookmark: jest.fn(),
    removeBookmark: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookmarksController],
      providers: [
        {
          provide: BookmarksService,
          useValue: mockBookmarksService,
        },
      ],
    }).compile();

    controller = module.get<BookmarksController>(BookmarksController);
  });

  it('should get bookmarks for current user', async () => {
    mockBookmarksService.getBookmarks.mockResolvedValue([]);
    const res = await controller.getBookmarks('user-1');
    expect(res).toEqual([]);
    expect(mockBookmarksService.getBookmarks).toHaveBeenCalledWith('user-1');
  });

  it('should get bookmark IDs for current user', async () => {
    mockBookmarksService.getBookmarkIds.mockResolvedValue(['b1', 'b2']);
    const res = await controller.getBookmarkIds('user-1');
    expect(res).toEqual(['b1', 'b2']);
    expect(mockBookmarksService.getBookmarkIds).toHaveBeenCalledWith('user-1');
  });

  it('should add bookmark for user and businessId', async () => {
    mockBookmarksService.addBookmark.mockResolvedValue({ success: true });
    const res = await controller.addBookmark('user-1', 'biz-1');
    expect(res).toEqual({ success: true });
    expect(mockBookmarksService.addBookmark).toHaveBeenCalledWith('user-1', 'biz-1');
  });

  it('should remove bookmark for user and businessId', async () => {
    mockBookmarksService.removeBookmark.mockResolvedValue({ success: true });
    const res = await controller.removeBookmark('user-1', 'biz-1');
    expect(res).toEqual({ success: true });
    expect(mockBookmarksService.removeBookmark).toHaveBeenCalledWith('user-1', 'biz-1');
  });
});
