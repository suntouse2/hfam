/*
  Warnings:

  - Added the required column `orderId` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."methods" ADD COLUMN     "showLabel" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."payments" ADD COLUMN     "orderId" TEXT NOT NULL;
