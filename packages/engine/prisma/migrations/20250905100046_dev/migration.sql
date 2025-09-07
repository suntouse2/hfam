/*
  Warnings:

  - You are about to drop the column `balancerIndex` on the `connectors` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."connectors" DROP COLUMN "balancerIndex",
ADD COLUMN     "bIndex" INTEGER NOT NULL DEFAULT 0;
