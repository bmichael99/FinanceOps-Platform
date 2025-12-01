-- CreateIndex
CREATE INDEX "idx_invoice_user_verif_proc" ON "Invoice"("userId", "verificationStatus", "currentProcessingStatus");

-- CreateIndex
CREATE INDEX "idx_invoice_user_created" ON "Invoice"("userId", "createdAt");
