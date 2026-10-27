import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { env } from '../../common/config/env.config';
import { UserRole } from '../../common/enums/user-role.enum';
import { AccountStatus } from '@prisma/client';
import { CreateSubAdminDto } from './dto/create-sub-admin.dto';
import { UpdateSubAdminPermissionsDto } from './dto/update-sub-admin-permissions.dto';

@Injectable()
export class SubAdminService {
  constructor(private readonly prisma: PrismaService) {}

  private async generateUniqueUsername(
    firstName: string,
    lastName: string,
  ): Promise<string> {
    const base = `${firstName.toLowerCase().replace(/[^a-z0-9]/g, '')}${lastName.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
    let candidate = base || 'subadmin';
    let exists = await this.prisma.user.findUnique({ where: { username: candidate } });
    let counter = 1;

    while (exists) {
      candidate = `${base}${counter}`;
      exists = await this.prisma.user.findUnique({ where: { username: candidate } });
      counter++;
    }

    return candidate;
  }

  async createSubAdmin(creatorAdminId: string, dto: CreateSubAdminDto) {
    const normalizedEmail = dto.email.trim().toLowerCase();

    const existingUser = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      throw new ConflictException('A user with this email address already exists');
    }

    if (dto.phone) {
      const existingPhone = await this.prisma.user.findUnique({
        where: { phone: dto.phone.trim() },
      });
      if (existingPhone) {
        throw new ConflictException('A user with this phone number already exists');
      }
    }

    const hashedPassword = await bcrypt.hash(dto.password, env.BCRYPT_ROUNDS);
    const username = await this.generateUniqueUsername(dto.firstName, dto.lastName);

    const newUser = await this.prisma.user.create({
      data: {
        firstName: dto.firstName.trim(),
        lastName: dto.lastName.trim(),
        username,
        email: normalizedEmail,
        phone: dto.phone?.trim() || null,
        password: hashedPassword,
        role: UserRole.SUB_ADMIN,
        accountStatus: AccountStatus.ACTIVE,
        isEmailVerified: true,
        country: 'Bangladesh',
        city: 'Dhaka',
        subAdminProfile: {
          create: {
            permissions: dto.permissions,
            department: dto.department?.trim() || null,
            notes: dto.notes?.trim() || null,
            createdBy: creatorAdminId,
          },
        },
      },
      include: {
        subAdminProfile: true,
      },
    });

    const { password: _, ...safeUser } = newUser;
    return safeUser;
  }

  async listSubAdmins() {
    const subAdmins = await this.prisma.user.findMany({
      where: {
        role: UserRole.SUB_ADMIN,
        deletedAt: null,
      },
      include: {
        subAdminProfile: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return subAdmins.map((admin) => {
      const { password: _, ...safeData } = admin;
      return {
        ...safeData,
        permissions: admin.subAdminProfile?.permissions ?? [],
        department: admin.subAdminProfile?.department ?? null,
        notes: admin.subAdminProfile?.notes ?? null,
      };
    });
  }

  async getSubAdminById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { subAdminProfile: true },
    });

    if (!user || user.role !== UserRole.SUB_ADMIN) {
      throw new NotFoundException('Sub-admin not found');
    }

    const { password: _, ...safeUser } = user;
    return {
      ...safeUser,
      permissions: user.subAdminProfile?.permissions ?? [],
      department: user.subAdminProfile?.department ?? null,
      notes: user.subAdminProfile?.notes ?? null,
    };
  }

  async updateSubAdminPermissions(
    subAdminId: string,
    dto: UpdateSubAdminPermissionsDto,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: subAdminId },
      include: { subAdminProfile: true },
    });

    if (!user || user.role !== UserRole.SUB_ADMIN) {
      throw new NotFoundException('Sub-admin not found');
    }

    // Upsert subAdminProfile and bump tokenVersion to force claim refresh
    const [updatedProfile] = await this.prisma.$transaction([
      this.prisma.subAdminProfile.upsert({
        where: { userId: subAdminId },
        update: {
          permissions: dto.permissions,
          department: dto.department !== undefined ? dto.department?.trim() || null : undefined,
          notes: dto.notes !== undefined ? dto.notes?.trim() || null : undefined,
        },
        create: {
          userId: subAdminId,
          permissions: dto.permissions,
          department: dto.department?.trim() || null,
          notes: dto.notes?.trim() || null,
        },
      }),
      this.prisma.user.update({
        where: { id: subAdminId },
        data: {
          tokenVersion: { increment: 1 },
        },
      }),
    ]);

    return {
      message: 'Sub-admin permissions updated successfully',
      subAdminId,
      profile: updatedProfile,
    };
  }

  async deleteSubAdmin(subAdminId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: subAdminId },
    });

    if (!user || user.role !== UserRole.SUB_ADMIN) {
      throw new NotFoundException('Sub-admin not found');
    }

    try {
      await this.prisma.user.delete({
        where: { id: subAdminId },
      });
    } catch {
      // In case of FK constraints, perform soft-delete/suspension
      await this.prisma.user.update({
        where: { id: subAdminId },
        data: {
          accountStatus: AccountStatus.SUSPENDED,
          deletedAt: new Date(),
        },
      });
    }

    return {
      success: true,
      message: 'Sub-admin removed successfully',
    };
  }
}
