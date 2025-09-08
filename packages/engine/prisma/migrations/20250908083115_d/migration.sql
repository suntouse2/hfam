/*
  Warnings:

  - Made the column `label` on table `methods` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."methods" ALTER COLUMN "label" SET NOT NULL,
ALTER COLUMN "imageSrc" DROP NOT NULL;
