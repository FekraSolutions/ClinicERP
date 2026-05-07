-- CreateTable
CREATE TABLE "PatientNote" (
    "id" SERIAL NOT NULL,
    "patientName" TEXT NOT NULL,
    "patientId" TEXT,
    "content" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PatientNote_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PatientNote" ADD CONSTRAINT "PatientNote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
