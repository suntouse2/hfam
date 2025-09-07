/*
  Warnings:

  - You are about to drop the column `providerId` on the `connectors` table. All the data in the column will be lost.
  - You are about to drop the column `providerId` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the `providers` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `byProvider` to the `connectors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `connector` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."connectors" DROP CONSTRAINT "connectors_providerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."domains" DROP CONSTRAINT "domains_projectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."payments" DROP CONSTRAINT "payments_providerId_fkey";

-- AlterTable
ALTER TABLE "public"."connectors" DROP COLUMN "providerId",
ADD COLUMN     "byProvider" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."payments" DROP COLUMN "providerId",
ADD COLUMN     "connector" JSONB NOT NULL;

-- DropTable
DROP TABLE "public"."providers";

-- AddForeignKey
ALTER TABLE "public"."domains" ADD CONSTRAINT "domains_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
