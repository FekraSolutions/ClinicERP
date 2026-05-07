/*
  Warnings:

  - You are about to drop the column `discountCouponAmount` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `discountCouponName` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `discountCouponType` on the `Invoice` table. All the data in the column will be lost.
  - Made the column `time` on table `Invoice` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Invoice" DROP COLUMN "discountCouponAmount",
DROP COLUMN "discountCouponName",
DROP COLUMN "discountCouponType",
ADD COLUMN     "discountAmount" DOUBLE PRECISION,
ADD COLUMN     "sessions" INTEGER,
ALTER COLUMN "date" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "time" SET NOT NULL;
