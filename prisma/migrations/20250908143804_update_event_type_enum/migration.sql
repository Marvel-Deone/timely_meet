/*
  Warnings:

  - The values [ONE_ON_ONE,GROUP,POLL,ROUND_ROBIN,COLLECTIVE] on the enum `EventType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."EventType_new" AS ENUM ('One_on_One', 'Group', 'Poll', 'Round_Robin', 'Collective');
ALTER TABLE "public"."Event" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "public"."Event" ALTER COLUMN "type" TYPE "public"."EventType_new" USING ("type"::text::"public"."EventType_new");
ALTER TYPE "public"."EventType" RENAME TO "EventType_old";
ALTER TYPE "public"."EventType_new" RENAME TO "EventType";
DROP TYPE "public"."EventType_old";
ALTER TABLE "public"."Event" ALTER COLUMN "type" SET DEFAULT 'One_on_One';
COMMIT;

-- AlterTable
ALTER TABLE "public"."Event" ALTER COLUMN "type" SET DEFAULT 'One_on_One';
