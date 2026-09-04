import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../../common/enums/user-role.enum';

@Controller('investor/bookmarks')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.INVESTOR, UserRole.ADMIN)
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Get()
  getBookmarks(@CurrentUser('id') userId: string) {
    return this.bookmarksService.getBookmarks(userId);
  }

  @Get('ids')
  getBookmarkIds(@CurrentUser('id') userId: string) {
    return this.bookmarksService.getBookmarkIds(userId);
  }

  @Post(':businessId')
  addBookmark(
    @CurrentUser('id') userId: string,
    @Param('businessId') businessId: string,
  ) {
    return this.bookmarksService.addBookmark(userId, businessId);
  }

  @Delete(':businessId')
  removeBookmark(
    @CurrentUser('id') userId: string,
    @Param('businessId') businessId: string,
  ) {
    return this.bookmarksService.removeBookmark(userId, businessId);
  }
}
