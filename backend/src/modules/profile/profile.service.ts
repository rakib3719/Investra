import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

const userProfileSelect = {
  id: true,
  firstName: true,
  lastName: true,
  username: true,
  email: true,
  phone: true,
  image: true,
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
  constructor(private readonly prisma: PrismaService) {}

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
      ...account
    } = user;
    const profile =
      user.role === UserRole.INVESTOR
        ? investorProfile
        : user.role === UserRole.ENTREPRENEUR
          ? entrepreneurProfile
          : consultantProfile;

    return { account, profile };
  }

  async updateMyProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const accountData = this.defined({
      firstName: dto.firstName,
      lastName: dto.lastName,
      phone: dto.phone,
      image: dto.image,
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
