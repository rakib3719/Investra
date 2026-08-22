import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { Request } from 'express';
import { PrismaService } from '../../prisma/prisma.service';
import { env } from '../../common/config/env.config';
import { CreateVisitorInsightDto } from './dto/create-visitor-insight.dto';

@Injectable()
export class VisitorInsightsService {
  constructor(private readonly prisma: PrismaService) {}

  async collect(request: Request, dto: CreateVisitorInsightDto) {
    const userAgent = request.get('user-agent') || '';
    const userAgentDetails = parseUserAgent(userAgent);
    const hasValidLocation = dto.locationConsent &&
      dto.latitude !== undefined &&
      dto.longitude !== undefined;

    await this.prisma.visitorInsight.create({
      data: {
        anonymousId: dto.anonymousId,
        ipHash: this.hashIp(request.ip || request.socket.remoteAddress || ''),
        pagePath: dto.pagePath,
        ...userAgentDetails,
        language: dto.language,
        timezone: dto.timezone,
        screenWidth: dto.screenWidth,
        screenHeight: dto.screenHeight,
        viewportWidth: dto.viewportWidth,
        viewportHeight: dto.viewportHeight,
        referrer: dto.referrer,
        locationConsent: hasValidLocation,
        latitude: hasValidLocation ? dto.latitude : undefined,
        longitude: hasValidLocation ? dto.longitude : undefined,
        locationAccuracy: hasValidLocation ? dto.locationAccuracy : undefined,
      },
    });

    return { message: 'Visitor preferences recorded' };
  }

  async getAdminOverview(limit = 50) {
    const records = await this.prisma.visitorInsight.findMany({
      orderBy: { createdAt: 'desc' },
      take: Math.min(Math.max(limit, 1), 100),
    });

    const uniqueVisitors = await this.prisma.visitorInsight.findMany({
      distinct: ['anonymousId'],
      select: { anonymousId: true },
    });

    return {
      summary: {
        totalRecordedVisits: await this.prisma.visitorInsight.count(),
        uniqueOptedInVisitors: uniqueVisitors.length,
        visitsWithLocation: records.filter((record) => record.locationConsent).length,
      },
      visitors: records.map((record) => ({
        id: record.id,
        visitedAt: record.createdAt,
        browser: [record.browserName, record.browserVersion].filter(Boolean).join(' ') || 'Unknown browser',
        operatingSystem: record.operatingSystem || 'Unknown OS',
        device: record.deviceType || 'Unknown device',
        language: record.language || '—',
        timezone: record.timezone || '—',
        screen: record.screenWidth && record.screenHeight ? `${record.screenWidth} × ${record.screenHeight}` : '—',
        viewport: record.viewportWidth && record.viewportHeight ? `${record.viewportWidth} × ${record.viewportHeight}` : '—',
        referrer: record.referrer || 'Direct visit',
        location: record.locationConsent && record.latitude !== null && record.longitude !== null
          ? {
              latitude: Number(record.latitude),
              longitude: Number(record.longitude),
              accuracyMeters: record.locationAccuracy,
            }
          : null,
      })),
    };
  }

  private hashIp(ip: string) {
    return createHash('sha256')
      .update(`${env.VISITOR_HASH_SALT}:${ip}`)
      .digest('hex');
  }
}

function parseUserAgent(userAgent: string) {
  const browser = userAgent.match(/Edg\/([\d.]+)/)
    ? { browserName: 'Microsoft Edge', browserVersion: userAgent.match(/Edg\/([\d.]+)/)?.[1] }
    : userAgent.match(/OPR\/([\d.]+)/)
      ? { browserName: 'Opera', browserVersion: userAgent.match(/OPR\/([\d.]+)/)?.[1] }
      : userAgent.match(/Chrome\/([\d.]+)/)
        ? { browserName: 'Chrome', browserVersion: userAgent.match(/Chrome\/([\d.]+)/)?.[1] }
        : userAgent.match(/Firefox\/([\d.]+)/)
          ? { browserName: 'Firefox', browserVersion: userAgent.match(/Firefox\/([\d.]+)/)?.[1] }
          : userAgent.match(/Version\/([\d.]+).*Safari/)
            ? { browserName: 'Safari', browserVersion: userAgent.match(/Version\/([\d.]+).*Safari/)?.[1] }
            : { browserName: undefined, browserVersion: undefined };

  const operatingSystem = /Android/.test(userAgent)
    ? 'Android'
    : /iPhone|iPad|iPod/.test(userAgent)
      ? 'iOS/iPadOS'
      : /Windows NT/.test(userAgent)
        ? 'Windows'
        : /Mac OS X/.test(userAgent)
          ? 'macOS'
          : /Linux/.test(userAgent)
            ? 'Linux'
            : undefined;

  const deviceType = /iPad|Tablet/.test(userAgent)
    ? 'Tablet'
    : /Mobi|Android/.test(userAgent)
      ? 'Mobile'
      : userAgent
        ? 'Desktop'
        : undefined;

  return { ...browser, operatingSystem, deviceType };
}
