// eslint-disable
"use server";

import prisma from "@/database/prismaClient";
import { DbError } from "@/lib/utils/errors";

export async function deleteExpiredVerificationTokens() {
  try {
    await prisma.verification.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  } catch (error) {
    throw new DbError({
      message: "Internal server error.",
      cause: error,
      log: {
        message: "DbError: failed to delete expired tokens.",
      },
    });
  }
}
