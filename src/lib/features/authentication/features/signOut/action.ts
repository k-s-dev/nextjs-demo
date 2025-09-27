"use server";

import { signOut } from "../../config";

export async function signOutAction() {
  return signOut({ redirect: false });
}
