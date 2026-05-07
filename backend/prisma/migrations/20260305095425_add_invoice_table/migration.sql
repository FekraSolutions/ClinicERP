-- CreateTable
CREATE TABLE "Invoice" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT,
    "patientName" TEXT,
    "age" INTEGER,
    "patientId" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "email" TEXT,
    "service" TEXT,
    "doctor" TEXT,
    "price" DOUBLE PRECISION,
    "payMethod" TEXT,
    "paid" DOUBLE PRECISION,
    "remaining" DOUBLE PRECISION,
    "discountCouponName" TEXT,
    "discountCouponType" TEXT,
    "discountCouponAmount" DOUBLE PRECISION,
    "companyName" TEXT,
    "companyAddress" TEXT,
    "registrationNumber" TEXT,
    "taxNumber" TEXT,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
