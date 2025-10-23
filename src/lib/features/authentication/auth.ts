import prisma from "@/database/prismaClient";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { sendVerificationEmail } from "./verification";
import { customSession } from "better-auth/plugins";
import { getUser } from "@/lib/dataModels/auth/user/dataAccessControl";
import { USER_ROLE } from "@/generated/prisma/enums";
import { EnvError } from "@/lib/utils/errors";
import { TUserPublic } from "@/lib/dataModels/auth/user/definitions";
import { scrypt } from "node:crypto";

const google_client_id = process.env.AUTH_GOOGLE_ID;
const google_client_secret = process.env.AUTH_GOOGLE_SECRET;
const github_client_id = process.env.AUTH_GITHUB_ID;
const github_client_secret = process.env.AUTH_GITHUB_SECRET;

if (
  !google_client_id ||
  !google_client_secret ||
  !github_client_id ||
  !github_client_secret
) {
  throw new EnvError({});
}

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "USER",
        input: false,
      },
    },
  },
  plugins: [
    customSession(async ({ user, session }) => {
      const response = await getUser({ id: session.userId }, "server");
      const dbUser = response.data as TUserPublic;
      return {
        session,
        user: {
          ...user,
          role: dbUser.role as USER_ROLE,
        },
      };
    }),

    // nextCookies has to be last
    nextCookies(),
  ],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    // TODO: review eslint disable
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    sendResetPassword: async ({ user, url, token }, request) => {
      await sendVerificationEmail(user.email, url, "RESET_PASSWORD");
    },
    password: {
      hash: async (password: string) => {
        const cost = Number(process.env.BETTER_AUTH_HASH_COST!);
        const salt = process.env.SALT!;
        return new Promise((resolve, reject) => {
          scrypt(
            password,
            salt,
            64,
            {
              cost: cost,
            },
            (err, key) => {
              if (err) reject(err);
              resolve(key.toString("hex"));
            },
          );
        });
      },
      verify: async ({
        hash,
        password,
      }: {
        hash: string;
        password: string;
      }) => {
        const cost = Number(process.env.BETTER_AUTH_HASH_COST!);
        const salt = process.env.SALT!;
        return new Promise((resolve, reject) => {
          scrypt(
            password,
            salt,
            64,
            {
              cost: cost,
            },
            (err, key) => {
              if (err) reject(err);
              resolve(hash === key.toString("hex"));
            },
          );
        });
      },
    },
  },
  socialProviders: {
    google: {
      clientId: google_client_id,
      clientSecret: google_client_secret,
    },
    github: {
      clientId: github_client_id,
      clientSecret: github_client_secret,
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    // TODO: review eslint disable
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    sendVerificationEmail: async ({ user, url, token }, request) => {
      await sendVerificationEmail(user.email, url, "EMAIL_VERIFICATION");
    },
  },
  trustedOrigins: ["*"],
});
