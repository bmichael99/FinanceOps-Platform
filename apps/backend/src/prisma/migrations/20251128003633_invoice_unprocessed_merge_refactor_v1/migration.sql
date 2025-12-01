/*
  Warnings:

  - You are about to drop the `InvoiceTable` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UnprocessedInvoiceFieldConfidence` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UnprocessedInvoiceTable` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('UNVERIFIED', 'VERIFIED');

-- DropForeignKey
ALTER TABLE "public"."InvoiceTable" DROP CONSTRAINT "InvoiceTable_invoiceId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UnprocessedInvoiceFieldConfidence" DROP CONSTRAINT "UnprocessedInvoiceFieldConfidence_invoiceId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UnprocessedInvoiceTable" DROP CONSTRAINT "UnprocessedInvoiceTable_invoiceId_fkey";

-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'UNVERIFIED',
ALTER COLUMN "CustomerName" DROP NOT NULL,
ALTER COLUMN "InvoiceId" DROP NOT NULL,
ALTER COLUMN "VendorName" DROP NOT NULL,
ALTER COLUMN "DueDate" DROP NOT NULL,
ALTER COLUMN "InvoiceDate" DROP NOT NULL,
ALTER COLUMN "InvoiceTotal" DROP NOT NULL;

-- DropTable
DROP TABLE "public"."InvoiceTable";

-- DropTable
DROP TABLE "public"."UnprocessedInvoiceFieldConfidence";

-- DropTable
DROP TABLE "public"."UnprocessedInvoiceTable";
