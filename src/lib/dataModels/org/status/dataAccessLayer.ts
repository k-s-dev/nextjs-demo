"use server";

import prisma from "@/database/prismaClient";
import { Status } from "@/generated/prisma/client";
import {
  TServerResponse,
  TServerResponsePromise,
} from "@/lib/types/serverResponse";
import { revalidatePath } from "next/cache";
import { routes } from "@/lib/utils/routeMapper";
import { TStatus, TStatusFormData } from "./definitions";
import { ERROR_MESSAGES } from "@/lib/constants/others";
import { TUserPublic } from "../../auth/user/definitions";
import { StatusCreateWithoutWorkspaceInput } from "@/generated/prisma/models";
import { getWorkspaceById } from "../workspace/dataAccessLayer";
import { updateServerResponseError } from "@/lib/utils/serverResponse";
import { getSessionUser } from "@/lib/features/authentication/getSessionUser";

async function verifyPermissions(
  workspaceId: string,
  sessionUser: TUserPublic,
) {
  let response = false;
  const workspaceResponse = await getWorkspaceById(workspaceId);

  if (
    workspaceResponse.data?.createdById &&
    workspaceResponse.data.createdById === sessionUser.id
  ) {
    response = true;
  }

  return response;
}

async function checkUniqueContraints(
  name: string,
  code: string,
  order: number,
  workspaceId: string,
  check = { name: true, code: true, order: true },
): Promise<TServerResponse | null> {
  const errors = [];
  function generateErrorMsg(name: string, caseInsensitive: boolean = true) {
    return `Status ${name} should be unique ${caseInsensitive ? "(case-insensitive) " : ""}within a workspace.`;
  }

  if (check.name) {
    const status = await prisma.status.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
        workspaceId,
      },
    });
    if (status) errors.push(generateErrorMsg("name"));
  }

  if (check.code) {
    const status = await prisma.status.findFirst({
      where: {
        code: {
          equals: code,
          mode: "insensitive",
        },
        workspaceId,
      },
    });
    if (status) errors.push(generateErrorMsg("code"));
  }

  if (check.order) {
    const status = await prisma.status.findUnique({
      where: { workspaceId_order: { order, workspaceId } },
    });
    if (status) errors.push(generateErrorMsg("order", false));
  }

  if (errors.length > 0) {
    return {
      status: "error",
      errors,
    };
  }

  return null;
}

export async function createStatus<GModel = TStatus>(
  data: StatusCreateWithoutWorkspaceInput,
  workspaceId: string,
): TServerResponsePromise<GModel> {
  let status = null;
  const sessionUser = await getSessionUser();

  const isAllowed = await verifyPermissions(workspaceId, sessionUser);

  if (!isAllowed) {
    return {
      status: "error",
      errors: [ERROR_MESSAGES.unauthorized],
    };
  }

  const response = await checkUniqueContraints(
    data.name,
    data.code,
    data.order,
    workspaceId,
  );
  if (response) {
    return response as TServerResponse<GModel>;
  }

  try {
    status = await prisma.status.create({
      data: {
        ...data,
        workspace: {
          connect: {
            id: workspaceId,
          },
        },
      },
    });
  } catch (error) {
    // TODO: check console.log
    console.log(error);
    return {
      status: "error",
      errors: [ERROR_MESSAGES.internalServer],
    };
  }

  revalidatePath(routes.org.tasks.root);

  return {
    status: "success",
    data: status as GModel,
  };
}

export async function getStatusById<GModel = Status>(
  id: string,
): TServerResponsePromise<GModel> {
  let status;
  const sessionUser = await getSessionUser();

  try {
    status = await prisma.status.findUnique({
      where: { id },
    });
  } catch {
    return {
      status: "error",
      errors: [ERROR_MESSAGES.internalServer],
    };
  }

  if (!status) {
    return {
      status: "error",
      errors: [`Status (id: ${id}) not found.`],
    };
  }

  const isAllowed = await verifyPermissions(status.workspaceId, sessionUser);

  if (!isAllowed) {
    return {
      status: "error",
      errors: [ERROR_MESSAGES.unauthorized],
    };
  }

  return {
    status: "success",
    data: status as GModel,
  };
}

export async function updateStatusById<GModel = TStatus>(
  id: string,
  data: TStatusFormData,
): TServerResponsePromise<GModel> {
  let status = null;
  const sessionUser = await getSessionUser();

  const response = await getStatusById(id);

  if (response.status === "error") {
    return {
      status: "error",
      errors: ["Status not found."],
    };
  }

  if (response.status === "success" && response.data) {
    status = response.data;

    const uniqueResponse = await checkUniqueContraints(
      data.name,
      data.code,
      data.order,
      status.workspaceId,
      {
        name: data.name.toLowerCase() !== status.name.toLowerCase(),
        code: data.code.toLowerCase() !== status.code.toLowerCase(),
        order: data.order !== status.order,
      },
    );
    if (uniqueResponse) {
      return uniqueResponse as TServerResponse<GModel>;
    }

    const isAllowed = await verifyPermissions(status.workspaceId, sessionUser);
    if (!isAllowed) {
      return {
        status: "error",
        errors: [ERROR_MESSAGES.unauthorized],
      };
    }
  }

  try {
    status = await prisma.status.update({
      where: { id },
      data: { ...data },
    });
  } catch (error) {
    console.log(error);
    return {
      status: "error",
      errors: [ERROR_MESSAGES.internalServer],
    };
  }

  revalidatePath(routes.org.tasks.root);

  return {
    status: "success",
    data: status as GModel,
  };
}

export async function deleteStatusById(
  id: string,
): TServerResponsePromise<TStatus> {
  let status;
  const sessionUser = await getSessionUser();

  const response = await getStatusById(id);

  if (response.status === "error") {
    return {
      status: "error",
      errors: [`Status (id: ${id}) not found.`],
    };
  }

  if (response.status === "success" && response.data) {
    status = response.data;

    const isAllowed = await verifyPermissions(status.workspaceId, sessionUser);
    if (!isAllowed) {
      return {
        status: "error",
        errors: [ERROR_MESSAGES.unauthorized],
      };
    }
  }

  try {
    await prisma.status.delete({ where: { id } });
  } catch {
    return {
      status: "error",
      errors: [ERROR_MESSAGES.internalServer],
    };
  }

  revalidatePath(routes.org.tasks.root);

  return {
    status: "success",
    data: status,
  };
}

export async function deleteStatusesByIds(
  ids: string[],
): TServerResponsePromise {
  const response: TServerResponse = { status: "pending" };

  for (const id of ids) {
    let idResponse;
    try {
      idResponse = await deleteStatusById(id);
    } catch {
      response.status = "error";
      updateServerResponseError(response, `Status (id: ${id}) not found.`);
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
