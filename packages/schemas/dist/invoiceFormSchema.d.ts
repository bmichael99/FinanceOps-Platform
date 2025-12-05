import * as z from "zod";
export declare const invoiceFormSchema: z.ZodObject<{
    CustomerName: z.ZodString;
    InvoiceId: z.ZodString;
    InvoiceDate: z.ZodCoercedDate<unknown>;
    DueDate: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodCoercedDate<unknown>>;
    VendorName: z.ZodString;
    VendorAddress: z.ZodOptional<z.ZodString>;
    CustomerAddress: z.ZodOptional<z.ZodString>;
    InvoiceTotal: z.ZodCoercedNumber<unknown>;
    invoiceType: z.ZodEnum<{
        ACCOUNTS_PAYABLE: "ACCOUNTS_PAYABLE";
        ACCOUNTS_RECEIVABLE: "ACCOUNTS_RECEIVABLE";
    }>;
    paymentStatus: z.ZodEnum<{
        PAID: "PAID";
        UNPAID: "UNPAID";
    }>;
}, z.core.$strip>;
export type InvoiceFormType = z.infer<typeof invoiceFormSchema>;
