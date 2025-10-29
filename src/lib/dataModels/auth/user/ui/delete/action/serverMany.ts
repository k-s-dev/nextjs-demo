"use server";

import { getSessionUser } from "@/lib/features/authentication/getSessionUser";
import { deleteManyUsersById } from "../../../dataAccessControl";

export async function deleteManyUsersServerAction(
  ids: string[],
) {
  const sessionUser = await getSessionUser();
  return await deleteManyUsersById(ids, "client", sessionUser);
}
