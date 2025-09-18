/*
  Warnings:

  - The values [One_on_One,Group,Poll,Round_Robin,Collective] on the enum `EventType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `user_id` on the `PollVote` table. All the data in the column will be lost.
  - Added the required column `voter_email` to the `PollVote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `voter_name` to the `PollVote` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."EventType_new" AS ENUM ('ONE_ON_ONE', 'GROUP', 'POLL', 'ROUND_ROBIN', 'COLLECTIVE');
ALTER TABLE "public"."Event" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "public"."Event" ALTER COLUMN "type" TYPE "public"."EventType_new" USING ("type"::text::"public"."EventType_new");
ALTER TYPE "public"."EventType" RENAME TO "EventType_old";
ALTER TYPE "public"."EventType_new" RENAME TO "EventType";
DROP TYPE "public"."EventType_old";
ALTER TABLE "public"."Event" ALTER COLUMN "type" SET DEFAULT 'ONE_ON_ONE';
COMMIT;

-- DropForeignKey
ALTER TABLE "public"."PollVote" DROP CONSTRAINT "PollVote_user_id_fkey";

-- AlterTable
ALTER TABLE "public"."Event" ALTER COLUMN "type" SET DEFAULT 'ONE_ON_ONE';

-- AlterTable
ALTER TABLE "public"."PollVote" DROP COLUMN "user_id",
ADD COLUMN     "voter_email" TEXT NOT NULL,
ADD COLUMN     "voter_name" TEXT NOT NULL;
