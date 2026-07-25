-- CreateEnum
CREATE TYPE "user_role" AS ENUM ('INVESTOR', 'ENTREPRENEUR', 'CONSULTANT', 'ADMIN', 'SUB_ADMIN');

-- CreateEnum
CREATE TYPE "account_status" AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED', 'BLOCKED');

-- CreateEnum
CREATE TYPE "gender" AS ENUM ('MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY');

-- CreateEnum
CREATE TYPE "professional_type" AS ENUM ('EMPLOYEE', 'BUSINESS_OWNER', 'FREELANCER', 'SELF_EMPLOYED', 'STUDENT', 'OTHER');

-- CreateEnum
CREATE TYPE "verification_status" AS ENUM ('PENDING', 'UNDER_REVIEW', 'VERIFIED', 'REJECTED');

-- CreateEnum
CREATE TYPE "business_stage" AS ENUM ('IDEA', 'MVP', 'EARLY_STAGE', 'GROWTH', 'SCALING');

-- CreateEnum
CREATE TYPE "consultant_level" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'EXPERT');

-- CreateEnum
CREATE TYPE "social_platform" AS ENUM ('FACEBOOK', 'LINKEDIN', 'TWITTER', 'INSTAGRAM', 'YOUTUBE', 'GITHUB', 'WEBSITE', 'OTHER');

-- CreateEnum
CREATE TYPE "category_status" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "first_name" VARCHAR,
    "last_name" VARCHAR,
    "username" VARCHAR,
    "email" VARCHAR NOT NULL,
    "phone" VARCHAR,
    "password" VARCHAR NOT NULL,
    "image" TEXT,
    "role" "user_role" NOT NULL,
    "gender" "gender",
    "date_of_birth" DATE,
    "bio" TEXT,
    "country" VARCHAR,
    "city" VARCHAR,
    "professional_type" "professional_type",
    "website" TEXT,
    "is_email_verified" BOOLEAN NOT NULL DEFAULT false,
    "is_phone_verified" BOOLEAN NOT NULL DEFAULT false,
    "is_two_factor_enabled" BOOLEAN NOT NULL DEFAULT false,
    "account_status" "account_status" NOT NULL DEFAULT 'PENDING',
    "last_login_at" TIMESTAMP,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,
    "deleted_at" TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investor_profiles" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "headline" VARCHAR,
    "investment_range_min" DECIMAL,
    "investment_range_max" DECIMAL,
    "preferred_currency" VARCHAR,
    "years_of_experience" INTEGER,
    "company_name" VARCHAR,
    "designation" VARCHAR,
    "business_name" VARCHAR,
    "business_industry" VARCHAR,
    "accredited_investor" BOOLEAN,
    "preferred_stage" "business_stage",
    "profile_visibility" BOOLEAN,
    "verification_status" "verification_status" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "investor_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entrepreneur_profiles" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "headline" VARCHAR,
    "company_name" VARCHAR,
    "designation" VARCHAR,
    "years_of_experience" INTEGER,
    "website" TEXT,
    "linkedin" TEXT,
    "facebook" TEXT,
    "twitter" TEXT,
    "verification_status" "verification_status" NOT NULL DEFAULT 'PENDING',
    "profile_visibility" BOOLEAN,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "entrepreneur_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consultant_profiles" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "headline" VARCHAR,
    "specialization" VARCHAR,
    "consultant_level" "consultant_level",
    "years_of_experience" INTEGER,
    "company_name" VARCHAR,
    "designation" VARCHAR,
    "consultation_fee" DECIMAL,
    "session_fee" DECIMAL,
    "workshop_fee" DECIMAL,
    "course_fee" DECIMAL,
    "average_rating" DECIMAL,
    "total_reviews" INTEGER,
    "profile_visibility" BOOLEAN,
    "verification_status" "verification_status" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "consultant_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_social_links" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "platform" "social_platform" NOT NULL,
    "url" TEXT NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_social_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_verifications" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "nid_number" VARCHAR,
    "passport_number" VARCHAR,
    "document_front" TEXT,
    "document_back" TEXT,
    "selfie_image" TEXT,
    "verification_status" "verification_status" NOT NULL DEFAULT 'PENDING',
    "reviewed_by" UUID,
    "reviewed_at" TIMESTAMP,
    "rejection_reason" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "user_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "slug" VARCHAR NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "image" TEXT,
    "color" VARCHAR,
    "sort_order" INTEGER,
    "is_featured" BOOLEAN,
    "status" "category_status" NOT NULL,
    "created_by" UUID,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,
    "deleted_at" TIMESTAMP,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_interest_categories" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "category_id" UUID NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_interest_categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "investor_profiles_user_id_key" ON "investor_profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "entrepreneur_profiles_user_id_key" ON "entrepreneur_profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "consultant_profiles_user_id_key" ON "consultant_profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_verifications_user_id_key" ON "user_verifications"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "user_interest_categories_user_id_category_id_key" ON "user_interest_categories"("user_id", "category_id");

-- AddForeignKey
ALTER TABLE "investor_profiles" ADD CONSTRAINT "investor_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entrepreneur_profiles" ADD CONSTRAINT "entrepreneur_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultant_profiles" ADD CONSTRAINT "consultant_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_social_links" ADD CONSTRAINT "user_social_links_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_verifications" ADD CONSTRAINT "user_verifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_interest_categories" ADD CONSTRAINT "user_interest_categories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_interest_categories" ADD CONSTRAINT "user_interest_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
