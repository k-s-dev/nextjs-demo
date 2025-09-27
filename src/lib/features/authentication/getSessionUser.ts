"use server";

import { TUserPublic } from "@/lib/dataModels/auth/user/definitions";
import { authentication } from "./config";

export async function getSessionUser() {
  const session = await authentication();
  const sessionUser = session?.user;
  return sessionUser as TUserPublic;
}
