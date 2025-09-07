-- CreateTable
CREATE TABLE "public"."methods" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "imageSrc" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,
    "method" TEXT,
    "byProvider" TEXT,
    "connectorId" INTEGER,
    "projectId" INTEGER,

    CONSTRAINT "methods_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."methods" ADD CONSTRAINT "methods_connectorId_fkey" FOREIGN KEY ("connectorId") REFERENCES "public"."connectors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."methods" ADD CONSTRAINT "methods_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;
