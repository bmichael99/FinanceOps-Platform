import { Invoice } from "./prisma-types"

export type InvoiceTableData = Pick<Invoice, "fileName" | "originalFileName" | "InvoiceDate" | "InvoiceTotal" | "InvoiceId">;