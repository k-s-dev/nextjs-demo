"use server";

import { deleteUser } from "../../../dataAccessControl";
import { getSessionUser } from "@/lib/features/authentication/getSessionUser";
import { TServerResponsePromise } from "@/lib/utils/types";

export async function deleteUserServerAction(
  id?: string,
): TServerResponsePromise {
  const sessionUser = await getSessionUser();
  return await deleteUser({ id: id }, "client", sessionUser);
}
