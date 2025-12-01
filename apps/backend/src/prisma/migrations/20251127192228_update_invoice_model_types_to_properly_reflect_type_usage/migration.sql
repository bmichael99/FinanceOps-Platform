/*
  Warnings:

  - The `invoiceType` column on the `Invoice` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `paymentStatus` column on the `Invoice` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `CustomerName` on table `Invoice` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `DueDate` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `InvoiceDate` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Made the column `InvoiceId` on table `Invoice` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `InvoiceTotal` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Made the column `VendorName` on table `Invoice` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "InvoiceType" AS ENUM ('ACCOUNTS_PAYABLE', 'ACCOUNTS_RECEIVABLE');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PAID', 'UNPAID');

-- AlterTable
ALTER TABLE "Invoice" ALTER COLUMN "CustomerName" SET NOT NULL,
DROP COLUMN "DueDate",
ADD COLUMN     "DueDate" TIMESTAMP(3) NOT NULL,
DROP COLUMN "InvoiceDate",
ADD COLUMN     "InvoiceDate" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "InvoiceId" SET NOT NULL,
DROP COLUMN "InvoiceTotal",
ADD COLUMN     "InvoiceTotal" INTEGER NOT NULL,
ALTER COLUMN "VendorName" SET NOT NULL,
DROP COLUMN "invoiceType",
ADD COLUMN     "invoiceType" "InvoiceType",
DROP COLUMN "paymentStatus",
ADD COLUMN     "paymentStatus" "PaymentStatus";
