-- CreateEnum
CREATE TYPE "public"."EventStatus" AS ENUM ('pending', 'finalized');

-- AlterTable
ALTER TABLE "public"."Event" ADD COLUMN     "status" "public"."EventStatus" NOT NULL DEFAULT 'finalized';
