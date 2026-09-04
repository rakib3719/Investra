import { Test, type TestingModule } from "@nestjs/testing";
import { jest } from "@jest/globals";
import { BadRequestException, ForbiddenException, NotFoundException } from "@nestjs/common";
import { CampaignStatus, BusinessStage, RiskLevel } from "@prisma/client";
import { CampaignsService } from "./campaigns.service";
import { PrismaService } from "../../prisma/prisma.service";

describe("CampaignsService", () => {
  let service: CampaignsService;

  const mockPrismaService = {
    business: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    campaignMilestone: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    category: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CampaignsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CampaignsService>(CampaignsService);
  });

  describe("createCampaign", () => {
    it("should create a campaign in DRAFT status with a slug derived from title", async () => {
      mockPrismaService.business.findUnique.mockResolvedValue(null);
      const createdCampaign = {
        id: "c1",
        title: "SolarGrid Pro",
        slug: "solargrid-pro",
        status: CampaignStatus.DRAFT,
      };
      mockPrismaService.business.create.mockResolvedValue(createdCampaign);

      const result = await service.createCampaign("entrepreneur-123", {
        title: "SolarGrid Pro",
        pitchText: "Next-gen solar infrastructure",
        categoryId: "11111111-1111-1111-1111-111111111111",
        targetAmount: 500000,
        minInvestment: 1000,
        stage: BusinessStage.EARLY_STAGE,
        riskLevel: RiskLevel.MEDIUM,
      });

      expect(result).toEqual(createdCampaign);
      expect(mockPrismaService.business.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            entrepreneurId: "entrepreneur-123",
            title: "SolarGrid Pro",
            slug: "solargrid-pro",
            status: CampaignStatus.DRAFT,
          }),
        }),
      );
    });
  });

  describe("updateCampaign", () => {
    it("should allow the owner to update a draft campaign", async () => {
      mockPrismaService.business.findUnique.mockResolvedValue({
        id: "c1",
        entrepreneurId: "entrepreneur-123",
        status: CampaignStatus.DRAFT,
      });
      mockPrismaService.business.update.mockResolvedValue({
        id: "c1",
        title: "Updated Title",
      });

      const result = await service.updateCampaign("entrepreneur-123", "c1", {
        title: "Updated Title",
      });

      expect(result).toEqual({ id: "c1", title: "Updated Title" });
      expect(mockPrismaService.business.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "c1" },
          data: expect.objectContaining({ title: "Updated Title" }),
        }),
      );
    });

    it("should throw NotFoundException if campaign does not exist", async () => {
      mockPrismaService.business.findUnique.mockResolvedValue(null);

      await expect(
        service.updateCampaign("user-1", "non-existent", { title: "Test" }),
      ).rejects.toThrow(NotFoundException);
    });

    it("should throw ForbiddenException if a non-owner updates", async () => {
      mockPrismaService.business.findUnique.mockResolvedValue({
        id: "c1",
        entrepreneurId: "other-user",
        status: CampaignStatus.DRAFT,
      });

      await expect(
        service.updateCampaign("intruder", "c1", { title: "Hacked" }),
      ).rejects.toThrow(ForbiddenException);
    });

    it("should throw BadRequestException if entrepreneur tries to update an ACTIVE campaign", async () => {
      mockPrismaService.business.findUnique.mockResolvedValue({
        id: "c1",
        entrepreneurId: "entrepreneur-123",
        status: CampaignStatus.ACTIVE,
      });

      await expect(
        service.updateCampaign("entrepreneur-123", "c1", { title: "New" }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe("submitForReview", () => {
    it("should transition DRAFT status to UNDER_REVIEW", async () => {
      mockPrismaService.business.findUnique.mockResolvedValue({
        id: "c1",
        entrepreneurId: "entrepreneur-123",
        status: CampaignStatus.DRAFT,
      });
      mockPrismaService.business.update.mockResolvedValue({
        id: "c1",
        status: CampaignStatus.UNDER_REVIEW,
      });

      const result = await service.submitForReview("entrepreneur-123", "c1");
      expect(result.status).toBe(CampaignStatus.UNDER_REVIEW);
      expect(mockPrismaService.business.update).toHaveBeenCalledWith({
        where: { id: "c1" },
        data: {
          status: CampaignStatus.UNDER_REVIEW,
          rejectionReason: null,
        },
      });
    });

    it("should throw ForbiddenException if non-owner submits for review", async () => {
      mockPrismaService.business.findUnique.mockResolvedValue({
        id: "c1",
        entrepreneurId: "owner",
        status: CampaignStatus.DRAFT,
      });

      await expect(service.submitForReview("imposter", "c1")).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe("updateCampaignStatus (Admin)", () => {
    it("should allow admin to approve campaign to ACTIVE", async () => {
      mockPrismaService.business.findUnique.mockResolvedValue({
        id: "c1",
        status: CampaignStatus.UNDER_REVIEW,
      });
      mockPrismaService.business.update.mockResolvedValue({
        id: "c1",
        status: CampaignStatus.ACTIVE,
      });

      const result = await service.updateCampaignStatus("c1", {
        status: CampaignStatus.ACTIVE,
      });

      expect(result.status).toBe(CampaignStatus.ACTIVE);
    });
  });

  describe("getPublicCampaigns", () => {
    it("should return paginated active campaigns with meta", async () => {
      mockPrismaService.business.count.mockResolvedValue(1);
      mockPrismaService.business.findMany.mockResolvedValue([
        { id: "c1", title: "Apex FinTech", status: CampaignStatus.ACTIVE },
      ]);

      const result = await service.getPublicCampaigns({
        page: 1,
        limit: 10,
        search: "Apex",
      });

      expect(result.items).toHaveLength(1);
      expect(result.meta.total).toBe(1);
      expect(result.meta.totalPages).toBe(1);
      expect(mockPrismaService.business.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status: CampaignStatus.ACTIVE,
          }),
        }),
      );
    });
  });

  describe("getCampaignBySlug", () => {
    it("should return campaign if ACTIVE", async () => {
      mockPrismaService.business.findFirst.mockResolvedValue({
        id: "c1",
        slug: "solargrid",
        status: CampaignStatus.ACTIVE,
      });

      const result = await service.getCampaignBySlug("solargrid");
      expect(result.slug).toBe("solargrid");
    });

    it("should throw NotFoundException for DRAFT campaign when unauthenticated", async () => {
      mockPrismaService.business.findFirst.mockResolvedValue({
        id: "c1",
        slug: "draft-deal",
        entrepreneurId: "e1",
        status: CampaignStatus.DRAFT,
      });

      await expect(service.getCampaignBySlug("draft-deal")).rejects.toThrow(
        NotFoundException,
      );
    });

    it("should return DRAFT campaign when requested by owner entrepreneur", async () => {
      mockPrismaService.business.findFirst.mockResolvedValue({
        id: "c1",
        slug: "draft-deal",
        entrepreneurId: "e1",
        status: CampaignStatus.DRAFT,
      });

      const result = await service.getCampaignBySlug("draft-deal", "e1", "ENTREPRENEUR");
      expect(result.id).toBe("c1");
    });
  });

  describe("addMilestone", () => {
    it("should add milestone when requested by campaign owner", async () => {
      mockPrismaService.business.findUnique.mockResolvedValue({
        id: "c1",
        entrepreneurId: "e1",
      });
      mockPrismaService.campaignMilestone.create.mockResolvedValue({
        id: "m1",
        title: "Beta Launch",
      });

      const result = await service.addMilestone("e1", "c1", {
        title: "Beta Launch",
      });

      expect(result.title).toBe("Beta Launch");
      expect(mockPrismaService.campaignMilestone.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            businessId: "c1",
            title: "Beta Launch",
          }),
        }),
      );
    });

    it("should throw ForbiddenException if user is not campaign owner", async () => {
      mockPrismaService.business.findUnique.mockResolvedValue({
        id: "c1",
        entrepreneurId: "e1",
      });

      await expect(
        service.addMilestone("e2", "c1", { title: "Milestone" }),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
