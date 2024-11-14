// lib/prismadb.ts
import { PrismaClient } from "@prisma/client";

declare global {
  // Prevent multiple instances of PrismaClient in development
  var prisma: PrismaClient | undefined;
}

const prismadb = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalThis.prisma = prismadb;

export default prismadb;
