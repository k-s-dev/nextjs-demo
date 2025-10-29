import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

const dbURL = process.env.DATABASE_URL;
const nodeEnv = process.env.NODE_ENV;

const connectionString = `${dbURL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (nodeEnv !== "production") globalForPrisma.prisma = prisma;

export default prisma;
