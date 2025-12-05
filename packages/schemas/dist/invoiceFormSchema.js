import * as z from "zod";
export const invoiceFormSchema = z.object({
    CustomerName: z.string().min(1, {
        error: "Customer Name is required"
    }),
    InvoiceId: z.string().min(1, {
        error: "Invoice ID is required"
    }),
    InvoiceDate: z.coerce.date({
        error: issue => { console.log(issue); return issue.code === "invalid_type" ? "Invalid date" : "Required"; }
    }),
    DueDate: z.preprocess((val) => (val === "" ? undefined : val), z.coerce.date()),
    VendorName: z.string().min(1, {
        error: "Vendor Name is required"
    }),
    VendorAddress: z.string().optional(),
    CustomerAddress: z.string().optional(),
    InvoiceTotal: z.coerce.number().gte(0, {
        error: "Invoice total should be greater than or equal to 0"
    }),
    invoiceType: z.enum(['ACCOUNTS_PAYABLE', 'ACCOUNTS_RECEIVABLE'], {
        error: "Invoice Type is required"
    }),
    paymentStatus: z.enum(['PAID', 'UNPAID'], {
        error: "Payment Status is required"
    }),
});
