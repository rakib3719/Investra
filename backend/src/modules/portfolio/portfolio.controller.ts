import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { CreatePortfolioItemDto } from './dto/create-portfolio-item.dto';
import { UpdateInvestorPortfolioMetaDto } from './dto/update-investor-portfolio-meta.dto';
import { UpdatePortfolioItemDto } from './dto/update-portfolio-item.dto';
import { PortfolioService } from './portfolio.service';

@ApiTags('Investor Portfolio')
@Controller('api/v1/investor/portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCookieAuth('accessToken')
  @ApiOperation({
    summary: 'Get the current investor portfolio, metrics, and all portfolio holdings',
  })
  @ApiResponse({ status: 200, description: 'Investor portfolio returned' })
  async getMyPortfolio(@CurrentUser('id') userId: string) {
    return this.portfolioService.getMyPortfolio(userId);
  }

  @Put('me/meta')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCookieAuth('accessToken')
  @ApiOperation({
    summary: 'Update investor thesis, professional bio, links, and portfolio metadata',
  })
  @ApiResponse({ status: 200, description: 'Metadata updated' })
  async updateMyPortfolioMeta(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateInvestorPortfolioMetaDto,
  ) {
    return this.portfolioService.updateMyPortfolioMeta(userId, dto);
  }

  @Post('items')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCookieAuth('accessToken')
  @ApiOperation({
    summary: 'Add a new portfolio holding, certificate, advisory experience, or video introduction',
  })
  @ApiResponse({ status: 201, description: 'Portfolio item created' })
  async createPortfolioItem(
    @CurrentUser('id') userId: string,
    @Body() dto: CreatePortfolioItemDto,
  ) {
    return this.portfolioService.createPortfolioItem(userId, dto);
  }

  @Put('items/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCookieAuth('accessToken')
  @ApiOperation({
    summary: 'Update an existing portfolio item',
  })
  @ApiResponse({ status: 200, description: 'Portfolio item updated' })
  async updatePortfolioItem(
    @CurrentUser('id') userId: string,
    @Param('id') itemId: string,
    @Body() dto: UpdatePortfolioItemDto,
  ) {
    return this.portfolioService.updatePortfolioItem(userId, itemId, dto);
  }

  @Delete('items/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCookieAuth('accessToken')
  @ApiOperation({
    summary: 'Delete a portfolio item',
  })
  @ApiResponse({ status: 200, description: 'Portfolio item deleted' })
  async deletePortfolioItem(
    @CurrentUser('id') userId: string,
    @Param('id') itemId: string,
  ) {
    return this.portfolioService.deletePortfolioItem(userId, itemId);
  }

  @Get('public/:identifier')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({
    summary: 'View public / entrepreneur-facing investor profile and portfolio (premium gated)',
  })
  @ApiResponse({ status: 200, description: 'Investor profile and portfolio returned' })
  async getPublicInvestorPortfolio(
    @CurrentUser() viewer: any | null,
    @Param('identifier') identifier: string,
  ) {
    return this.portfolioService.getPublicInvestorPortfolio(
      viewer?.id || null,
      viewer?.role || null,
      identifier,
    );
  }

  @Get('directory')
  @ApiOperation({
    summary: 'List verified investors with portfolio summaries and sectors',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sector', required: false, type: String })
  @ApiQuery({ name: 'query', required: false, type: String })
  async listVerifiedInvestors(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sector') sector?: string,
    @Query('query') query?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 20;
    return this.portfolioService.listVerifiedInvestors(
      pageNum,
      limitNum,
      sector,
      query,
    );
  }
}
