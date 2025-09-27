"use server";

import { Prisma, TOKEN_TYPE } from "@/generated/prisma";
import prisma from "@/database/prismaClient";
import { DbError } from "@/lib/utils/errors";

export async function createVerificationToken(
  dataIn: Prisma.VerificationTokenCreateInput,
) {
  try {
    await prisma.verificationToken.create({ data: dataIn });
  } catch (error) {
    throw new DbError({
      message: "Internal server error.",
      cause: error,
      log: {
        message: "DbError: failed to create token.",
        data: dataIn,
      },
    });
  }
}

export async function getVerificationToken(
  email: string,
  tokenType: TOKEN_TYPE,
) {
  let token;
  try {
    token = await prisma.verificationToken.findFirst({
      where: {
        email: email,
        type: tokenType,
      },
    });
  } catch (error) {
    throw new DbError({
      message: "Invalid token.",
      cause: error,
      log: {
        message: "DbError: failed to get token.",
        data: {
          email,
          tokenType,
        },
      },
    });
  }
  return token;
}

export async function deleteVerificationToken(
  email: string,
  token: string,
  tokenType: TOKEN_TYPE,
) {
  const existingToken = await getVerificationToken(email, tokenType);
  if (existingToken) {
    try {
      await prisma.verificationToken.delete({
        where: {
          email_token: {
            email: email,
            token: token,
          },
        },
      });
    } catch (error) {
      throw new DbError({
        message: "Internal server error.",
        cause: error,
        log: {
          message: "DbError: failed to delete token.",
          data: {
            email,
            token,
            tokenType,
          },
        },
      });
    }
  }
}

export async function deleteExpiredVerificationTokens() {
  try {
    await prisma.verificationToken.deleteMany({
      where: {
        expires: {
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
