-- CreateEnum
CREATE TYPE "campaign_status" AS ENUM ('DRAFT', 'UNDER_REVIEW', 'ACTIVE', 'REJECTED', 'FUNDED', 'CLOSED');

-- CreateEnum
CREATE TYPE "risk_level" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateTable
CREATE TABLE "businesses" (
    "id" UUID NOT NULL,
    "entrepreneur_id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "tagline" VARCHAR(500),
    "pitch_text" TEXT NOT NULL,
    "category_id" UUID NOT NULL,
    "stage" "business_stage" NOT NULL DEFAULT 'IDEA',
    "target_amount" DECIMAL(14,2) NOT NULL,
    "raised_amount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "min_investment" DECIMAL(14,2) NOT NULL,
    "projected_irr" DECIMAL(5,2),
    "valuation" DECIMAL(14,2),
    "risk_level" "risk_level" NOT NULL DEFAULT 'MEDIUM',
    "esg_rating" VARCHAR(10),
    "impact_metric" VARCHAR(255),
    "banner_image" TEXT,
    "gallery" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" "campaign_status" NOT NULL DEFAULT 'DRAFT',
    "rejection_reason" TEXT,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "businesses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_milestones" (
    "id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "target_date" DATE,
    "funding_needed" DECIMAL(14,2),
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "completion_proof" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "campaign_milestones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pitch_decks" (
    "id" UUID NOT NULL,
    "business_id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "file_url" TEXT NOT NULL,
    "file_size" INTEGER,
    "version" INTEGER NOT NULL DEFAULT 1,
    "is_confidential" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "pitch_decks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "businesses_slug_key" ON "businesses"("slug");

-- CreateIndex
CREATE INDEX "businesses_category_id_status_idx" ON "businesses"("category_id", "status");

-- CreateIndex
CREATE INDEX "businesses_entrepreneur_id_idx" ON "businesses"("entrepreneur_id");

-- CreateIndex
CREATE INDEX "businesses_status_idx" ON "businesses"("status");

-- CreateIndex
CREATE INDEX "campaign_milestones_business_id_idx" ON "campaign_milestones"("business_id");

-- CreateIndex
CREATE INDEX "pitch_decks_business_id_idx" ON "pitch_decks"("business_id");

-- AddForeignKey
ALTER TABLE "businesses" ADD CONSTRAINT "businesses_entrepreneur_id_fkey" FOREIGN KEY ("entrepreneur_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "businesses" ADD CONSTRAINT "businesses_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_milestones" ADD CONSTRAINT "campaign_milestones_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pitch_decks" ADD CONSTRAINT "pitch_decks_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
