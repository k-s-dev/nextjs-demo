"use server";

import { TUserPublic } from "@/lib/dataModels/auth/user/definitions";
import { auth } from "./auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { routes } from "@/lib/utils/routeMapper";

export async function getSessionUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    redirect(routes.authentication.signIn);
  }
  return session.user as TUserPublic;
}
