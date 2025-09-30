-- CreateTable
CREATE TABLE "Invoice" (
    "id" SERIAL NOT NULL,
    "client" TEXT NOT NULL,
    "project" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "invoiceId" TEXT,
    "invoiceDate" TIMESTAMP(3),
    "total" DOUBLE PRECISION,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);
