-- CreateTable
CREATE TABLE "DatabaseRow" (
    "id" SERIAL NOT NULL,
    "employeeName" TEXT,
    "doctorName" TEXT,
    "serviceName" TEXT,
    "servicePrice" DOUBLE PRECISION,
    "inventoryItemName" TEXT,
    "purchasePrice" DOUBLE PRECISION,
    "salePrice" DOUBLE PRECISION,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DatabaseRow_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DatabaseRow" ADD CONSTRAINT "DatabaseRow_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
