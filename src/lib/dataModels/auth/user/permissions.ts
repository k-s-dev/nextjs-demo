"use server";

import { TDataRequestMode, TServerResponsePromise } from "@/lib/utils/types";
import { TUserPublic } from "./definitions";
import { Prisma, USER_ROLE } from "@/generated/prisma/client";

export async function checkPermissions(
  operation: "create" | "read" | "update" | "delete" | "deleteMany" | "count",
  mode: TDataRequestMode,
  sessionUser?: TUserPublic,
  user?: Prisma.UserModel | null,
): TServerResponsePromise {
  if (mode === "server") return { status: "success" };

  switch (operation) {
    case "delete":
      if (user && user.role === "SUPERUSER") {
        return {
          status: "error",
          errors: [
            "Permission denied: SUPERUSER can only be deleted from backend.",
          ],
          log: { user },
        };
      }

    case "read":
    case "update":
    case "delete":
      if (
        sessionUser &&
        sessionUser.role !== USER_ROLE.SUPERUSER &&
        sessionUser.id !== user?.id
      ) {
        return {
          status: "error",
          errors: [`Permission denied to ${operation} user.`],
          log: { user, sessionUser },
        };
      }
      break;

    case "count":
    case "deleteMany":
      if (sessionUser && sessionUser.role !== USER_ROLE.SUPERUSER) {
        return {
          status: "error",
          errors: [`Permission denied to ${operation} users.`],
          log: { user: user as TUserPublic, sessionUser },
        };
      }
      break;

    default:
      break;
  }

  return {
    status: "success",
  };
}
