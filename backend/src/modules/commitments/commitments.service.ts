import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CommitmentStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCommitmentDto } from './dto/create-commitment.dto';
import { RespondCommitmentDto } from './dto/respond-commitment.dto';
import { MessagesService } from '../messages/messages.service';

@Injectable()
export class CommitmentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly messagesService: MessagesService,
  ) {}

  /**
   * Investor issues a term sheet / investment commitment to an entrepreneur
   */
  async createCommitment(investorId: string, dto: CreateCommitmentDto) {
    if (investorId === dto.entrepreneurId) {
      throw new ForbiddenException('Cannot commit capital to yourself');
    }

    const entrepreneur = await this.prisma.user.findUnique({
      where: { id: dto.entrepreneurId },
      select: { id: true, firstName: true, lastName: true, email: true },
    });

    if (!entrepreneur) {
      throw new NotFoundException('Entrepreneur not found');
    }

    const commitment = await this.prisma.investmentCommitment.create({
      data: {
        investorId,
        entrepreneurId: dto.entrepreneurId,
        businessId: dto.businessId || null,
        introRequestId: dto.introRequestId || null,
        startupName: dto.startupName.trim(),
        amount: dto.amount,
        currency: dto.currency || 'USD',
        instrument: dto.instrument,
        valuation: dto.valuation || null,
        equityPercentage: dto.equityPercentage || null,
        termsSummary: dto.termsSummary.trim(),
        termSheetDocUrl: dto.termSheetDocUrl || null,
        termSheetMediaId: dto.termSheetMediaId || null,
        investorNotes: dto.investorNotes?.trim() || null,
        status: CommitmentStatus.PROPOSED,
        issuedAt: new Date(),
      },
      include: {
        entrepreneur: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            image: true,
          },
        },
      },
    });

    // If there is an active conversation between these users, post an automated notice in the chat
    try {
      const conv = await this.prisma.conversation.findFirst({
        where: {
          OR: [
            { participant1Id: investorId, participant2Id: dto.entrepreneurId },
            { participant1Id: dto.entrepreneurId, participant2Id: investorId },
          ],
        },
      });

      if (conv) {
        const instrumentLabel = dto.instrument.replace('_', ' ');
        const formattedAmount = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: dto.currency || 'USD',
          maximumFractionDigits: 0,
        }).format(dto.amount);

        const noticeText = `💼 Formal Term Sheet Issued: ${formattedAmount} via ${instrumentLabel} for ${dto.startupName}. Terms: ${dto.termsSummary.slice(0, 150)}...`;

        await this.messagesService.sendMessage(investorId, conv.id, {
          content: noticeText,
          attachmentName: dto.termSheetDocUrl ? 'Term_Sheet_Document.pdf' : undefined,
          attachmentUrl: dto.termSheetDocUrl || undefined,
          mediaFileId: dto.termSheetMediaId || undefined,
        });
      }
    } catch (err) {
      // Non-fatal if chat notice fails
      console.error('Failed to notify conversation on term sheet creation', err);
    }

    return commitment;
  }

  /**
   * Investor retrieves all their commitments, active positions, and capital stats
   */
  async getInvestorCommitments(investorId: string) {
    const commitments = await this.prisma.investmentCommitment.findMany({
      where: { investorId },
      include: {
        entrepreneur: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            image: true,
            entrepreneurProfile: {
              select: {
                companyName: true,
                designation: true,
              },
            },
          },
        },
        business: {
          select: {
            id: true,
            title: true,
            slug: true,
            targetAmount: true,
            raisedAmount: true,
            stage: true,
            category: { select: { name: true } },
          },
        },
        introRequest: {
          select: {
            id: true,
            startupName: true,
            targetSector: true,
            raisingAmount: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    let totalDeployed = 0;
    let totalProposed = 0;
    let activePositionsCount = 0;
    let proposedOffersCount = 0;

    commitments.forEach((c) => {
      const num = Number(c.amount) || 0;
      if (c.status === CommitmentStatus.ACCEPTED) {
        totalDeployed += num;
        activePositionsCount += 1;
      } else if (c.status === CommitmentStatus.PROPOSED || c.status === CommitmentStatus.NEGOTIATING) {
        totalProposed += num;
        proposedOffersCount += 1;
      }
    });

    return {
      stats: {
        totalDeployed,
        totalProposed,
        activePositionsCount,
        proposedOffersCount,
        totalOffersCount: commitments.length,
      },
      commitments: commitments.map((c) => ({
        id: c.id,
        startupName: c.startupName,
        amount: Number(c.amount),
        currency: c.currency,
        instrument: c.instrument,
        valuation: c.valuation ? Number(c.valuation) : null,
        equityPercentage: c.equityPercentage ? Number(c.equityPercentage) : null,
        termsSummary: c.termsSummary,
        termSheetDocUrl: c.termSheetDocUrl,
        status: c.status,
        investorNotes: c.investorNotes,
        entrepreneurNotes: c.entrepreneurNotes,
        issuedAt: c.issuedAt,
        respondedAt: c.respondedAt,
        createdAt: c.createdAt,
        entrepreneur: {
          id: c.entrepreneur.id,
          name: [c.entrepreneur.firstName, c.entrepreneur.lastName].filter(Boolean).join(' ') || c.entrepreneur.email,
          email: c.entrepreneur.email,
          image: c.entrepreneur.image,
          company: c.entrepreneur.entrepreneurProfile?.companyName || c.startupName,
          designation: c.entrepreneur.entrepreneurProfile?.designation || 'Founder',
        },
        business: c.business,
        introRequest: c.introRequest,
      })),
    };
  }

  /**
   * Entrepreneur retrieves incoming commitments & term sheets from investors
   */
  async getEntrepreneurCommitments(entrepreneurId: string) {
    const commitments = await this.prisma.investmentCommitment.findMany({
      where: { entrepreneurId },
      include: {
        investor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            image: true,
            investorProfile: {
              select: {
                id: true,
                headline: true,
                companyName: true,
                designation: true,
                verificationStatus: true,
              },
            },
          },
        },
        business: {
          select: {
            id: true,
            title: true,
            targetAmount: true,
            raisedAmount: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return commitments.map((c) => ({
      id: c.id,
      startupName: c.startupName,
      amount: Number(c.amount),
      currency: c.currency,
      instrument: c.instrument,
      valuation: c.valuation ? Number(c.valuation) : null,
      equityPercentage: c.equityPercentage ? Number(c.equityPercentage) : null,
      termsSummary: c.termsSummary,
      termSheetDocUrl: c.termSheetDocUrl,
      status: c.status,
      investorNotes: c.investorNotes,
      entrepreneurNotes: c.entrepreneurNotes,
      issuedAt: c.issuedAt,
      respondedAt: c.respondedAt,
      createdAt: c.createdAt,
      investor: {
        id: c.investor.id,
        name: [c.investor.firstName, c.investor.lastName].filter(Boolean).join(' ') || c.investor.email,
        email: c.investor.email,
        image: c.investor.image,
        headline: c.investor.investorProfile?.headline,
        company: c.investor.investorProfile?.companyName || 'Accredited Investor',
        designation: c.investor.investorProfile?.designation || 'Angel / Venture Partner',
        isVerified: c.investor.investorProfile?.verificationStatus === 'VERIFIED',
      },
      business: c.business,
    }));
  }

  /**
   * Entrepreneur responds to a term sheet (Accept, Decline, Negotiate)
   */
  async respondToCommitment(
    entrepreneurId: string,
    commitmentId: string,
    dto: RespondCommitmentDto,
  ) {
    const commitment = await this.prisma.investmentCommitment.findUnique({
      where: { id: commitmentId },
      include: {
        business: true,
      },
    });

    if (!commitment) {
      throw new NotFoundException('Commitment not found');
    }

    if (commitment.entrepreneurId !== entrepreneurId) {
      throw new ForbiddenException('Not authorized to respond to this commitment');
    }

    let newStatus: CommitmentStatus;
    if (dto.action === 'ACCEPT') {
      newStatus = CommitmentStatus.ACCEPTED;
    } else if (dto.action === 'DECLINE') {
      newStatus = CommitmentStatus.DECLINED;
    } else {
      newStatus = CommitmentStatus.NEGOTIATING;
    }

    const updated = await this.prisma.investmentCommitment.update({
      where: { id: commitmentId },
      data: {
        status: newStatus,
        entrepreneurNotes: dto.notes?.trim() || null,
        respondedAt: new Date(),
      },
    });

    // If accepted and linked to a business campaign, increase raisedAmount
    if (dto.action === 'ACCEPT' && commitment.businessId) {
      try {
        await this.prisma.business.update({
          where: { id: commitment.businessId },
          data: {
            raisedAmount: { increment: commitment.amount },
          },
        });
      } catch (err) {
        console.error('Failed to update business raisedAmount', err);
      }
    }

    // Post update in deal conversation if exists
    try {
      const conv = await this.prisma.conversation.findFirst({
        where: {
          OR: [
            { participant1Id: commitment.investorId, participant2Id: entrepreneurId },
            { participant1Id: entrepreneurId, participant2Id: commitment.investorId },
          ],
        },
      });

      if (conv) {
        const actionLabel =
          dto.action === 'ACCEPT'
            ? '✓ Term Sheet ACCEPTED by founder! Next: Legal closing & wire transfers.'
            : dto.action === 'DECLINE'
            ? '✕ Term Sheet DECLINED by founder.'
            : '💬 Founder requested NEGOTIATION on proposed terms.';

        const noteSnippet = dto.notes?.trim() ? ` Note: "${dto.notes.trim()}"` : '';
        const noticeText = `${actionLabel}${noteSnippet}`;

        await this.messagesService.sendMessage(entrepreneurId, conv.id, {
          content: noticeText,
        });
      }
    } catch (err) {
      console.error('Failed to post deal response notice in conversation', err);
    }

    return updated;
  }
}
