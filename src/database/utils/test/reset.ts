import prisma from "@/database/prismaClient";

export async function resetTestDb() {
  try {
    await prisma.user.deleteMany({});
    return null;
  } catch (error) {
    console.error("Database reset failed:", error);
    throw error;
  }
}
