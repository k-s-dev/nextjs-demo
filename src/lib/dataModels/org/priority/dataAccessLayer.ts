"use server";

import prisma from "@/database/prismaClient";
import { Priority } from "@/generated/prisma/client";
import {
  TServerResponse,
  TServerResponsePromise,
} from "@/lib/types/serverResponse";
import { revalidatePath } from "next/cache";
import { routes } from "@/lib/utils/routeMapper";
import { TPriority, TPriorityFormData } from "./definitions";
import { ERROR_MESSAGES } from "@/lib/constants/others";
import { TUserPublic } from "../../auth/user/definitions";
import { PriorityCreateWithoutWorkspaceInput } from "@/generated/prisma/models";
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
    return `Priority ${name} should be unique ${caseInsensitive ? "(case-insensitive) " : ""}within a workspace.`;
  }

  if (check.name) {
    const priority = await prisma.priority.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
        workspaceId,
      },
    });
    if (priority) errors.push(generateErrorMsg("name"));
  }

  if (check.code) {
    const priority = await prisma.priority.findFirst({
      where: {
        code: {
          equals: code,
          mode: "insensitive",
        },
        workspaceId,
      },
    });
    if (priority) errors.push(generateErrorMsg("code"));
  }

  if (check.order) {
    const priority = await prisma.priority.findUnique({
      where: { workspaceId_order: { order, workspaceId } },
    });
    if (priority) errors.push(generateErrorMsg("order", false));
  }

  if (errors.length > 0) {
    return {
      status: "error",
      errors,
    };
  }

  return null;
}

export async function createPriority<GModel = TPriority>(
  data: PriorityCreateWithoutWorkspaceInput,
  workspaceId: string,
): TServerResponsePromise<GModel> {
  let priority = null;
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
    priority = await prisma.priority.create({
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
    data: priority as GModel,
  };
}

export async function getPriorityById<GModel = Priority>(
  id: string,
): TServerResponsePromise<GModel> {
  let priority;
  const sessionUser = await getSessionUser();

  try {
    priority = await prisma.priority.findUnique({
      where: { id },
    });
  } catch {
    return {
      status: "error",
      errors: [ERROR_MESSAGES.internalServer],
    };
  }

  if (!priority) {
    return {
      status: "error",
      errors: [`Priority (id: ${id}) not found.`],
    };
  }

  const isAllowed = await verifyPermissions(priority.workspaceId, sessionUser);

  if (!isAllowed) {
    return {
      status: "error",
      errors: [ERROR_MESSAGES.unauthorized],
    };
  }

  return {
    status: "success",
    data: priority as GModel,
  };
}

export async function updatePriorityById<GModel = TPriority>(
  id: string,
  data: TPriorityFormData,
): TServerResponsePromise<GModel> {
  let priority = null;
  const sessionUser = await getSessionUser();

  const response = await getPriorityById(id);

  if (response.status === "error") {
    return {
      status: "error",
      errors: ["Priority not found."],
    };
  }

  if (response.status === "success" && response.data) {
    priority = response.data;

    const uniqueResponse = await checkUniqueContraints(
      data.name,
      data.code,
      data.order,
      priority.workspaceId,
      {
        name: data.name.toLowerCase() !== priority.name.toLowerCase(),
        code: data.code.toLowerCase() !== priority.code.toLowerCase(),
        order: data.order !== priority.order,
      },
    );
    if (uniqueResponse) {
      return uniqueResponse as TServerResponse<GModel>;
    }

    const isAllowed = await verifyPermissions(
      priority.workspaceId,
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
    priority = await prisma.priority.update({
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
    data: priority as GModel,
  };
}

export async function deletePriorityById(
  id: string,
): TServerResponsePromise<TPriority> {
  let priority;
  const sessionUser = await getSessionUser();

  const response = await getPriorityById(id);

  if (response.status === "error") {
    return {
      status: "error",
      errors: [`Priority (id: ${id}) not found.`],
    };
  }

  if (response.status === "success" && response.data) {
    priority = response.data;

    const isAllowed = await verifyPermissions(
      priority.workspaceId,
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
    await prisma.priority.delete({ where: { id } });
  } catch {
    return {
      status: "error",
      errors: [ERROR_MESSAGES.internalServer],
    };
  }

  revalidatePath(routes.org.tasks.root);

  return {
    status: "success",
    data: priority,
  };
}

export async function deletePrioritiesByIds(
  ids: string[],
): TServerResponsePromise {
  const response: TServerResponse = { status: "pending" };

  for (const id of ids) {
    let idResponse;
    try {
      idResponse = await deletePriorityById(id);
    } catch {
      response.status = "error";
      updateServerResponseError(response, `Priority (id: ${id}) not found.`);
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
