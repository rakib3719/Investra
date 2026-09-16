import { Test, type TestingModule } from "@nestjs/testing";
import { jest } from "@jest/globals";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { AccountStatus, CampaignStatus, UserRole } from "@prisma/client";
import { AdminUsersService } from "./admin-users.service";
import { PrismaService } from "../../prisma/prisma.service";

describe("AdminUsersService", () => {
  let service: AdminUsersService;

  const mockPrismaService = {
    user: {
      count: jest.fn<any>(),
      findMany: jest.fn<any>(),
      findUnique: jest.fn<any>(),
      update: jest.fn<any>(),
    },
    refreshSession: {
      deleteMany: jest.fn<any>(),
    },
    business: {
      count: jest.fn<any>(),
      aggregate: jest.fn<any>(),
    },
    $transaction: jest.fn<any>(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminUsersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<AdminUsersService>(AdminUsersService);
  });

  describe("getUsers", () => {
    it("should return paginated users with metadata", async () => {
      mockPrismaService.user.count.mockResolvedValue(1);
      const mockUsers = [
        {
          id: "u-1",
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          role: UserRole.INVESTOR,
          accountStatus: AccountStatus.ACTIVE,
        },
      ];
      mockPrismaService.user.findMany.mockResolvedValue(mockUsers);

      const result = await service.getUsers({
        page: 1,
        limit: 10,
        role: UserRole.INVESTOR,
        status: AccountStatus.ACTIVE,
        search: "john",
      });

      expect(mockPrismaService.user.count).toHaveBeenCalled();
      expect(mockPrismaService.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 0,
          take: 10,
          where: expect.objectContaining({
            role: UserRole.INVESTOR,
            accountStatus: AccountStatus.ACTIVE,
          }),
        }),
      );
      expect(result).toEqual({
        items: mockUsers,
        meta: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      });
    });
  });

  describe("getUserById", () => {
    it("should return safe user profile without password", async () => {
      const mockUser = {
        id: "u-1",
        firstName: "Alice",
        lastName: "Smith",
        email: "alice@example.com",
        password: "hashedpassword123",
        role: UserRole.ENTREPRENEUR,
        entrepreneurProfile: { companyName: "TechCorp" },
      };
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.getUserById("u-1");
      expect(result).not.toHaveProperty("password");
      expect(result.id).toBe("u-1");
      expect(result.email).toBe("alice@example.com");
    });

    it("should throw NotFoundException if user does not exist", async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.getUserById("unknown-id")).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe("updateUserStatus", () => {
    it("should throw BadRequestException if admin alters their own status", async () => {
      await expect(
        service.updateUserStatus("admin-1", "admin-1", {
          status: AccountStatus.BLOCKED,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it("should throw NotFoundException if target user is not found", async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(
        service.updateUserStatus("admin-1", "target-404", {
          status: AccountStatus.BLOCKED,
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it("should delete sessions and update status via transaction when BLOCKED", async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: "user-2",
        accountStatus: AccountStatus.ACTIVE,
      });
      mockPrismaService.$transaction.mockResolvedValue([
        { id: "user-2", accountStatus: AccountStatus.BLOCKED },
        { count: 3 },
      ]);

      const result = await service.updateUserStatus("admin-1", "user-2", {
        status: AccountStatus.BLOCKED,
      });

      expect(mockPrismaService.$transaction).toHaveBeenCalled();
      expect(result.success).toBe(true);
      expect(result.newStatus).toBe(AccountStatus.BLOCKED);
    });

    it("should update user status without transaction when ACTIVE", async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: "user-2",
        accountStatus: AccountStatus.BLOCKED,
      });
      mockPrismaService.user.update.mockResolvedValue({
        id: "user-2",
        accountStatus: AccountStatus.ACTIVE,
      });

      const result = await service.updateUserStatus("admin-1", "user-2", {
        status: AccountStatus.ACTIVE,
      });

      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: "user-2" },
        data: { accountStatus: AccountStatus.ACTIVE },
      });
      expect(result.success).toBe(true);
      expect(result.newStatus).toBe(AccountStatus.ACTIVE);
    });
  });

  describe("getOverviewStats", () => {
    it("should return aggregated counts for users and campaigns", async () => {
      mockPrismaService.user.count
        .mockResolvedValueOnce(50) // total
        .mockResolvedValueOnce(20) // investors
        .mockResolvedValueOnce(25) // entrepreneurs
        .mockResolvedValueOnce(3) // consultants
        .mockResolvedValueOnce(2); // admins

      mockPrismaService.business.count
        .mockResolvedValueOnce(15) // total campaigns
        .mockResolvedValueOnce(10) // active
        .mockResolvedValueOnce(3); // under review

      mockPrismaService.business.aggregate.mockResolvedValue({
        _sum: {
          targetAmount: 5000000,
          raisedAmount: 1200000,
        },
      });

      const stats = await service.getOverviewStats();

      expect(stats.users.total).toBe(50);
      expect(stats.users.investors).toBe(20);
      expect(stats.users.entrepreneurs).toBe(25);
      expect(stats.campaigns.total).toBe(15);
      expect(stats.campaigns.active).toBe(10);
      expect(stats.campaigns.totalTargetCapital).toBe(5000000);
      expect(stats.campaigns.totalRaisedCapital).toBe(1200000);
    });
  });
});
