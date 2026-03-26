import { Invoice } from "./prisma-types";
export type InvoiceTableData = Pick<Invoice, "invoiceType" | "paymentStatus" | "fileName" | "originalFileName" | "InvoiceDate" | "InvoiceTotal" | "InvoiceId" | "DueDate">;
