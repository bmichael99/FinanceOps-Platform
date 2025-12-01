import { FileResponseType, FileStatusType } from "@finance-platform/types";
import { type Invoice } from "../generated/prisma";

export function shapeSummary(invoice: Invoice): FileResponseType {
  return {
    fileName: invoice.fileName,
    originalFileName: invoice.originalFileName,
    status: invoice.currentProcessingStatus as FileStatusType,
    uploadTime: invoice.createdAt,
  };
}

export function shapeFull(invoice: Invoice) {
  return invoice;
}

export function shapeCustom<Key extends keyof Invoice>(invoice: Invoice, fields: Key[]) {
  let response = {} as Pick<Invoice, Key>; //pick here creates a smaller type that only uses the keys passed into fields
  for(let key of fields){
    response[key] = invoice[key];
  }
  return response;
}