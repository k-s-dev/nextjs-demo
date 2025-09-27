import bcrypt from "bcryptjs";

import prisma from "@/database/prismaClient";
import { DbError } from "@/lib/utils/errors";

seedDevDb();

export async function seedDevDb() {
  await seedUsers();
}

export async function seedUsers() {
  const hashedPassword = await bcrypt.hash("12345678", 10);

  try {
    await prisma.user.createMany({
      data: [
        {
          email: "shunya.acad@gmail.com",
          name: "shunya acad",
          password: hashedPassword,
          emailVerified: new Date(),
          role: "SUPERUSER",
        },
        {
          email: "test-user-01@example.com",
          password: hashedPassword,
          emailVerified: new Date(),
          role: "USER",
        },
        {
          email: "test-user-02@example.com",
          password: hashedPassword,
          role: "USER",
        },
      ],
    });
  } catch (error) {
    throw new DbError({
      cause: error as Error,
    });
  }
}
