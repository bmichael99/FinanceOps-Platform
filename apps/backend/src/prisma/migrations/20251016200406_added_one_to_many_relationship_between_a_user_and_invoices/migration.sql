/*
  Warnings:

  - Added the required column `userId` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `UnprocessedInvoice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "UnprocessedInvoice" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnprocessedInvoice" ADD CONSTRAINT "UnprocessedInvoice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
