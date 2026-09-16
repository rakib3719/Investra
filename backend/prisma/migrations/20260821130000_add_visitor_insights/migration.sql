CREATE TABLE "visitor_insights" (
    "id" UUID NOT NULL,
    "anonymous_id" VARCHAR NOT NULL,
    "ip_hash" VARCHAR NOT NULL,
    "page_path" VARCHAR NOT NULL DEFAULT '/',
    "browser_name" VARCHAR,
    "browser_version" VARCHAR,
    "operating_system" VARCHAR,
    "device_type" VARCHAR,
    "language" VARCHAR,
    "timezone" VARCHAR,
    "screen_width" INTEGER,
    "screen_height" INTEGER,
    "viewport_width" INTEGER,
    "viewport_height" INTEGER,
    "referrer" TEXT,
    "location_consent" BOOLEAN NOT NULL DEFAULT false,
    "latitude" DECIMAL(9,6),
    "longitude" DECIMAL(9,6),
    "location_accuracy" INTEGER,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "visitor_insights_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "visitor_insights_created_at_idx" ON "visitor_insights"("created_at");
CREATE INDEX "visitor_insights_anonymous_id_idx" ON "visitor_insights"("anonymous_id");
CREATE INDEX "visitor_insights_ip_hash_idx" ON "visitor_insights"("ip_hash");
