import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // eslint-disable-next-line no-var
  var __prisma: any;
}

export const prisma = global.__prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") global.__prisma = prisma;
