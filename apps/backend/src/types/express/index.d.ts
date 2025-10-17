import type { User as PrismaUser } from "../../generated/prisma";

declare global {
  namespace Express {
    // Extend the Express.User type with Prisma's User type.
    // Consider omitting sensitive fields like "password" here.
    interface User extends PrismaUser {}
  }
}

export {};