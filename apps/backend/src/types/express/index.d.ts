import type { User as PrismaUser } from "../../generated/prisma";

type FailedInvoiceUpload = Pick<Express.Multer.File,"fieldname" | "filename" | "originalname"> & {reason: string};

declare global {
  namespace Express {
    // Extend the Express.User type with Prisma's User type.
    // Consider omitting sensitive fields like "password" here.
    interface User extends PrismaUser {}

    //for invoiceMiddleware and uploadMiddleware. Contains current invoice count.
    interface Request {
      currentInvoiceCount?: number;
      failedInvoiceUploads?: FailedInvoiceUpload[];
    }
  }
}

export {};