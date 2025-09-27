"use server";

import { revalidatePath } from "next/cache";
import { deleteUser } from "../../../dataAccess";
import { routes } from "@/lib/utils/routeMapper";
import { getSessionUser } from "@/lib/features/authentication/getSessionUser";
import { redirect } from "next/navigation";

export async function deleteUserServerAction(id?: string): Promise<"failed" | never> {
  const sessionUser = await getSessionUser();

  try {
    await deleteUser({ id: id }, "client", sessionUser);
  } catch {
    return "failed";
  }

  revalidatePath(routes.admin.root);
  redirect(routes.admin.user.read);
}
