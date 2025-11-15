import { FileResponseType, FileStatusType } from "@finance-platform/types";
import { type UnprocessedInvoice } from "../generated/prisma";

export function shapeSummary(invoice: UnprocessedInvoice): FileResponseType {
  return {
    fileName: invoice.fileName,
    originalFileName: invoice.originalFileName,
    status: invoice.currentProcessingStatus as FileStatusType,
    uploadTime: invoice.createdAt,
  };
}

export function shapeFull(invoice: UnprocessedInvoice) {
  return invoice;
}

export function shapeCustom<Key extends keyof UnprocessedInvoice>(invoice: UnprocessedInvoice, fields: Key[]) {
  let response = {} as Pick<UnprocessedInvoice, Key>; //pick here creates a smaller type that only uses the keys passed into fields
  for(let key of fields){
    response[key] = invoice[key];
  }
  return response;
}