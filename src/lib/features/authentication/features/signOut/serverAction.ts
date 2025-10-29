"use server";

import { headers } from "next/headers";
import { auth } from "../../auth";

export async function signOutServerAction() {
  return auth.api.signOut({
    headers: await headers(),
  });
}
