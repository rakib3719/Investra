import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { StripeService } from '../subscriptions/stripe.service';
import { env } from '../../common/config/env.config';
import { CourseStatus, CourseLevel, PayoutStatus, UserRole } from '@prisma/client';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { RequestPayoutDto, UpdatePayoutStatusDto } from './dto/payout.dto';

@Injectable()
export class CoursesService {
  private readonly logger = new Logger(CoursesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly stripeService: StripeService,
  ) {}

  // ==========================================
  // 1. PUBLIC: CATALOG & SEARCH
  // ==========================================
  async getPublicCourses(query: {
    category?: string;
    level?: CourseLevel;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    limit?: number;
  }) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Math.min(50, Number(query.limit) || 12));
    const skip = (page - 1) * limit;

    const where: any = {
      status: CourseStatus.PUBLISHED,
    };

    if (query.category && query.category !== 'ALL') {
      where.category = query.category;
    }

    if (query.level) {
      where.level = query.level;
    }

    if (query.search && query.search.trim()) {
      where.OR = [
        { title: { contains: query.search.trim(), mode: 'insensitive' } },
        { tagline: { contains: query.search.trim(), mode: 'insensitive' } },
        { description: { contains: query.search.trim(), mode: 'insensitive' } },
      ];
    }

    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      where.price = {};
      if (query.minPrice !== undefined) where.price.gte = Number(query.minPrice);
      if (query.maxPrice !== undefined) where.price.lte = Number(query.maxPrice);
    }

    const [total, courses] = await Promise.all([
      this.prisma.course.count({ where }),
      this.prisma.course.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
        include: {
          consultant: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              image: true,
              consultantProfile: {
                select: {
                  headline: true,
                  specialization: true,
                  verificationStatus: true,
                  averageRating: true,
                },
              },
            },
          },
          _count: {
            select: {
              lessons: true,
              enrollments: true,
            },
          },
        },
      }),
    ]);

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data: courses.map((c) => ({
        id: c.id,
        title: c.title,
        slug: c.slug,
        tagline: c.tagline,
        description: c.description,
        thumbnailUrl: c.thumbnailUrl,
        category: c.category,
        level: c.level,
        price: Number(c.price),
        currency: c.currency,
        isFeatured: c.isFeatured,
        totalDurationMinutes: c.totalDurationMinutes,
        createdAt: c.createdAt,
        consultant: {
          id: c.consultant.id,
          name: `${c.consultant.firstName || ''} ${c.consultant.lastName || ''}`.trim() || 'Advisor',
          image: c.consultant.image,
          headline: c.consultant.consultantProfile?.headline || '',
          specialization: c.consultant.consultantProfile?.specialization || '',
          isVerified: c.consultant.consultantProfile?.verificationStatus === 'VERIFIED',
          rating: Number(c.consultant.consultantProfile?.averageRating || 5),
        },
        lessonsCount: c._count.lessons,
        enrollmentsCount: c._count.enrollments,
      })),
    };
  }

  // ==========================================
  // 2. PUBLIC: COURSE DETAILS & OUTLINE
  // ==========================================
  async getPublicCourseBySlug(slug: string, requestingUserId?: string) {
    const course = await this.prisma.course.findUnique({
      where: { slug },
      include: {
        consultant: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            image: true,
            bio: true,
            consultantProfile: {
              select: {
                headline: true,
                specialization: true,
                consultantLevel: true,
                yearsOfExperience: true,
                averageRating: true,
                verificationStatus: true,
              },
            },
          },
        },
        lessons: {
          where: { isPublished: true },
          orderBy: { sortOrder: 'asc' },
        },
        _count: {
          select: {
            lessons: true,
            enrollments: true,
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException(`Course with slug "${slug}" not found.`);
    }

    // Check enrollment status of requesting user
    let isEnrolled = false;
    let enrollment: any = null;

    if (requestingUserId) {
      enrollment = await this.prisma.courseEnrollment.findUnique({
        where: {
          courseId_userId: {
            courseId: course.id,
            userId: requestingUserId,
          },
        },
      });

      if (enrollment) {
        isEnrolled = true;
      }

      // If user is creator or admin, grant full access
      if (course.consultantId === requestingUserId) {
        isEnrolled = true;
      }
    }

    // Process curriculum outline:
    // User requirement: Title, description, duration, sortOrder are visible to everyone.
    // Video URL is unlocked if: user is enrolled OR lesson is marked as preview (isPreview === true).
    const lessonsOutline = course.lessons.map((lesson) => {
      const canAccessVideo = isEnrolled || lesson.isPreview;
      return {
        id: lesson.id,
        title: lesson.title,
        slug: lesson.slug,
        description: lesson.description,
        sortOrder: lesson.sortOrder,
        durationMinutes: lesson.durationMinutes,
        isPreview: lesson.isPreview,
        isLocked: !canAccessVideo,
        videoProvider: canAccessVideo ? lesson.videoProvider : null,
        videoUrl: canAccessVideo ? lesson.videoUrl : null,
        resources: canAccessVideo ? lesson.resources : [],
      };
    });

    return {
      id: course.id,
      title: course.title,
      slug: course.slug,
      tagline: course.tagline,
      description: course.description,
      thumbnailUrl: course.thumbnailUrl,
      category: course.category,
      level: course.level,
      price: Number(course.price),
      currency: course.currency,
      status: course.status,
      isFeatured: course.isFeatured,
      totalDurationMinutes: course.totalDurationMinutes,
      createdAt: course.createdAt,
      consultant: {
        id: course.consultant.id,
        name: `${course.consultant.firstName || ''} ${course.consultant.lastName || ''}`.trim() || 'Advisor',
        image: course.consultant.image,
        bio: course.consultant.bio,
        headline: course.consultant.consultantProfile?.headline || '',
        specialization: course.consultant.consultantProfile?.specialization || '',
        yearsOfExperience: course.consultant.consultantProfile?.yearsOfExperience || 0,
        rating: Number(course.consultant.consultantProfile?.averageRating || 5),
        isVerified: course.consultant.consultantProfile?.verificationStatus === 'VERIFIED',
      },
      stats: {
        lessonsCount: course._count.lessons,
        enrollmentsCount: course._count.enrollments,
      },
      isEnrolled,
      enrollment: enrollment
        ? {
            id: enrollment.id,
            progressPercent: enrollment.progressPercent,
            completedLessonIds: enrollment.completedLessonIds,
            enrolledAt: enrollment.enrolledAt,
          }
        : null,
      lessons: lessonsOutline,
    };
  }

  // ==========================================
  // 3. PUBLIC: VERIFIED CONSULTANTS LIST
  // ==========================================
  async getVerifiedConsultants() {
    const consultants = await this.prisma.user.findMany({
      where: {
        role: UserRole.CONSULTANT,
        consultantProfile: {
          verificationStatus: 'VERIFIED',
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        image: true,
        bio: true,
        consultantProfile: {
          select: {
            headline: true,
            specialization: true,
            consultantLevel: true,
            yearsOfExperience: true,
            consultationFee: true,
            averageRating: true,
            totalReviews: true,
            verificationStatus: true,
          },
        },
        _count: {
          select: {
            coursesCreated: {
              where: { status: CourseStatus.PUBLISHED },
            },
          },
        },
      },
    });

    return consultants.map((c) => ({
      id: c.id,
      name: `${c.firstName || ''} ${c.lastName || ''}`.trim() || 'Verified Advisor',
      image: c.image,
      bio: c.bio,
      headline: c.consultantProfile?.headline || 'Investment & Strategy Consultant',
      specialization: c.consultantProfile?.specialization || 'Strategic Growth',
      level: c.consultantProfile?.consultantLevel || 'SENIOR',
      experienceYears: c.consultantProfile?.yearsOfExperience || 5,
      consultationFee: Number(c.consultantProfile?.consultationFee || 150),
      rating: Number(c.consultantProfile?.averageRating || 5),
      reviewsCount: c.consultantProfile?.totalReviews || 12,
      publishedCoursesCount: c._count.coursesCreated,
      isVerified: true,
    }));
  }

  // ==========================================
  // 4. ENROLLMENT & CHECKOUT
  // ==========================================
  async enrollInCourse(courseId: string, userId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: {
        consultant: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found.');
    }

    if (course.status !== CourseStatus.PUBLISHED) {
      throw new BadRequestException('This course is not open for enrollment.');
    }

    // Check existing enrollment
    const existingEnrollment = await this.prisma.courseEnrollment.findUnique({
      where: {
        courseId_userId: {
          courseId: course.id,
          userId,
        },
      },
    });

    if (existingEnrollment) {
      return {
        alreadyEnrolled: true,
        enrollment: existingEnrollment,
        message: 'You are already enrolled in this course.',
      };
    }

    const price = Number(course.price);

    // Free enrollment
    if (price === 0) {
      const enrollment = await this.prisma.courseEnrollment.create({
        data: {
          courseId: course.id,
          userId,
          pricePaid: 0,
          currency: course.currency,
          paymentProvider: 'FREE',
          progressPercent: 0,
          completedLessonIds: [],
        },
      });

      return {
        isFree: true,
        enrolled: true,
        enrollment,
        message: 'Enrolled successfully!',
      };
    }

    // Paid course: Initiate Stripe Checkout Session
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, firstName: true, lastName: true },
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const stripeClient = this.stripeService.getStripe();
    if (!stripeClient) {
      throw new BadRequestException(
        'Stripe payment gateway is not configured on the server. Please contact support.',
      );
    }

    const frontendUrl = env.FRONTEND_URL || 'http://localhost:3000';

    const session = await stripeClient.checkout.sessions.create({
      mode: 'payment',
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: (course.currency || 'USD').toLowerCase(),
            product_data: {
              name: course.title,
              description: course.tagline || `Course by ${course.consultant.firstName || 'Advisor'}`,
              images: course.thumbnailUrl ? [course.thumbnailUrl] : undefined,
            },
            unit_amount: Math.round(price * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        type: 'COURSE_PURCHASE',
        courseId: course.id,
        buyerId: userId,
        consultantId: course.consultantId,
      },
      success_url: `${frontendUrl}/courses/${course.slug}?checkout_success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/courses/${course.slug}?checkout_cancelled=true`,
    });

    return {
      isFree: false,
      url: session.url,
      sessionId: session.id,
    };
  }

  // Synchronous session verification fallback (instant post-redirect enrollment)
  async verifyAndEnrollPaidCourse(userId: string, sessionId: string) {
    if (!sessionId) {
      throw new BadRequestException('Session ID is required.');
    }

    const stripeClient = this.stripeService.getStripe();
    if (!stripeClient) {
      throw new BadRequestException('Stripe payment gateway is not configured.');
    }

    const session = await stripeClient.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      throw new BadRequestException('Checkout session payment was not completed.');
    }

    const metadata = session.metadata || {};
    const sessionUserId = metadata.buyerId;
    const courseId = metadata.courseId;

    if (sessionUserId !== userId) {
      throw new BadRequestException('Checkout session does not belong to the authenticated user.');
    }

    if (!courseId) {
      throw new BadRequestException('Missing courseId in session metadata.');
    }

    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found.');
    }

    const transactionId = (session.payment_intent as string) || session.id;
    const grossAmount = session.amount_total ? session.amount_total / 100 : Number(course.price);
    const currency = session.currency ? session.currency.toUpperCase() : 'USD';

    // Revenue Split: 90% Consultant / 10% Platform
    const platformFeeRate = 0.10;
    const platformFeeAmount = Number((grossAmount * platformFeeRate).toFixed(2));
    const consultantEarnings = Number((grossAmount - platformFeeAmount).toFixed(2));

    // Create or retrieve enrollment
    let enrollment = await this.prisma.courseEnrollment.findUnique({
      where: {
        courseId_userId: {
          courseId,
          userId,
        },
      },
    });

    if (!enrollment) {
      enrollment = await this.prisma.courseEnrollment.create({
        data: {
          courseId,
          userId,
          pricePaid: grossAmount,
          currency,
          paymentProvider: 'STRIPE',
          transactionId,
          progressPercent: 0,
          completedLessonIds: [],
        },
      });
    }

    // Audit CoursePayment record
    const existingPayment = await this.prisma.coursePayment.findUnique({
      where: { transactionId },
    });

    if (!existingPayment) {
      await this.prisma.coursePayment.create({
        data: {
          courseId,
          buyerId: userId,
          consultantId: course.consultantId,
          grossAmount,
          platformFeeRate,
          platformFeeAmount,
          consultantEarnings,
          currency,
          paymentProvider: 'STRIPE',
          transactionId,
          status: 'PAID',
        },
      });
      this.logger.log(
        `Recorded course purchase: course ${course.id}, buyer ${userId}, net consultant earnings $${consultantEarnings}, fee $${platformFeeAmount}`,
      );
    }

    return enrollment;
  }

  // ==========================================
  // 5. STUDENT: MY ENROLLED COURSES & CLASSROOM
  // ==========================================
  async getStudentEnrolledCourses(userId: string) {
    const enrollments = await this.prisma.courseEnrollment.findMany({
      where: { userId },
      orderBy: { enrolledAt: 'desc' },
      include: {
        course: {
          include: {
            consultant: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                image: true,
                consultantProfile: {
                  select: { headline: true, specialization: true },
                },
              },
            },
            _count: {
              select: { lessons: true },
            },
          },
        },
      },
    });

    return enrollments.map((e) => ({
      enrollmentId: e.id,
      progressPercent: e.progressPercent,
      completedLessonsCount: e.completedLessonIds.length,
      totalLessonsCount: e.course._count.lessons,
      enrolledAt: e.enrolledAt,
      course: {
        id: e.course.id,
        title: e.course.title,
        slug: e.course.slug,
        tagline: e.course.tagline,
        thumbnailUrl: e.course.thumbnailUrl,
        category: e.course.category,
        level: e.course.level,
        totalDurationMinutes: e.course.totalDurationMinutes,
        consultantName: `${e.course.consultant.firstName || ''} ${e.course.consultant.lastName || ''}`.trim() || 'Advisor',
        consultantImage: e.course.consultant.image,
        consultantHeadline: e.course.consultant.consultantProfile?.headline || '',
      },
    }));
  }

  async getStudentClassroom(slug: string, userId: string) {
    const course = await this.prisma.course.findUnique({
      where: { slug },
      include: {
        consultant: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            image: true,
            consultantProfile: {
              select: { headline: true, specialization: true },
            },
          },
        },
        lessons: {
          where: { isPublished: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!course) {
      throw new NotFoundException(`Course "${slug}" not found.`);
    }

    // User must be enrolled, creator, or admin
    let enrollment = await this.prisma.courseEnrollment.findUnique({
      where: {
        courseId_userId: {
          courseId: course.id,
          userId,
        },
      },
    });

    const isCreator = course.consultantId === userId;

    if (!enrollment && !isCreator) {
      throw new ForbiddenException('You must be enrolled in this course to access the classroom.');
    }

    return {
      course: {
        id: course.id,
        title: course.title,
        slug: course.slug,
        tagline: course.tagline,
        description: course.description,
        thumbnailUrl: course.thumbnailUrl,
        category: course.category,
        level: course.level,
        totalDurationMinutes: course.totalDurationMinutes,
        consultant: {
          name: `${course.consultant.firstName || ''} ${course.consultant.lastName || ''}`.trim() || 'Advisor',
          image: course.consultant.image,
          headline: course.consultant.consultantProfile?.headline || '',
        },
      },
      enrollment: enrollment
        ? {
            id: enrollment.id,
            progressPercent: enrollment.progressPercent,
            completedLessonIds: enrollment.completedLessonIds,
            enrolledAt: enrollment.enrolledAt,
          }
        : {
            id: 'creator-preview',
            progressPercent: 100,
            completedLessonIds: [],
            enrolledAt: new Date(),
          },
      lessons: course.lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        slug: lesson.slug,
        description: lesson.description,
        sortOrder: lesson.sortOrder,
        videoProvider: lesson.videoProvider,
        videoUrl: lesson.videoUrl,
        durationMinutes: lesson.durationMinutes,
        isPreview: lesson.isPreview,
        resources: lesson.resources,
        isCompleted: enrollment ? enrollment.completedLessonIds.includes(lesson.id) : false,
      })),
    };
  }

  async toggleLessonCompletion(courseId: string, lessonId: string, userId: string) {
    const enrollment = await this.prisma.courseEnrollment.findUnique({
      where: {
        courseId_userId: {
          courseId,
          userId,
        },
      },
      include: {
        course: {
          include: {
            lessons: { where: { isPublished: true }, select: { id: true } },
          },
        },
      },
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment record not found.');
    }

    let completedIds = [...enrollment.completedLessonIds];
    const index = completedIds.indexOf(lessonId);

    if (index > -1) {
      completedIds.splice(index, 1);
    } else {
      completedIds.push(lessonId);
    }

    const totalLessons = enrollment.course.lessons.length || 1;
    const progressPercent = Math.min(100, Math.round((completedIds.length / totalLessons) * 100));

    const updated = await this.prisma.courseEnrollment.update({
      where: { id: enrollment.id },
      data: {
        completedLessonIds: completedIds,
        progressPercent,
      },
    });

    return {
      progressPercent: updated.progressPercent,
      completedLessonIds: updated.completedLessonIds,
      isCompleted: completedIds.includes(lessonId),
    };
  }

  // ==========================================
  // 6. CONSULTANT CREATOR STUDIO (KYC GATED)
  // ==========================================
  private async ensureConsultantVerified(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { consultantProfile: true },
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    if (user.role === UserRole.ADMIN || user.role === UserRole.SUB_ADMIN) {
      return user; // Admins can manage courses
    }

    if (user.role !== UserRole.CONSULTANT) {
      throw new ForbiddenException('Only registered Consultants can create and manage courses.');
    }

    if (user.consultantProfile?.verificationStatus !== 'VERIFIED') {
      throw new ForbiddenException(
        'KYC Verification Required: Your consultant KYC application must be approved by an Admin before you can create courses and withdraw earnings.',
      );
    }

    return user;
  }

  async getConsultantCourses(consultantId: string) {
    const courses = await this.prisma.course.findMany({
      where: { consultantId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            lessons: true,
            enrollments: true,
          },
        },
        payments: {
          select: {
            consultantEarnings: true,
          },
        },
      },
    });

    return courses.map((c) => {
      const totalEarnings = c.payments.reduce(
        (sum, p) => sum + Number(p.consultantEarnings),
        0,
      );

      return {
        id: c.id,
        title: c.title,
        slug: c.slug,
        tagline: c.tagline,
        thumbnailUrl: c.thumbnailUrl,
        category: c.category,
        level: c.level,
        price: Number(c.price),
        currency: c.currency,
        status: c.status,
        isFeatured: c.isFeatured,
        totalDurationMinutes: c.totalDurationMinutes,
        lessonsCount: c._count.lessons,
        enrollmentsCount: c._count.enrollments,
        totalEarnings,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      };
    });
  }

  async getConsultantCourseById(courseId: string, consultantId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: {
        lessons: {
          orderBy: { sortOrder: 'asc' },
        },
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found.');
    }

    if (course.consultantId !== consultantId) {
      const user = await this.prisma.user.findUnique({ where: { id: consultantId } });
      if (user?.role !== UserRole.ADMIN && user?.role !== UserRole.SUB_ADMIN) {
        throw new ForbiddenException('You do not have permission to view this course.');
      }
    }

    return {
      ...course,
      price: Number(course.price),
      enrollmentsCount: course._count.enrollments,
    };
  }

  async createCourse(consultantId: string, dto: CreateCourseDto) {
    await this.ensureConsultantVerified(consultantId);

    const baseSlug = this.slugify(dto.title);
    let slug = baseSlug;
    let counter = 1;

    while (await this.prisma.course.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const course = await this.prisma.course.create({
      data: {
        consultantId,
        title: dto.title.trim(),
        slug,
        tagline: dto.tagline?.trim(),
        description: dto.description?.trim(),
        thumbnailUrl: dto.thumbnailUrl?.trim(),
        category: dto.category?.trim() || 'General',
        level: dto.level || CourseLevel.ALL_LEVELS,
        price: dto.price !== undefined ? Number(dto.price) : 0,
        currency: dto.currency || 'USD',
        status: dto.status || CourseStatus.DRAFT,
      },
    });

    return course;
  }

  async updateCourse(courseId: string, consultantId: string, dto: UpdateCourseDto) {
    await this.ensureConsultantVerified(consultantId);

    const course = await this.prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      throw new NotFoundException('Course not found.');
    }

    if (course.consultantId !== consultantId) {
      const user = await this.prisma.user.findUnique({ where: { id: consultantId } });
      if (user?.role !== UserRole.ADMIN && user?.role !== UserRole.SUB_ADMIN) {
        throw new ForbiddenException('You do not have permission to update this course.');
      }
    }

    const data: any = {};
    if (dto.title !== undefined) data.title = dto.title.trim();
    if (dto.tagline !== undefined) data.tagline = dto.tagline.trim();
    if (dto.description !== undefined) data.description = dto.description.trim();
    if (dto.thumbnailUrl !== undefined) data.thumbnailUrl = dto.thumbnailUrl.trim();
    if (dto.category !== undefined) data.category = dto.category.trim();
    if (dto.level !== undefined) data.level = dto.level;
    if (dto.price !== undefined) data.price = Number(dto.price);
    if (dto.currency !== undefined) data.currency = dto.currency;
    if (dto.status !== undefined) data.status = dto.status;
    if (dto.isFeatured !== undefined) data.isFeatured = dto.isFeatured;

    return this.prisma.course.update({
      where: { id: courseId },
      data,
    });
  }

  async deleteCourse(courseId: string, consultantId: string) {
    await this.ensureConsultantVerified(consultantId);

    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: { _count: { select: { enrollments: true } } },
    });

    if (!course) {
      throw new NotFoundException('Course not found.');
    }

    if (course.consultantId !== consultantId) {
      const user = await this.prisma.user.findUnique({ where: { id: consultantId } });
      if (user?.role !== UserRole.ADMIN && user?.role !== UserRole.SUB_ADMIN) {
        throw new ForbiddenException('You do not have permission to delete this course.');
      }
    }

    // If students have already enrolled, archive instead of deleting permanently
    if (course._count.enrollments > 0) {
      return this.prisma.course.update({
        where: { id: courseId },
        data: { status: CourseStatus.ARCHIVED },
      });
    }

    return this.prisma.course.delete({
      where: { id: courseId },
    });
  }

  // ==========================================
  // 7. LESSON MANAGEMENT
  // ==========================================
  async addLesson(courseId: string, consultantId: string, dto: CreateLessonDto) {
    await this.ensureConsultantVerified(consultantId);

    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: { lessons: { select: { sortOrder: true } } },
    });

    if (!course) {
      throw new NotFoundException('Course not found.');
    }

    if (course.consultantId !== consultantId) {
      const user = await this.prisma.user.findUnique({ where: { id: consultantId } });
      if (user?.role !== UserRole.ADMIN && user?.role !== UserRole.SUB_ADMIN) {
        throw new ForbiddenException('Access denied.');
      }
    }

    const sortOrder =
      dto.sortOrder !== undefined
        ? dto.sortOrder
        : (course.lessons.length > 0 ? Math.max(...course.lessons.map((l) => l.sortOrder)) + 1 : 1);

    const slug = `${this.slugify(dto.title)}-${Date.now().toString(36)}`;

    const lesson = await this.prisma.courseLesson.create({
      data: {
        courseId,
        title: dto.title.trim(),
        slug,
        description: dto.description?.trim(),
        sortOrder,
        videoProvider: dto.videoProvider || 'HTML5',
        videoUrl: dto.videoUrl?.trim(),
        durationMinutes: dto.durationMinutes || 0,
        isPreview: dto.isPreview || false,
        isPublished: dto.isPublished !== undefined ? dto.isPublished : true,
        resources: dto.resources || [],
      },
    });

    await this.recalculateCourseDuration(courseId);

    return lesson;
  }

  async updateLesson(
    courseId: string,
    lessonId: string,
    consultantId: string,
    dto: UpdateLessonDto,
  ) {
    await this.ensureConsultantVerified(consultantId);

    const lesson = await this.prisma.courseLesson.findUnique({
      where: { id: lessonId },
      include: { course: true },
    });

    if (!lesson || lesson.courseId !== courseId) {
      throw new NotFoundException('Lesson not found.');
    }

    if (lesson.course.consultantId !== consultantId) {
      const user = await this.prisma.user.findUnique({ where: { id: consultantId } });
      if (user?.role !== UserRole.ADMIN && user?.role !== UserRole.SUB_ADMIN) {
        throw new ForbiddenException('Access denied.');
      }
    }

    const data: any = {};
    if (dto.title !== undefined) data.title = dto.title.trim();
    if (dto.description !== undefined) data.description = dto.description.trim();
    if (dto.sortOrder !== undefined) data.sortOrder = dto.sortOrder;
    if (dto.videoProvider !== undefined) data.videoProvider = dto.videoProvider;
    if (dto.videoUrl !== undefined) data.videoUrl = dto.videoUrl.trim();
    if (dto.durationMinutes !== undefined) data.durationMinutes = dto.durationMinutes;
    if (dto.isPreview !== undefined) data.isPreview = dto.isPreview;
    if (dto.isPublished !== undefined) data.isPublished = dto.isPublished;
    if (dto.resources !== undefined) data.resources = dto.resources;

    const updated = await this.prisma.courseLesson.update({
      where: { id: lessonId },
      data,
    });

    await this.recalculateCourseDuration(courseId);

    return updated;
  }

  async deleteLesson(courseId: string, lessonId: string, consultantId: string) {
    await this.ensureConsultantVerified(consultantId);

    const lesson = await this.prisma.courseLesson.findUnique({
      where: { id: lessonId },
      include: { course: true },
    });

    if (!lesson || lesson.courseId !== courseId) {
      throw new NotFoundException('Lesson not found.');
    }

    if (lesson.course.consultantId !== consultantId) {
      const user = await this.prisma.user.findUnique({ where: { id: consultantId } });
      if (user?.role !== UserRole.ADMIN && user?.role !== UserRole.SUB_ADMIN) {
        throw new ForbiddenException('Access denied.');
      }
    }

    await this.prisma.courseLesson.delete({ where: { id: lessonId } });
    await this.recalculateCourseDuration(courseId);

    return { message: 'Lesson deleted successfully.' };
  }

  private async recalculateCourseDuration(courseId: string) {
    const lessons = await this.prisma.courseLesson.findMany({
      where: { courseId, isPublished: true },
      select: { durationMinutes: true },
    });

    const totalDurationMinutes = lessons.reduce(
      (sum, l) => sum + (l.durationMinutes || 0),
      0,
    );

    await this.prisma.course.update({
      where: { id: courseId },
      data: { totalDurationMinutes },
    });
  }

  // ==========================================
  // 8. CONSULTANT EARNINGS & WITHDRAWAL REQUESTS
  // ==========================================
  async getConsultantEarnings(consultantId: string) {
    await this.ensureConsultantVerified(consultantId);

    const [payments, payouts] = await Promise.all([
      this.prisma.coursePayment.findMany({
        where: { consultantId, status: 'PAID' },
        orderBy: { createdAt: 'desc' },
        include: {
          course: { select: { title: true, slug: true } },
          buyer: {
            select: { firstName: true, lastName: true, email: true },
          },
        },
      }),
      this.prisma.consultantPayout.findMany({
        where: { consultantId },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const totalGrossSales = payments.reduce(
      (sum, p) => sum + Number(p.grossAmount),
      0,
    );
    const platformFees = payments.reduce(
      (sum, p) => sum + Number(p.platformFeeAmount),
      0,
    );
    const netEarnings = payments.reduce(
      (sum, p) => sum + Number(p.consultantEarnings),
      0,
    );

    const totalPaidOut = payouts
      .filter((p) => p.status === PayoutStatus.PAID || p.status === PayoutStatus.APPROVED)
      .reduce((sum, p) => sum + Number(p.amount), 0);

    const pendingPayout = payouts
      .filter((p) => p.status === PayoutStatus.PENDING)
      .reduce((sum, p) => sum + Number(p.amount), 0);

    const availableBalance = Math.max(0, netEarnings - (totalPaidOut + pendingPayout));

    return {
      stats: {
        totalGrossSales: Number(totalGrossSales.toFixed(2)),
        platformFees: Number(platformFees.toFixed(2)), // 10% platform fee
        netEarnings: Number(netEarnings.toFixed(2)),   // 90% net
        totalPaidOut: Number(totalPaidOut.toFixed(2)),
        pendingPayout: Number(pendingPayout.toFixed(2)),
        availableBalance: Number(availableBalance.toFixed(2)),
        payoutRate: '90%',
        platformFeeRate: '10%',
      },
      recentSales: payments.slice(0, 15).map((p) => ({
        id: p.id,
        courseTitle: p.course.title,
        courseSlug: p.course.slug,
        buyerName: `${p.buyer.firstName || ''} ${p.buyer.lastName || ''}`.trim() || p.buyer.email,
        grossAmount: Number(p.grossAmount),
        platformFee: Number(p.platformFeeAmount),
        consultantEarnings: Number(p.consultantEarnings),
        currency: p.currency,
        createdAt: p.createdAt,
      })),
      payoutRequests: payouts.map((p) => ({
        id: p.id,
        amount: Number(p.amount),
        currency: p.currency,
        status: p.status,
        payoutMethod: p.payoutMethod,
        accountDetails: p.accountDetails,
        adminNotes: p.adminNotes,
        processedAt: p.processedAt,
        createdAt: p.createdAt,
      })),
    };
  }

  async requestWithdrawal(consultantId: string, dto: RequestPayoutDto) {
    await this.ensureConsultantVerified(consultantId);

    const earnings = await this.getConsultantEarnings(consultantId);

    if (dto.amount > earnings.stats.availableBalance) {
      throw new BadRequestException(
        `Withdrawal amount ($${dto.amount}) exceeds your available balance ($${earnings.stats.availableBalance}).`,
      );
    }

    if (dto.amount < 10) {
      throw new BadRequestException('Minimum withdrawal amount is $10.00.');
    }

    const payout = await this.prisma.consultantPayout.create({
      data: {
        consultantId,
        amount: dto.amount,
        currency: 'USD',
        status: PayoutStatus.PENDING,
        payoutMethod: dto.payoutMethod || 'BANK_TRANSFER',
        accountDetails: dto.accountDetails || {},
      },
    });

    return payout;
  }

  // ==========================================
  // 9. ADMIN: ALL COURSES & PAYOUT REVIEW
  // ==========================================
  async getAdminCourses() {
    const courses = await this.prisma.course.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        consultant: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            image: true,
            consultantProfile: {
              select: { headline: true, verificationStatus: true },
            },
          },
        },
        _count: {
          select: {
            lessons: true,
            enrollments: true,
            payments: true,
          },
        },
        payments: {
          select: {
            grossAmount: true,
            platformFeeAmount: true,
          },
        },
      },
    });

    return courses.map((c) => {
      const grossSales = c.payments.reduce((sum, p) => sum + Number(p.grossAmount), 0);
      const platformRevenue = c.payments.reduce(
        (sum, p) => sum + Number(p.platformFeeAmount),
        0,
      );

      return {
        id: c.id,
        title: c.title,
        slug: c.slug,
        price: Number(c.price),
        currency: c.currency,
        status: c.status,
        isFeatured: c.isFeatured,
        lessonsCount: c._count.lessons,
        enrollmentsCount: c._count.enrollments,
        grossSales,
        platformRevenue,
        createdAt: c.createdAt,
        consultant: {
          id: c.consultant.id,
          name: `${c.consultant.firstName || ''} ${c.consultant.lastName || ''}`.trim() || c.consultant.email,
          email: c.consultant.email,
          image: c.consultant.image,
          isVerified: c.consultant.consultantProfile?.verificationStatus === 'VERIFIED',
        },
      };
    });
  }

  async updateCourseStatusByAdmin(
    courseId: string,
    status?: CourseStatus,
    isFeatured?: boolean,
  ) {
    const course = await this.prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      throw new NotFoundException('Course not found.');
    }

    const data: any = {};
    if (status !== undefined) data.status = status;
    if (isFeatured !== undefined) data.isFeatured = isFeatured;

    return this.prisma.course.update({
      where: { id: courseId },
      data,
    });
  }

  async getAdminPayouts(status?: PayoutStatus) {
    const where: any = {};
    if (status) {
      where.status = status;
    }

    const payouts = await this.prisma.consultantPayout.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        consultant: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            image: true,
            consultantProfile: {
              select: {
                headline: true,
                specialization: true,
                verificationStatus: true,
              },
            },
          },
        },
      },
    });

    return payouts.map((p) => ({
      id: p.id,
      amount: Number(p.amount),
      currency: p.currency,
      status: p.status,
      payoutMethod: p.payoutMethod,
      accountDetails: p.accountDetails,
      adminNotes: p.adminNotes,
      processedBy: p.processedBy,
      processedAt: p.processedAt,
      createdAt: p.createdAt,
      consultant: {
        id: p.consultant.id,
        name: `${p.consultant.firstName || ''} ${p.consultant.lastName || ''}`.trim() || p.consultant.email,
        email: p.consultant.email,
        phone: p.consultant.phone,
        image: p.consultant.image,
        headline: p.consultant.consultantProfile?.headline || '',
      },
    }));
  }

  async updatePayoutStatus(
    payoutId: string,
    adminUserId: string,
    dto: UpdatePayoutStatusDto,
  ) {
    const payout = await this.prisma.consultantPayout.findUnique({
      where: { id: payoutId },
    });

    if (!payout) {
      throw new NotFoundException('Payout request not found.');
    }

    const updated = await this.prisma.consultantPayout.update({
      where: { id: payoutId },
      data: {
        status: dto.status,
        adminNotes: dto.adminNotes?.trim() || payout.adminNotes,
        processedBy: adminUserId,
        processedAt: new Date(),
      },
    });

    this.logger.log(
      `Payout ${payoutId} updated to status "${dto.status}" by admin ${adminUserId}`,
    );

    return updated;
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
