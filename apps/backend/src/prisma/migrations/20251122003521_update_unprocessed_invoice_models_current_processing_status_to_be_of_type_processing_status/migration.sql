/*
  Warnings:

  - The `currentProcessingStatus` column on the `UnprocessedInvoice` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "UnprocessedInvoice" DROP COLUMN "currentProcessingStatus",
ADD COLUMN     "currentProcessingStatus" "ProcessingStatus" NOT NULL DEFAULT 'PENDING';
