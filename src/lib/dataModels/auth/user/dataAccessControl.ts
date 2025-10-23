"use server";

import prisma from "@/database/prismaClient";
import { DbError } from "@/lib/utils/errors";
import { TDataRequestMode, TServerResponsePromise } from "@/lib/utils/types";
import { TUserPublic } from "./definitions";
import { Prisma } from "@/generated/prisma/client";
import { checkPermissions } from "./permissions";
import { checkPermissionsAttributes } from "../permissions";
import { revalidatePath } from "next/cache";
import { routes } from "@/lib/utils/routeMapper";

const clientMask: Prisma.UserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  image: true,
  emailVerified: true,
};

export async function createUser<GUser = TUserPublic>(
  dataIn: Prisma.UserCreateInput,
  mode: TDataRequestMode = "client",
): TServerResponsePromise<GUser> {
  let user;

  // permissions check
  // anyone can signUp so no checks

  // create object
  try {
    user = await prisma.user.create({
      data: dataIn,
      select: mode === "client" ? clientMask : null,
    });
  } catch (error) {
    throw new DbError({
      message: "User creation failed due to internal server error.",
      cause: error,
      log: {
        message: "User creation failed.",
        data: dataIn,
      },
    });
  }

  revalidatePath(routes.admin.root);

  return {
    status: "success",
    data: user as GUser,
  };
}

export async function getUser<GUser = TUserPublic>(
  where: Prisma.UserWhereUniqueInput,
  mode: TDataRequestMode = "client",
  sessionUser?: TUserPublic,
): TServerResponsePromise<GUser | undefined> {
  let user;

  // check permissions attributes
  const checkAttributesResponse = await checkPermissionsAttributes(
    mode,
    sessionUser,
  );
  if (checkAttributesResponse.status === "error") {
    return checkAttributesResponse;
  }

  try {
    user = await prisma.user.findUnique({
      where: where,
      select: mode === "client" ? clientMask : null,
    });
  } catch (error) {
    throw new DbError({
      message: "Get user failed due to internal server error.",
      cause: error,
      log: {
        message: "Get user failed.",
        data: where,
      },
    });
  }

  //check permissions
  const checkPermissionsResponse = await checkPermissions(
    "read",
    mode,
    sessionUser,
    user,
  );

  if (checkPermissionsResponse.status === "error") {
    return checkPermissionsResponse;
  }

  return {
    ...checkPermissionsResponse,
    data: user as GUser,
  };
}

export async function getUserByEmail<GUser = TUserPublic>(
  email: string,
  mode: TDataRequestMode = "client",
  sessionUser?: TUserPublic,
): TServerResponsePromise<GUser | undefined> {
  let user;

  // check permissions
  const checkAttributesResponse = await checkPermissionsAttributes(
    mode,
    sessionUser,
  );
  if (checkAttributesResponse.status === "error") {
    return checkAttributesResponse;
  }

  try {
    user = await prisma.user.findUnique({
      where: { email },
      select: mode === "client" ? clientMask : null,
    });
  } catch (error) {
    throw new DbError({
      message: "Get user failed due to internal server error.",
      cause: error,
      log: {
        message: "Get user failed.",
        data: { email },
      },
    });
  }

  //check permissions
  const checkPermissionsResponse = await checkPermissions(
    "read",
    mode,
    sessionUser,
    user,
  );

  if (checkPermissionsResponse.status === "error") {
    return checkPermissionsResponse;
  }

  return {
    ...checkPermissionsResponse,
    data: user as GUser,
  };
}

export async function getUsers<GUser = TUserPublic>(
  where: Prisma.UserWhereInput,
  mode: TDataRequestMode = "client",
  sessionUser?: TUserPublic,
): TServerResponsePromise<GUser[] | undefined> {
  let users;

  //check permissions
  const checkAttributesResponse = await checkPermissionsAttributes(
    mode,
    sessionUser,
  );
  if (checkAttributesResponse.status === "error") {
    return checkAttributesResponse;
  }

  const checkPermissionsResponse = await checkPermissions(
    "read",
    mode,
    sessionUser,
  );
  if (checkPermissionsResponse.status === "error") {
    return checkPermissionsResponse;
  }

  try {
    users = await prisma.user.findMany({
      where: where,
      select: mode === "client" ? clientMask : null,
    });
  } catch (error) {
    throw new DbError({
      message: "Get user failed due to internal server error.",
      cause: error,
      log: {
        message: "Get user failed.",
        data: where,
      },
    });
  }

  return {
    status: "success",
    data: users as GUser[],
  };
}

export async function getUserCount(
  where: Prisma.UserWhereInput,
  mode: TDataRequestMode = "server",
  sessionUser?: TUserPublic,
): TServerResponsePromise<number | undefined> {
  let count;

  const checkAttributesResponse = await checkPermissionsAttributes(
    mode,
    sessionUser,
  );
  if (checkAttributesResponse.status === "error") {
    return checkAttributesResponse;
  }

  const checkPermissionsResponse = await checkPermissions(
    "count",
    mode,
    sessionUser,
  );
  if (checkPermissionsResponse.status === "error") {
    return checkPermissionsResponse;
  }

  try {
    count = await prisma.user.count({ where });
  } catch (error) {
    throw new DbError({
      message: "Get user failed due to internal server error.",
      cause: error,
      log: {
        message: "Get user failed.",
        data: where,
      },
    });
  }

  return {
    status: "success",
    data: count,
  };
}

export async function updateUser<GUser = TUserPublic>(
  where: Prisma.UserWhereUniqueInput,
  dataIn: Prisma.UserUpdateInput,
  mode: TDataRequestMode = "client",
  sessionUser?: TUserPublic,
): TServerResponsePromise<GUser | undefined> {
  let user = await prisma.user.findUnique({ where: where });

  //check permissions
  const checkAttributesResponse = await checkPermissionsAttributes(
    mode,
    sessionUser,
  );
  if (checkAttributesResponse.status === "error") {
    return checkAttributesResponse;
  }

  const checkPermissionsResponse = await checkPermissions(
    "update",
    mode,
    sessionUser,
    user,
  );
  if (checkPermissionsResponse.status === "error") {
    return checkPermissionsResponse;
  }

  try {
    user = await prisma.user.update({
      where: where,
      data: dataIn,
      select: mode === "client" ? clientMask : null,
    });
  } catch (error) {
    throw new DbError({
      message: "User update failed due to internal server error.",
      cause: error,
      log: {
        message: "DbError: User update failed.",
        data: dataIn,
      },
    });
  }

  revalidatePath(routes.admin.root);

  return {
    status: "success",
    data: user as GUser,
  };
}

export async function deleteUser<GUser = TUserPublic>(
  where: Prisma.UserWhereUniqueInput,
  mode: TDataRequestMode = "client",
  sessionUser?: TUserPublic,
): TServerResponsePromise<GUser | undefined> {
  let user = await prisma.user.findUnique({ where: where });

  //check permissions
  const checkAttributesResponse = await checkPermissionsAttributes(
    mode,
    sessionUser,
  );
  if (checkAttributesResponse.status === "error") {
    return checkAttributesResponse;
  }

  const checkPermissionsResponse = await checkPermissions(
    "delete",
    mode,
    sessionUser,
    user,
  );
  if (checkPermissionsResponse.status === "error")
    return checkPermissionsResponse;

  try {
    user = await prisma.user.delete({
      where: where,
      select: mode === "client" ? clientMask : null,
    });
  } catch (error) {
    throw new DbError({
      message: "User delete failed due to internal server error.",
      cause: error,
      log: {
        message: "DbError: User delete failed.",
      },
    });
  }

  revalidatePath(routes.admin.root);

  return {
    status: "success",
    data: user as GUser,
  };
}

export async function deleteManyUsersById(
  ids: string[],
  mode: TDataRequestMode = "client",
  sessionUser?: TUserPublic,
): TServerResponsePromise {
  let users;

  //check permissions
  const checkAttributesResponse = await checkPermissionsAttributes(
    mode,
    sessionUser,
  );
  if (checkAttributesResponse.status === "error") {
    return checkAttributesResponse;
  }
  const checkPermissionsResponse = await checkPermissions(
    "deleteMany",
    mode,
    sessionUser,
  );
  if (checkPermissionsResponse.status === "error") {
    return checkPermissionsResponse;
  }

  const failedDeleteMessages: string[] = [];

  try {
    users = await prisma.user.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  } catch (error) {
    throw new DbError({
      message: "User delete failed due to internal server error.",
      cause: error,
      log: {
        message: "DbError: User delete failed.",
        data: { ids },
      },
    });
  }

  for (const user of users) {
    const response = await deleteUser({ id: user.id }, mode, sessionUser);
    if (response.status === "error") {
      if (response.errors) {
        response.errors.forEach((error) => {
          failedDeleteMessages.push(`${user.email}: ${error}`);
        });
      } else {
        failedDeleteMessages.push(`Failed to delete user ${response.data}`);
      }
    }
  }

  revalidatePath(routes.admin.root);

  if (failedDeleteMessages.length > 0) {
    return {
      status: "error",
      errors: failedDeleteMessages,
    };
  }

  return {
    status: "success",
  };
}
