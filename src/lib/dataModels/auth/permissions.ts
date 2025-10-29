"use server";

import { TDataRequestMode, TServerResponsePromise } from "@/lib/utils/types";
import { Prisma, USER_ROLE } from "@/generated/prisma/client";
import { TUserPublic } from "./user/definitions";

export async function checkPermissionsAttributes(
  mode: TDataRequestMode,
  sessionUser?: TUserPublic,
): TServerResponsePromise {
  if (mode === "server") return { status: "success" };

  if (mode === "client" && !sessionUser) {
    return {
      status: "error",
      errors: ["PermissionError: Permission denied to get user."],
    };
  }

  return { status: "success" };
}

export async function checkGlobalAdminPermissions(
  operation: "create" | "read" | "update" | "delete" | "deleteMany" | "count",
  model: Prisma.ModelName,
  mode: TDataRequestMode,
  sessionUser?: TUserPublic,
): TServerResponsePromise {
  if (mode === "server") return { status: "success" };

  switch (operation) {
    default:
      if (sessionUser && sessionUser.role !== USER_ROLE.SUPERUSER) {
        return {
          status: "error",
          errors: [`Permission denied to ${operation} ${model}.`],
          log: { sessionUser },
        };
      }
      break;
  }

  return { status: "success" };
}
