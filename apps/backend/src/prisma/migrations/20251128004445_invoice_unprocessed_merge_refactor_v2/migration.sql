/*
  Warnings:

  - You are about to drop the `UnprocessedInvoice` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."UnprocessedInvoice" DROP CONSTRAINT "UnprocessedInvoice_userId_fkey";

-- DropTable
DROP TABLE "public"."UnprocessedInvoice";
