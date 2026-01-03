import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const dbURL = process.env.DATABASE_URL;
const nodeEnv = process.env.NODE_ENV;

const connectionString = `${dbURL}`;
const adapter = new PrismaPg({ connectionString });
const prismaExtended = new PrismaClient({ adapter }).$extends({
  model: {
    category: {
      async getNodeType(id: string) {
        let result = null;
        const category = await prisma.category.findUnique({
          where: { id },
          include: { children: true },
        });

        if (category) {
          if (!category.parentId) result = "root";
          if (category.parentId) {
            if (category.children.length > 0) {
              result = "branch";
            } else {
              result = "leaf";
            }
          }
        }
        return result;
      },
    },
  },
});

const globalForPrisma = global as unknown as {
  prisma: typeof prismaExtended;
};

const prisma = globalForPrisma.prisma || prismaExtended;

if (nodeEnv !== "production") globalForPrisma.prisma = prisma;

export default prisma;
