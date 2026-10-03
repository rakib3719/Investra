import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { MediaService } from '../media/media.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

const userProfileSelect = {
  id: true,
  firstName: true,
  lastName: true,
  username: true,
  email: true,
  phone: true,
  image: true,
  avatarMediaId: true,
  avatarMedia: {
    select: {
      id: true,
      key: true,
    },
  },
  coverImage: true,
  coverMediaId: true,
  coverMedia: {
    select: {
      id: true,
      key: true,
    },
  },
  role: true,
  gender: true,
  dateOfBirth: true,
  bio: true,
  country: true,
  city: true,
  professionalType: true,
  website: true,
  isEmailVerified: true,
  accountStatus: true,
  createdAt: true,
  updatedAt: true,
  investorProfile: true,
  entrepreneurProfile: true,
  consultantProfile: true,
} as const;

@Injectable()
export class ProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mediaService: MediaService,
  ) {}

  async getMyProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: userProfileSelect,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const {
      investorProfile,
      entrepreneurProfile,
      consultantProfile,
      avatarMedia,
      coverMedia,
      ...account
    } = user;

    // Derive avatar image URL from Cloudflare R2 if avatarMedia exists
    const resolvedImage = avatarMedia
      ? this.mediaService.derivePublicUrl(avatarMedia.key)
      : account.image;

    // Derive cover image URL from Cloudflare R2 if coverMedia exists
    const resolvedCoverImage = coverMedia
      ? this.mediaService.derivePublicUrl(coverMedia.key)
      : account.coverImage;

    const profile =
      user.role === UserRole.INVESTOR
        ? investorProfile
        : user.role === UserRole.ENTREPRENEUR
          ? entrepreneurProfile
          : user.role === UserRole.CONSULTANT
            ? consultantProfile
            : null;

    return {
      account: {
        ...account,
        image: resolvedImage,
        coverImage: resolvedCoverImage,
      },
      profile,
    };
  }

  async updateMyProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true, avatarMediaId: true, coverMediaId: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Handle avatar media replacement safely within transaction
    if (dto.avatarMediaId && dto.avatarMediaId !== user.avatarMediaId) {
      await this.prisma.$transaction(async (tx) => {
        await this.mediaService.replaceEntityMedia(
          dto.avatarMediaId!,
          user.avatarMediaId,
          tx,
        );
        await tx.user.update({
          where: { id: userId },
          data: { avatarMediaId: dto.avatarMediaId },
        });
      });
    }

    // Handle cover media replacement safely within transaction
    if (dto.coverMediaId && dto.coverMediaId !== user.coverMediaId) {
      await this.prisma.$transaction(async (tx) => {
        await this.mediaService.replaceEntityMedia(
          dto.coverMediaId!,
          user.coverMediaId,
          tx,
        );
        await tx.user.update({
          where: { id: userId },
          data: { coverMediaId: dto.coverMediaId },
        });
      });
    }

    const accountData = this.defined({
      firstName: dto.firstName,
      lastName: dto.lastName,
      phone: dto.phone,
      image: dto.image,
      coverImage: dto.coverImage,
      gender: dto.gender,
      dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
      bio: dto.bio,
      country: dto.country,
      city: dto.city,
      professionalType: dto.professionalType,
      website: dto.website,
    });

    if (Object.keys(accountData).length > 0) {
      await this.prisma.user.update({
        where: { id: userId },
        data: accountData,
      });
    }

    const commonProfileData = this.defined({
      headline: dto.headline,
      companyName: dto.companyName,
      designation: dto.designation,
      yearsOfExperience: dto.yearsOfExperience,
      profileVisibility: dto.profileVisibility,
    });

    if (user.role === UserRole.INVESTOR) {
      await this.prisma.investorProfile.update({
        where: { userId },
        data: {
          ...commonProfileData,
          ...this.defined({
            investmentRangeMin: dto.investmentRangeMin,
            investmentRangeMax: dto.investmentRangeMax,
            preferredCurrency: dto.preferredCurrency,
            businessName: dto.businessName,
            businessIndustry: dto.businessIndustry,
            accreditedInvestor: dto.accreditedInvestor,
            preferredStage: dto.preferredStage,
          }),
        },
      });
    }

    if (user.role === UserRole.ENTREPRENEUR) {
      await this.prisma.entrepreneurProfile.update({
        where: { userId },
        data: {
          ...commonProfileData,
          ...this.defined({
            website: dto.website,
            linkedin: dto.linkedin,
            facebook: dto.facebook,
            twitter: dto.twitter,
          }),
        },
      });
    }

    if (user.role === UserRole.CONSULTANT) {
      await this.prisma.consultantProfile.update({
        where: { userId },
        data: {
          ...commonProfileData,
          ...this.defined({
            specialization: dto.specialization,
            consultantLevel: dto.consultantLevel,
            consultationFee: dto.consultationFee,
            sessionFee: dto.sessionFee,
            workshopFee: dto.workshopFee,
            courseFee: dto.courseFee,
          }),
        },
      });
    }

    return this.getMyProfile(userId);
  }

  private defined(values: Record<string, unknown>) {
    return Object.fromEntries(
      Object.entries(values).filter(([, value]) => value !== undefined),
    );
  }
}
