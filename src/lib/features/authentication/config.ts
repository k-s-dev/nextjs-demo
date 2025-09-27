import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";

import prisma from "@/database/prismaClient";
import { routes } from "@/lib/utils/routeMapper";
import { getUser, updateUser } from "@/lib/dataModels/auth/user/dataAccess";

export const {
  handlers,
  signIn,
  signOut,
  auth: authentication,
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  trustHost: true, // TODO/REVIEW: before deployment https://authjs.dev/getting-started/deployment
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: routes.all.signIn,
    error: routes.all.authError,
  },
  providers: [
    Google,
    GitHub,
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        // validation and checks in form action
        const user = await getUser(
          {
            email: credentials.email as string,
          },
          "server",
        );

        return user;
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        // typescript extending authjs user object is not sorted
        // @ts-expect-error user role exists
        token.role = user?.role;
      }
      return token;
    },
    session({ session, token }) {
      if (token.sub && token.role) {
        session.user.id = token.sub;
        session.user.role = token.role;
      }
      return session;
    },
  },
  events: {
    async linkAccount({ user }) {
      await updateUser(
        { id: user.id },
        { emailVerified: new Date() },
        "server",
      );
    },
  },
});
