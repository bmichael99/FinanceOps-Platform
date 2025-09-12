/*
  Warnings:

  - You are about to drop the column `client` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `invoiceDate` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `invoiceId` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `project` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `Invoice` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[fileName]` on the table `Invoice` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Invoice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Invoice" DROP COLUMN "client",
DROP COLUMN "invoiceDate",
DROP COLUMN "invoiceId",
DROP COLUMN "project",
DROP COLUMN "total",
ADD COLUMN     "AmountDue" TEXT,
ADD COLUMN     "BillingAddress" TEXT,
ADD COLUMN     "BillingAddressRecipient" TEXT,
ADD COLUMN     "CustomerAddress" TEXT,
ADD COLUMN     "CustomerAddressRecipient" TEXT,
ADD COLUMN     "CustomerId" TEXT,
ADD COLUMN     "CustomerName" TEXT,
ADD COLUMN     "CustomerTaxId" TEXT,
ADD COLUMN     "DueDate" TEXT,
ADD COLUMN     "InvoiceDate" TEXT,
ADD COLUMN     "InvoiceId" TEXT,
ADD COLUMN     "InvoiceTotal" TEXT,
ADD COLUMN     "PaymentTerm" TEXT,
ADD COLUMN     "PreviousUnpaidBalance" TEXT,
ADD COLUMN     "PurchaseOrder" TEXT,
ADD COLUMN     "RemittanceAddress" TEXT,
ADD COLUMN     "RemittanceAddressRecipient" TEXT,
ADD COLUMN     "ServiceAddress" TEXT,
ADD COLUMN     "ServiceAddressRecipient" TEXT,
ADD COLUMN     "ServiceEndDate" TEXT,
ADD COLUMN     "ServiceStartDate" TEXT,
ADD COLUMN     "ShippingAddress" TEXT,
ADD COLUMN     "ShippingAddressRecipient" TEXT,
ADD COLUMN     "SubTotal" TEXT,
ADD COLUMN     "TotalDiscount" TEXT,
ADD COLUMN     "TotalTax" TEXT,
ADD COLUMN     "VendorAddress" TEXT,
ADD COLUMN     "VendorAddressRecipient" TEXT,
ADD COLUMN     "VendorName" TEXT,
ADD COLUMN     "VendorTaxId" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "fileIdSharepoint" TEXT,
ADD COLUMN     "invoiceType" TEXT,
ADD COLUMN     "paymentStatus" TEXT,
ADD COLUMN     "projectName" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "InvoiceTable" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "invoiceTableDataAsMarkdown" TEXT,
    "rowCount" INTEGER,
    "columnCount" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "invoiceId" INTEGER NOT NULL,

    CONSTRAINT "InvoiceTable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnprocessedInvoice" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "fileName" TEXT NOT NULL,
    "projectName" TEXT,
    "invoiceType" TEXT,
    "paymentStatus" TEXT,
    "fileIdSharepoint" TEXT,
    "CustomerName" TEXT,
    "CustomerId" TEXT,
    "PurchaseOrder" TEXT,
    "InvoiceId" TEXT,
    "InvoiceDate" TEXT,
    "DueDate" TEXT,
    "VendorName" TEXT,
    "VendorAddress" TEXT,
    "VendorAddressRecipient" TEXT,
    "CustomerAddress" TEXT,
    "CustomerAddressRecipient" TEXT,
    "BillingAddress" TEXT,
    "BillingAddressRecipient" TEXT,
    "ShippingAddress" TEXT,
    "ShippingAddressRecipient" TEXT,
    "SubTotal" TEXT,
    "TotalDiscount" TEXT,
    "TotalTax" TEXT,
    "InvoiceTotal" TEXT,
    "AmountDue" TEXT,
    "PreviousUnpaidBalance" TEXT,
    "RemittanceAddress" TEXT,
    "RemittanceAddressRecipient" TEXT,
    "ServiceAddress" TEXT,
    "ServiceAddressRecipient" TEXT,
    "ServiceStartDate" TEXT,
    "ServiceEndDate" TEXT,
    "VendorTaxId" TEXT,
    "CustomerTaxId" TEXT,
    "PaymentTerm" TEXT,

    CONSTRAINT "UnprocessedInvoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnprocessedInvoiceFieldConfidence" (
    "id" SERIAL NOT NULL,
    "fieldName" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "invoiceId" INTEGER NOT NULL,

    CONSTRAINT "UnprocessedInvoiceFieldConfidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnprocessedInvoiceTable" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "invoiceTableDataAsMarkdown" TEXT,
    "rowCount" INTEGER,
    "columnCount" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "invoiceId" INTEGER NOT NULL,

    CONSTRAINT "UnprocessedInvoiceTable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "refreshToken" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sid" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UnprocessedInvoice_fileName_key" ON "UnprocessedInvoice"("fileName");

-- CreateIndex
CREATE INDEX "UnprocessedInvoiceFieldConfidence_invoiceId_fieldName_idx" ON "UnprocessedInvoiceFieldConfidence"("invoiceId", "fieldName");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sid_key" ON "Session"("sid");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_fileName_key" ON "Invoice"("fileName");

-- AddForeignKey
ALTER TABLE "InvoiceTable" ADD CONSTRAINT "InvoiceTable_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnprocessedInvoiceFieldConfidence" ADD CONSTRAINT "UnprocessedInvoiceFieldConfidence_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "UnprocessedInvoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnprocessedInvoiceTable" ADD CONSTRAINT "UnprocessedInvoiceTable_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "UnprocessedInvoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;
