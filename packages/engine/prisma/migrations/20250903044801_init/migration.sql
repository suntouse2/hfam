-- CreateEnum
CREATE TYPE "public"."PaymentStatus" AS ENUM ('CREATED', 'PAID', 'REFUND');

-- CreateTable
CREATE TABLE "public"."projects" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "domains" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."providers" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "schema" JSONB NOT NULL,
    "methods" TEXT[],

    CONSTRAINT "providers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."connectors" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "providerId" INTEGER NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "schema" JSONB NOT NULL,
    "settings" JSONB,
    "active" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "connectors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."payments" (
    "id" TEXT NOT NULL,
    "status" "public"."PaymentStatus" NOT NULL DEFAULT 'CREATED',
    "amount" INTEGER NOT NULL,
    "paymentId" TEXT,
    "paymentUrl" TEXT,
    "paymentQr" TEXT,
    "projectId" INTEGER NOT NULL,
    "providerId" INTEGER NOT NULL,
    "method" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "providers_key_key" ON "public"."providers"("key");

-- CreateIndex
CREATE UNIQUE INDEX "payments_paymentId_key" ON "public"."payments"("paymentId");

-- AddForeignKey
ALTER TABLE "public"."connectors" ADD CONSTRAINT "connectors_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."connectors" ADD CONSTRAINT "connectors_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "public"."providers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."payments" ADD CONSTRAINT "payments_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."payments" ADD CONSTRAINT "payments_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "public"."providers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
