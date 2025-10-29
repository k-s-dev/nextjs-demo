import prisma from "@/database/prismaClient";
import { DbError } from "@/lib/utils/errors";
import { auth } from "@/lib/features/authentication/auth";

export async function seedTestDb() {
  await seedUsers();
  return null; // Return null for tasks that don't return data to Cypress
}

export async function seedUsers() {
  const password = "12345678";

  try {
    const { user: user01 } = await auth.api.signUpEmail({
      body: {
        email: "test-user-01@example.com",
        name: "test user 01",
        password: password,
      },
    });
    await prisma.user.update({
      where: { id: user01.id },
      data: {
        emailVerified: true,
        role: "SUPERUSER",
      },
    });

    const { user: user02 } = await auth.api.signUpEmail({
      body: {
        email: "test-user-02@example.com",
        name: "test user 02",
        password: password,
      },
    });
    await prisma.user.update({
      where: { id: user02.id },
      data: {
        emailVerified: true,
        role: "USER",
      },
    });

    const { user: user03 } = await auth.api.signUpEmail({
      body: {
        email: "test-user-03@example.com",
        name: "test user 03",
        password: password,
      },
    });
    await prisma.user.update({
      where: { id: user03.id },
      data: {
        emailVerified: false,
        role: "SUPERUSER",
      },
    });
  } catch (error) {
    throw new DbError({
      cause: error as Error,
    });
  }
}
