import { PrismaClient } from "@/generated/prisma/client";
import path from "path";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  // Vercelでは実行ディレクトリがビルド時と異なるため、
  // dev.dbの絶対パスを明示的に指定する
  const dbPath = path.join(process.cwd(), "prisma", "dev.db");
  return new PrismaClient({
    datasourceUrl: `file:${dbPath}`,
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
