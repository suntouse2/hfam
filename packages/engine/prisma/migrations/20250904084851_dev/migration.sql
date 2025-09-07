/*
  Warnings:

  - Made the column `projectId` on table `domains` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."domains" DROP CONSTRAINT "domains_projectId_fkey";

-- AlterTable
ALTER TABLE "public"."domains" ALTER COLUMN "projectId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."domains" ADD CONSTRAINT "domains_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
