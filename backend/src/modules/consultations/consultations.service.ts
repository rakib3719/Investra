import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { NotificationsService } from '../notifications/notifications.service';
import {
  SlotStatus,
  ConsultationBookingStatus,
  NotificationType,
  PayoutStatus,
  UserRole,
} from '@prisma/client';
import { CreateSlotDto } from './dto/create-slot.dto';
import {
  BookSessionDto,
  UpdateMeetingLinkDto,
  UpdateConsultantMeetingPreferenceDto,
} from './dto/book-session.dto';

@Injectable()
export class ConsultationsService {
  private readonly logger = new Logger(ConsultationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    private readonly notificationsService: NotificationsService,
  ) {}

  // ==========================================
  // 1. CONSULTANT: MANAGE AVAILABILITY SLOTS
  // ==========================================

  async createSlot(consultantId: string, dto: CreateSlotDto) {
    const slotDate = new Date(`${dto.slotDate}T00:00:00.000Z`);

    // Verify consultant profile exists
    const profile = await this.prisma.consultantProfile.findUnique({
      where: { userId: consultantId },
    });
    if (!profile) {
      throw new BadRequestException('Consultant profile not found for this account.');
    }

    // Check for duplicate slot on same date and start time
    const existing = await this.prisma.consultantSlot.findFirst({
      where: {
        consultantId,
        slotDate,
        startTime: dto.startTime,
        status: { not: SlotStatus.CANCELLED },
      },
    });

    if (existing) {
      throw new ConflictException(
        `A slot already exists on ${dto.slotDate} at ${dto.startTime}.`,
      );
    }

    const duration = dto.durationMinutes || 60;

    return this.prisma.consultantSlot.create({
      data: {
        consultantId,
        slotDate,
        startTime: dto.startTime,
        endTime: dto.endTime,
        durationMinutes: duration,
        status: SlotStatus.AVAILABLE,
      },
    });
  }

  async getMySlots(consultantId: string) {
    return this.prisma.consultantSlot.findMany({
      where: { consultantId },
      orderBy: [{ slotDate: 'asc' }, { startTime: 'asc' }],
      include: {
        booking: {
          include: {
            client: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                image: true,
                role: true,
              },
            },
          },
        },
      },
    });
  }

  async deleteSlot(consultantId: string, slotId: string) {
    const slot = await this.prisma.consultantSlot.findUnique({
      where: { id: slotId },
      include: { booking: true },
    });

    if (!slot) {
      throw new NotFoundException('Slot not found.');
    }

    if (slot.consultantId !== consultantId) {
      throw new ForbiddenException('You do not own this availability slot.');
    }

    if (slot.status === SlotStatus.BOOKED || slot.booking) {
      throw new BadRequestException(
        'Cannot delete an already booked session slot. Please cancel the booking instead.',
      );
    }

    await this.prisma.consultantSlot.delete({
      where: { id: slotId },
    });

    return { message: 'Slot deleted successfully.' };
  }

  // ==========================================
  // 2. PUBLIC: VIEW CONSULTANT'S AVAILABLE SLOTS
  // ==========================================

  async getPublicAvailableSlots(consultantId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.prisma.consultantSlot.findMany({
      where: {
        consultantId,
        status: SlotStatus.AVAILABLE,
        slotDate: { gte: today },
      },
      orderBy: [{ slotDate: 'asc' }, { startTime: 'asc' }],
    });
  }

  // ==========================================
  // 3. BOOKING & REVENUE SPLIT (10% ADMIN / 90% CONSULTANT)
  // ==========================================

  async bookSession(clientId: string, dto: BookSessionDto) {
    const slot = await this.prisma.consultantSlot.findUnique({
      where: { id: dto.slotId },
      include: {
        consultant: {
          include: {
            consultantProfile: true,
          },
        },
      },
    });

    if (!slot) {
      throw new NotFoundException('Selected time slot does not exist.');
    }

    if (slot.status !== SlotStatus.AVAILABLE) {
      throw new BadRequestException(
        'This slot has already been booked or is no longer available.',
      );
    }

    if (slot.consultantId === clientId) {
      throw new BadRequestException('You cannot book a consultation session with yourself.');
    }

    const client = await this.prisma.user.findUnique({
      where: { id: clientId },
      select: { id: true, firstName: true, lastName: true, email: true },
    });

    if (!client) {
      throw new NotFoundException('Client user not found.');
    }

    // Determine session fee from consultant profile
    const profile = slot.consultant.consultantProfile;
    const grossAmountNumber =
      profile?.sessionFee ? Number(profile.sessionFee) :
      profile?.consultationFee ? Number(profile.consultationFee) : 100.0;

    // Financial split: 10% platform fee, 90% consultant earnings
    const platformFeeRateNumber = 0.10;
    const platformFeeAmountNumber = Number((grossAmountNumber * platformFeeRateNumber).toFixed(2));
    const consultantEarningsNumber = Number((grossAmountNumber - platformFeeAmountNumber).toFixed(2));

    // When a session is booked, meeting link starts as null.
    // The consultant will provide the specific Google Meet or Zoom link for this session.
    const platform = dto.meetingPlatform || 'GOOGLE_MEET';
    const meetingLink: string | null = null;

    const transactionId = `TXN-SES-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Execute atomic booking transaction
    const booking = await this.prisma.$transaction(async (tx) => {
      // Re-verify slot availability inside transaction
      const lockedSlot = await tx.consultantSlot.findUnique({
        where: { id: slot.id },
      });

      if (!lockedSlot || lockedSlot.status !== SlotStatus.AVAILABLE) {
        throw new BadRequestException('This slot was just taken by another user.');
      }

      // Mark slot as BOOKED
      await tx.consultantSlot.update({
        where: { id: slot.id },
        data: { status: SlotStatus.BOOKED },
      });

      // Create ConsultationBooking record
      return tx.consultationBooking.create({
        data: {
          slotId: slot.id,
          consultantId: slot.consultantId,
          clientId,
          topic: dto.topic,
          clientNotes: dto.clientNotes || null,
          status: ConsultationBookingStatus.CONFIRMED,
          meetingPlatform: platform,
          meetingLink,
          grossAmount: grossAmountNumber,
          platformFeeRate: platformFeeRateNumber,
          platformFeeAmount: platformFeeAmountNumber,
          consultantEarnings: consultantEarningsNumber,
          currency: 'USD',
          paymentProvider: 'STRIPE_DIRECT',
          transactionId,
          isPaid: true,
          paidAt: new Date(),
        },
        include: {
          slot: true,
          consultant: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              image: true,
            },
          },
          client: {
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
    });

    // Send asynchronous confirmation email to both client and consultant
    const slotDateStr = new Date(slot.slotDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    const timeStr = `${slot.startTime} - ${slot.endTime}`;
    const clientFullName = `${client.firstName || ''} ${client.lastName || ''}`.trim() || client.email;
    const consultantFullName = `${slot.consultant.firstName || ''} ${slot.consultant.lastName || ''}`.trim() || slot.consultant.email;

    this.mailService
      .sendSessionBookingEmails({
        clientEmail: client.email,
        clientName: clientFullName,
        consultantEmail: slot.consultant.email,
        consultantName: consultantFullName,
        topic: dto.topic,
        dateStr: slotDateStr,
        timeStr,
        durationMinutes: slot.durationMinutes,
        meetingLink: meetingLink || 'PENDING',
        meetingPlatform: platform,
        amount: `$${grossAmountNumber.toFixed(2)} USD`,
      })
      .catch((err) => {
        this.logger.error(`Failed to send session booking emails: ${err?.message || err}`);
      });

    // In-app real-time notification to Consultant
    this.notificationsService.notify({
      userId: slot.consultantId,
      type: NotificationType.SESSION_BOOKED,
      title: `Action Required: New Session Booked (${dto.topic})`,
      message: `${clientFullName} scheduled a session on ${slotDateStr} (${timeStr}). Please add your Google Meet or Zoom link.`,
      actionUrl: '/dashboard/consultant/calendar',
      metadata: { bookingId: booking.id },
      sendEmail: false,
    }).catch(() => {});

    // In-app real-time notification to Client
    this.notificationsService.notify({
      userId: clientId,
      type: NotificationType.SESSION_BOOKED,
      title: `1-on-1 Session Confirmed with ${consultantFullName}`,
      message: `Your session on ${slotDateStr} (${timeStr}) is confirmed. Your advisor will provide the Google Meet / Zoom link shortly.`,
      actionUrl: '/dashboard/investor/consultations',
      metadata: { bookingId: booking.id },
      sendEmail: false,
    }).catch(() => {});

    return booking;
  }

  // ==========================================
  // 4. MY BOOKINGS (CLIENT PERSPECTIVE)
  // ==========================================

  async getMyClientBookings(clientId: string) {
    return this.prisma.consultationBooking.findMany({
      where: { clientId },
      orderBy: { createdAt: 'desc' },
      include: {
        slot: true,
        consultant: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            image: true,
            consultantProfile: {
              select: {
                headline: true,
                specialization: true,
              },
            },
          },
        },
      },
    });
  }

  // ==========================================
  // 5. MY SESSIONS (CONSULTANT PERSPECTIVE)
  // ==========================================

  async getMyConsultantSessions(consultantId: string) {
    return this.prisma.consultationBooking.findMany({
      where: { consultantId },
      orderBy: { createdAt: 'desc' },
      include: {
        slot: true,
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            image: true,
            role: true,
          },
        },
      },
    });
  }

  // ==========================================
  // 6. UPDATE MEETING LINK
  // ==========================================

  async updateMeetingLink(
    consultantId: string,
    bookingId: string,
    dto: UpdateMeetingLinkDto,
  ) {
    const booking = await this.prisma.consultationBooking.findUnique({
      where: { id: bookingId },
      include: {
        slot: true,
        consultant: {
          select: { firstName: true, lastName: true },
        },
        client: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });

    if (!booking) {
      throw new NotFoundException('Session booking not found.');
    }

    if (booking.consultantId !== consultantId) {
      throw new ForbiddenException('Only the session consultant can update the meeting link.');
    }

    const updated = await this.prisma.consultationBooking.update({
      where: { id: bookingId },
      data: {
        meetingLink: dto.meetingLink.trim(),
        meetingPlatform: dto.meetingPlatform || booking.meetingPlatform,
      },
      include: {
        slot: true,
        consultant: {
          select: { firstName: true, lastName: true },
        },
        client: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });

    const consultantName =
      `${updated.consultant.firstName || ''} ${updated.consultant.lastName || ''}`.trim() || 'Your Advisor';
    const slotDateStr = new Date(updated.slot.slotDate).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });

    // Notify client in real-time that meeting link is available
    this.notificationsService
      .notify({
        userId: updated.clientId,
        type: NotificationType.SESSION_BOOKED,
        title: `Meeting Link Ready: 1-on-1 Session with ${consultantName}`,
        message: `${consultantName} has provided the meeting link for your session on ${slotDateStr} (${updated.slot.startTime} - ${updated.slot.endTime}). Link: ${dto.meetingLink.trim()}`,
        actionUrl: '/dashboard/investor/consultations',
        metadata: { bookingId: updated.id, meetingLink: dto.meetingLink.trim() },
        sendEmail: true,
      })
      .catch(() => {});

    return updated;
  }

  async updateDefaultMeetingPreference(
    consultantId: string,
    dto: UpdateConsultantMeetingPreferenceDto,
  ) {
    const profile = await this.prisma.consultantProfile.findUnique({
      where: { userId: consultantId },
    });

    if (!profile) {
      throw new NotFoundException('Consultant profile not found.');
    }

    return this.prisma.consultantProfile.update({
      where: { userId: consultantId },
      data: {
        defaultMeetingLink: dto.defaultMeetingLink?.trim() || null,
      },
    });
  }

  // ==========================================
  // 7. COMPREHENSIVE FINANCIAL BREAKDOWN (COURSES VS SESSIONS)
  // ==========================================

  async getConsultantUnifiedEarnings(consultantId: string) {
    const [coursePayments, sessionBookings, payouts, profile] = await Promise.all([
      this.prisma.coursePayment.findMany({
        where: { consultantId, status: 'PAID' },
        orderBy: { createdAt: 'desc' },
        include: {
          course: { select: { title: true, slug: true } },
          buyer: { select: { firstName: true, lastName: true, email: true } },
        },
      }),
      this.prisma.consultationBooking.findMany({
        where: { consultantId, isPaid: true },
        orderBy: { createdAt: 'desc' },
        include: {
          slot: true,
          client: { select: { firstName: true, lastName: true, email: true } },
        },
      }),
      this.prisma.consultantPayout.findMany({
        where: { consultantId },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.consultantProfile.findUnique({
        where: { userId: consultantId },
      }),
    ]);

    // 1. Courses Breakdown
    const coursesGross = coursePayments.reduce((acc, p) => acc + Number(p.grossAmount), 0);
    const coursesPlatformFee = coursePayments.reduce((acc, p) => acc + Number(p.platformFeeAmount), 0);
    const coursesNetEarnings = coursePayments.reduce((acc, p) => acc + Number(p.consultantEarnings), 0);

    // 2. Sessions Breakdown
    const sessionsGross = sessionBookings.reduce((acc, b) => acc + Number(b.grossAmount), 0);
    const sessionsPlatformFee = sessionBookings.reduce((acc, b) => acc + Number(b.platformFeeAmount), 0);
    const sessionsNetEarnings = sessionBookings.reduce((acc, b) => acc + Number(b.consultantEarnings), 0);

    // 3. Combined Financials
    const totalGross = coursesGross + sessionsGross;
    const totalPlatformFee = coursesPlatformFee + sessionsPlatformFee;
    const totalNetEarnings = coursesNetEarnings + sessionsNetEarnings;

    const totalPaidOut = payouts
      .filter((p) => p.status === PayoutStatus.PAID || p.status === PayoutStatus.APPROVED)
      .reduce((sum, p) => sum + Number(p.amount), 0);

    const pendingPayout = payouts
      .filter((p) => p.status === PayoutStatus.PENDING)
      .reduce((sum, p) => sum + Number(p.amount), 0);

    const availableBalance = Math.max(0, Number((totalNetEarnings - totalPaidOut - pendingPayout).toFixed(2)));

    return {
      stats: {
        totalGross: Number(totalGross.toFixed(2)),
        totalPlatformFee: Number(totalPlatformFee.toFixed(2)),
        totalNetEarnings: Number(totalNetEarnings.toFixed(2)),
        availableBalance,
        totalPaidOut: Number(totalPaidOut.toFixed(2)),
        pendingPayout: Number(pendingPayout.toFixed(2)),
      },
      breakdown: {
        courses: {
          totalEnrollments: coursePayments.length,
          gross: Number(coursesGross.toFixed(2)),
          platformFee: Number(coursesPlatformFee.toFixed(2)),
          net: Number(coursesNetEarnings.toFixed(2)),
          rate: '10% Platform / 90% Consultant',
        },
        sessions: {
          totalSessions: sessionBookings.length,
          gross: Number(sessionsGross.toFixed(2)),
          platformFee: Number(sessionsPlatformFee.toFixed(2)),
          net: Number(sessionsNetEarnings.toFixed(2)),
          rate: '10% Platform / 90% Consultant',
        },
      },
      courseTransactions: coursePayments,
      sessionTransactions: sessionBookings,
      payouts,
      profile: {
        sessionFee: profile?.sessionFee ? Number(profile.sessionFee) : 100,
        consultationFee: profile?.consultationFee ? Number(profile.consultationFee) : 100,
        defaultMeetingLink: profile?.defaultMeetingLink || null,
      },
    };
  }

  // ==========================================
  // 8. ADMIN: GLOBAL SESSIONS & PLATFORM REVENUE
  // ==========================================

  async getAdminSessionOverview() {
    const [allBookings, allSlotsCount] = await Promise.all([
      this.prisma.consultationBooking.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          slot: true,
          consultant: {
            select: { id: true, firstName: true, lastName: true, email: true },
          },
          client: {
            select: { id: true, firstName: true, lastName: true, email: true },
          },
        },
      }),
      this.prisma.consultantSlot.count(),
    ]);

    const totalGross = allBookings.reduce((sum, b) => sum + Number(b.grossAmount), 0);
    const totalPlatformRevenue = allBookings.reduce((sum, b) => sum + Number(b.platformFeeAmount), 0);
    const totalConsultantDisbursements = allBookings.reduce((sum, b) => sum + Number(b.consultantEarnings), 0);

    return {
      stats: {
        totalBookings: allBookings.length,
        totalSlotsCreated: allSlotsCount,
        totalGross: Number(totalGross.toFixed(2)),
        totalPlatformRevenue: Number(totalPlatformRevenue.toFixed(2)), // 10%
        totalConsultantDisbursements: Number(totalConsultantDisbursements.toFixed(2)), // 90%
      },
      bookings: allBookings,
    };
  }
}
