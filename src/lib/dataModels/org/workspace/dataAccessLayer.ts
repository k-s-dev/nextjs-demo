"use server";

import prisma from "@/database/prismaClient";
import {
  TServerResponse,
  TServerResponsePromise,
} from "@/lib/types/serverResponse";
import { revalidatePath } from "next/cache";
import { routes } from "@/lib/utils/routeMapper";
import {
  TWorkspaceForm,
  workspaceIncludeAll,
  TWorkspaceIncludeAll,
} from "./definitions";
import { ERROR_MESSAGES } from "@/lib/constants/others";
import { TUserPublic } from "../../auth/user/definitions";
import { updateServerResponseError } from "@/lib/utils/serverResponse";
import { getSessionUser } from "@/lib/features/authentication/getSessionUser";

async function verifyPermissions(
  workspaceCreatedById: string,
  sessionUser: TUserPublic,
) {
  let response = false;

  if (workspaceCreatedById === sessionUser.id) response = true;

  return response;
}

export async function createWorkspace<GModel = TWorkspaceIncludeAll>(
  name: string,
  description?: string,
): TServerResponsePromise<GModel> {
  let workspace = null;
  const sessionUser = await getSessionUser();

  workspace = await prisma.workspace.findUnique({
    where: {
      name,
    },
  });

  if (workspace) {
    return {
      status: "error",
      errors: ["Workspace with this name already exists."],
    };
  }

  try {
    workspace = await prisma.workspace.create({
      data: {
        name,
        description,
        createdBy: {
          connectOrCreate: {
            create: { userId: sessionUser.id },
            where: { userId: sessionUser.id },
          },
        },
        categories: {
          create: [{ name: "Other" }],
        },
        statuses: {
          create: [
            { name: "Todo", code: "T", group: 1, order: 1 },
            { name: "In-progress", code: "I", group: 2, order: 2 },
            { name: "Cancelled", code: "C", group: 3, order: 3 },
            { name: "Done", code: "D", group: 3, order: 4, isCompletion: true },
          ],
        },
        priorities: {
          create: [
            { name: "Low", code: "L", group: 1, order: 1 },
            { name: "Medium", code: "M", group: 2, order: 2 },
            { name: "High", code: "H", group: 3, order: 3 },
          ],
        },
      },
    });
  } catch {
    return {
      status: "error",
      errors: [ERROR_MESSAGES.internalServer],
    };
  }

  revalidatePath(routes.org.tasks.root);

  return {
    status: "success",
    data: workspace as GModel,
  };
}

export async function getWorkspaceById<GModel = TWorkspaceIncludeAll>(
  id: string,
): TServerResponsePromise<GModel> {
  let workspace;
  const sessionUser = await getSessionUser();

  try {
    workspace = await prisma.workspace.findUnique({
      where: { id },
      include: workspaceIncludeAll,
    });
  } catch {
    return {
      status: "error",
      errors: [ERROR_MESSAGES.internalServer],
    };
  }

  if (!workspace) {
    return {
      status: "error",
      errors: ["Workspace not found."],
    };
  }

  const isAllowed = await verifyPermissions(workspace.createdById, sessionUser);
  if (!isAllowed) {
    return {
      status: "error",
      errors: [ERROR_MESSAGES.unauthorized],
    };
  }

  return {
    status: "success",
    data: workspace as GModel,
  };
}

export async function getWorkspacesByCreatedById<
  GModel = TWorkspaceIncludeAll,
>(): TServerResponsePromise<GModel[]> {
  let workspaces;
  const sessionUser = await getSessionUser();

  try {
    workspaces = await prisma.workspace.findMany({
      where: {
        createdById: sessionUser.id,
      },
      include: workspaceIncludeAll,
    });
  } catch {
    return {
      status: "error",
      errors: [ERROR_MESSAGES.internalServer],
    };
  }

  return {
    status: "success",
    data: workspaces as GModel[],
  };
}

export async function updateWorkspaceById<GModel = TWorkspaceIncludeAll>(
  id: string,
  data: TWorkspaceForm,
): TServerResponsePromise<GModel> {
  let workspace = null;
  const sessionUser = await getSessionUser();

  const response = await getWorkspaceById(id);

  if (response.status === "error") {
    return {
      status: "error",
      errors: ["Workspace not found."],
    };
  }

  if (response.status === "success") {
    workspace = response.data as TWorkspaceIncludeAll;

    const isAllowed = await verifyPermissions(
      workspace.createdById,
      sessionUser,
    );
    if (!isAllowed) {
      return {
        status: "error",
        errors: [ERROR_MESSAGES.unauthorized],
      };
    }
  }

  try {
    workspace = await prisma.workspace.update({
      where: { id },
      data: data,
    });
  } catch {
    return {
      status: "error",
      errors: [ERROR_MESSAGES.internalServer],
    };
  }

  revalidatePath(routes.org.tasks.root);

  return {
    status: "success",
    data: workspace as GModel,
  };
}

export async function deleteWorkspaceById(
  id: string,
): TServerResponsePromise<TWorkspaceIncludeAll> {
  let response;
  const sessionUser = await getSessionUser();

  try {
    response = await getWorkspaceById(id);
  } catch {
    return {
      status: "error",
      errors: [ERROR_MESSAGES.internalServer],
    };
  }

  if (response.status === "error" || !response.data) {
    return {
      status: "error",
      errors: [`Workspace with id: ${id} not found.`],
    };
  }

  const workspace = response.data;

  const isAllowed = await verifyPermissions(workspace.createdById, sessionUser);
  if (!isAllowed) {
    return {
      status: "error",
      errors: [ERROR_MESSAGES.unauthorized],
    };
  }

  try {
    await prisma.workspace.delete({ where: { id } });
  } catch {
    return {
      status: "error",
      errors: [ERROR_MESSAGES.internalServer],
    };
  }

  revalidatePath(routes.org.tasks.root);

  return {
    status: "success",
    data: workspace,
  };
}

export async function deleteWorkspacesByIds(
  ids: string[],
): TServerResponsePromise {
  const response: TServerResponse = { status: "pending" };

  for (const id of ids) {
    let idResponse;
    try {
      idResponse = await deleteWorkspaceById(id);
    } catch {
      response.status = "error";
      updateServerResponseError(response, `Workspace (id: ${id}) not found.`);
    }

    if (idResponse?.status === "error") {
      response.status = "error";
      updateServerResponseError(response, idResponse.errors);
    }
  }

  revalidatePath(routes.org.tasks.root);

  if (response.status === "error") {
    return response;
  }

  return {
    status: "success",
  };
}
