/*
  Warnings:

  - You are about to drop the column `fileIdSharepoint` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `fileIdSharepoint` on the `UnprocessedInvoice` table. All the data in the column will be lost.
  - Added the required column `currentProcessingStatus` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `filePath` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mimeType` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originalFileName` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currentProcessingStatus` to the `UnprocessedInvoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `filePath` to the `UnprocessedInvoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mimeType` to the `UnprocessedInvoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originalFileName` to the `UnprocessedInvoice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Invoice" DROP COLUMN "fileIdSharepoint",
ADD COLUMN     "currentProcessingStatus" TEXT NOT NULL,
ADD COLUMN     "filePath" TEXT NOT NULL,
ADD COLUMN     "mimeType" TEXT NOT NULL,
ADD COLUMN     "originalFileName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "UnprocessedInvoice" DROP COLUMN "fileIdSharepoint",
ADD COLUMN     "currentProcessingStatus" TEXT NOT NULL,
ADD COLUMN     "filePath" TEXT NOT NULL,
ADD COLUMN     "mimeType" TEXT NOT NULL,
ADD COLUMN     "originalFileName" TEXT NOT NULL;
