/*
  Warnings:

  - The `status` column on the `campaigns` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "CampaignStatus" AS ENUM ('active', 'completed', 'pending', 'cancelled');

-- AlterTable
ALTER TABLE "campaigns" ADD COLUMN     "latitude" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "longitude" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ALTER COLUMN "goalAmount" SET DEFAULT 0,
DROP COLUMN "status",
ADD COLUMN     "status" "CampaignStatus" NOT NULL DEFAULT 'active';
