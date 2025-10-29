import prisma from "@/database/prismaClient";
import { DbError } from "@/lib/utils/errors";
import { auth } from "@/lib/features/authentication/auth";

seedDevDb();

export async function seedDevDb() {
  await seedUsers();
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

    await auth.api.signUpEmail({
      body: {
        email: "test-user-02@example.com",
        name: "test user 02",
        password: password,
      },
    });
  } catch (error) {
    throw new DbError({
      cause: error as Error,
    });
  }
}
