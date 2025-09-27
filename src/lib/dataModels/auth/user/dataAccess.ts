"use server";

import { Prisma, USER_ROLE } from "@/generated/prisma";
import prisma from "@/database/prismaClient";
import { DbError, PermissionError } from "@/lib/utils/errors";
import { TDataRequestMode } from "@/lib/utils/types";
import { TUser, TUserPublic } from "./definitions";

const publicSelect: Prisma.UserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  image: true,
  emailVerified: true,
};

export async function createUser(
  dataIn: Prisma.UserCreateInput,
  mode: TDataRequestMode = "client",
) {
  let user;

  // permissions check
  // anyone can signUp so no checks

  // create object
  try {
    user = await prisma.user.create({
      data: dataIn,
      select: mode === "client" ? publicSelect : null,
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

  return mode === "client"
    ? (user as unknown as TUserPublic)
    : (user as unknown as TUser);
}

export async function getUser(
  where: Prisma.UserWhereUniqueInput,
  mode: TDataRequestMode = "client",
  sessionUser?: TUserPublic,
) {
  let user;

  // check permissions
  if (!sessionUser && mode === "client") {
    throw new PermissionError({
      message: "Permission denied.",
      log: {
        message: "Permission denied to get user.",
        data: {
          user,
          sessionUser,
        },
      },
    });
  }

  try {
    user = await prisma.user.findUnique({
      where: where,
      select: mode === "client" ? publicSelect : null,
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
  if (
    sessionUser &&
    sessionUser.role !== USER_ROLE.SUPERUSER &&
    sessionUser.id !== user?.id
  ) {
    throw new PermissionError({
      message: "Permission denied.",
      log: {
        message: "Permission denied to get user.",
        data: {
          user,
          sessionUser,
        },
      },
    });
  }

  return mode === "client"
    ? (user as unknown as TUserPublic)
    : (user as unknown as TUser);
}

export async function getUserByEmail(
  email: string,
  mode: TDataRequestMode = "client",
  sessionUser?: TUserPublic,
) {
  let user;

  // check permissions
  if (!sessionUser && mode === "client") {
    throw new PermissionError({
      message: "Permission denied.",
      log: {
        message: "Permission denied to get user.",
        data: {
          user,
          sessionUser,
        },
      },
    });
  }

  try {
    user = await prisma.user.findUnique({
      where: { email },
      select: mode === "client" ? publicSelect : null,
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
  if (
    sessionUser &&
    sessionUser.role !== USER_ROLE.SUPERUSER &&
    sessionUser.id !== user?.id
  ) {
    throw new PermissionError({
      message: "Permission denied.",
      log: {
        message: "Permission denied to get user.",
        data: {
          user,
          sessionUser,
        },
      },
    });
  }

  return mode === "client"
    ? (user as unknown as TUserPublic)
    : (user as unknown as TUser);
}

export async function getUserCount(
  where: Prisma.UserWhereInput,
  mode: TDataRequestMode = "server",
  sessionUser?: TUserPublic,
) {
  let count;

  if (
    (!sessionUser && mode === "client") ||
    (sessionUser && sessionUser.role !== USER_ROLE.SUPERUSER)
  ) {
    throw new PermissionError({
      message: "Permission denied.",
      log: {
        message: "Permission denied to get users.",
        data: {
          sessionUser,
        },
      },
    });
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

  return count
}

export async function getUsers(
  where: Prisma.UserWhereInput,
  mode: TDataRequestMode = "client",
  sessionUser?: TUserPublic,
) {
  let users;

  //check permissions
  // TODO: modify permission in prod
  if (
    (!sessionUser && mode === "client") ||
    (sessionUser && sessionUser.role !== USER_ROLE.SUPERUSER)
  ) {
    throw new PermissionError({
      message: "Permission denied.",
      log: {
        message: "Permission denied to get users.",
        data: {
          sessionUser,
        },
      },
    });
  }

  try {
    users = await prisma.user.findMany({
      where: where,
      select: mode === "client" ? publicSelect : null,
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

  return mode === "client"
    ? (users as unknown as TUserPublic[])
    : (users as unknown as TUser[]);
}

export async function updateUser(
  where: Prisma.UserWhereUniqueInput,
  dataIn: Prisma.UserUpdateInput,
  mode: TDataRequestMode = "client",
  sessionUser?: TUserPublic,
) {
  let user = await prisma.user.findUnique({ where: where });

  //check permissions
  if (
    (!sessionUser && mode === "client") ||
    (sessionUser &&
      sessionUser.role !== USER_ROLE.SUPERUSER &&
      sessionUser.id !== user?.id)
  ) {
    throw new PermissionError({
      message: "Permission denied.",
      log: {
        message: "Permission denied to update user.",
        data: {
          user,
          sessionUser,
        },
      },
    });
  }

  try {
    user = await prisma.user.update({
      where: where,
      data: dataIn,
      select: mode === "client" ? publicSelect : null,
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

  return mode === "client"
    ? (user as unknown as TUserPublic)
    : (user as unknown as TUser);
}

export async function deleteUser(
  where: Prisma.UserWhereUniqueInput,
  mode: TDataRequestMode = "client",
  sessionUser?: TUserPublic,
) {
  let user = await prisma.user.findUnique({ where: where });

  //check permissions
  if (
    (!sessionUser && mode === "client") ||
    (sessionUser &&
      sessionUser.role !== USER_ROLE.SUPERUSER &&
      sessionUser.id !== user?.id)
  ) {
    throw new PermissionError({
      message: "Permission denied.",
      log: {
        message: "Permission denied to delete user.",
        data: {
          user,
          sessionUser,
        },
      },
    });
  }

  try {
    user = await prisma.user.delete({
      where: where,
      select: mode === "client" ? publicSelect : null,
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

  return mode === "client"
    ? (user as unknown as TUserPublic)
    : (user as unknown as TUser);
}

export async function deleteManyUsers(
  ids: string[],
  mode: TDataRequestMode = "client",
  sessionUser?: TUserPublic,
) {
  //check permissions
  if (
    (!sessionUser && mode === "client") ||
    (sessionUser && sessionUser.role !== USER_ROLE.SUPERUSER)
  ) {
    throw new PermissionError({
      message: "Permission denied.",
      log: {
        message: "Permission denied to delete user.",
        data: {
          sessionUser,
        },
      },
    });
  }

  try {
    await prisma.user.deleteMany({
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
}
