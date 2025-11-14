import { Invoice } from "../generated/prisma";

export function shapeSummary(invoice: Invoice) {
  return {
    fileName: invoice.fileName,
    originalFileName: invoice.originalFileName,
    status: invoice.currentProcessingStatus,
    uploadTime: invoice.createdAt,
  };
}

export function shapeFull(invoice: Invoice) {
  return invoice;
}