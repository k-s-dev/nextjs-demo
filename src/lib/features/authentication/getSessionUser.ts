"use server";

import { TUserPublic } from "@/lib/dataModels/auth/user/definitions";
import { auth } from "./auth";
import { headers } from "next/headers";

export async function getSessionUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const sessionUser = session?.user;
  return sessionUser as TUserPublic;
}
