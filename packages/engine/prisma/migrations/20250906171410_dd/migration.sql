/*
  Warnings:

  - Made the column `projectId` on table `methods` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."methods" DROP CONSTRAINT "methods_projectId_fkey";

-- AlterTable
ALTER TABLE "public"."methods" ALTER COLUMN "projectId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."methods" ADD CONSTRAINT "methods_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
