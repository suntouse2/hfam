/*
  Warnings:

  - You are about to drop the column `domains` on the `projects` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."projects" DROP COLUMN "domains";

-- CreateTable
CREATE TABLE "public"."domains" (
    "id" SERIAL NOT NULL,
    "value" TEXT NOT NULL,
    "projectId" INTEGER,

    CONSTRAINT "domains_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."domains" ADD CONSTRAINT "domains_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;
