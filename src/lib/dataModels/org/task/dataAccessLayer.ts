"use server";

import prisma from "@/database/prismaClient";
import { Task } from "@/generated/prisma/client";
import {
  TServerResponse,
  TServerResponsePromise,
} from "@/lib/types/serverResponse";
import { revalidatePath } from "next/cache";
import { routes } from "@/lib/utils/routeMapper";
import { TTask, TTaskIncludeAll, TTaskInput } from "./definitions";
import { ERROR_MESSAGES } from "@/lib/constants/others";
import { TUserPublic } from "../../auth/user/definitions";
import { updateServerResponseError } from "@/lib/utils/serverResponse";
import { getWorkspaceById } from "../workspace/dataAccessLayer";
import { TaskUpdateInput } from "@/generated/prisma/models";
import { getSessionUser } from "@/lib/features/authentication/getSessionUser";

async function verifyPermissions(categoryId: string, sessionUser: TUserPublic) {
  let response = false;
  let category;
  let workspaceResponse;

  try {
    category = await prisma.category.findUnique({ where: { id: categoryId } });
  } catch {
    response = false;
  }

  if (category) {
    workspaceResponse = await getWorkspaceById(category.workspaceId);
  }

  if (
    workspaceResponse &&
    workspaceResponse.data?.createdById &&
    workspaceResponse.data.createdById === sessionUser.id
  ) {
    response = true;
  }

  return response;
}

async function checkUniqueContraints(
  title: string,
  categoryId: string,
  parentId?: string | null,
  check = { title: true },
): Promise<TServerResponse | null> {
  const errors = [];
  function generateErrorMsg(title: string, caseInsensitive: boolean = true) {
    return `Task ${title} should be unique ${caseInsensitive ? "(case-insensitive) " : ""}within a category and parent (if exists).`;
  }

  if (check.title) {
    const task = await prisma.task.findFirst({
      where: {
        AND: {
          title: {
            equals: title,
            mode: "insensitive",
          },
          parentId,
          categoryId,
        },
      },
    });
    if (task) errors.push(generateErrorMsg("title"));
  }

  if (errors.length > 0) {
    return {
      status: "error",
      errors,
    };
  }

  return null;
}

export async function createTask<GModel = TTask>(
  data: TTaskInput,
  categoryId: string,
  priorityId: string,
  statusId: string,
  parentId?: string | null,
): TServerResponsePromise<GModel> {
  let task = null;
  const sessionUser = await getSessionUser();

  const isAllowed = await verifyPermissions(categoryId, sessionUser);

  if (!isAllowed) {
    return {
      status: "error",
      errors: [ERROR_MESSAGES.unauthorized],
    };
  }

  const response = await checkUniqueContraints(
    data.title,
    categoryId,
    parentId,
  );
  if (response) {
    return response as TServerResponse<GModel>;
  }

  try {
    if (parentId) {
      task = await prisma.task.create({
        data: {
          ...data,
          createdBy: { connect: { userId: sessionUser.id } },
          category: { connect: { id: categoryId } },
          priority: { connect: { id: priorityId } },
          status: { connect: { id: statusId } },
          parent: { connect: { id: parentId } },
        },
      });
    } else {
      task = await prisma.task.create({
        data: {
          ...data,
          createdBy: { connect: { userId: sessionUser.id } },
          category: { connect: { id: categoryId } },
          priority: { connect: { id: priorityId } },
          status: { connect: { id: statusId } },
        },
      });
    }
  } catch {
    return {
      status: "error",
      errors: [ERROR_MESSAGES.internalServer],
    };
  }

  revalidatePath(routes.org.tasks.root);

  return {
    status: "success",
    data: task as GModel,
  };
}

export async function getTaskById<GModel = TTaskIncludeAll>(
  id: string,
): TServerResponsePromise<GModel> {
  let task;
  const sessionUser = await getSessionUser();

  try {
    task = await prisma.task.findUnique({
      where: { id },
      include: taskIncludeAll,
    });
  } catch {
    return {
      status: "error",
      errors: [ERROR_MESSAGES.internalServer],
    };
  }

  if (!task) {
    return {
      status: "error",
      errors: [`Task (id: ${id}) not found.`],
    };
  }

  const isAllowed = await verifyPermissions(task.categoryId, sessionUser);

  if (!isAllowed) {
    return {
      status: "error",
      errors: [ERROR_MESSAGES.unauthorized],
    };
  }

  return {
    status: "success",
    data: task as GModel,
  };
}

export async function getTasksByCreatedById<
  GModel = TTaskIncludeAll,
>(): TServerResponsePromise<GModel[]> {
  let tasks;
  const sessionUser = await getSessionUser();

  try {
    tasks = await prisma.task.findMany({
      where: {
        createdById: sessionUser.id,
      },
      include: taskIncludeAll,
    });
  } catch {
    return {
      status: "error",
      errors: [ERROR_MESSAGES.internalServer],
    };
  }

  return {
    status: "success",
    data: tasks as GModel[],
  };
}

export async function updateTaskById<GModel = Task>(
  id: string,
  categoryId: string,
  data: TaskUpdateInput,
  tagIds: string[] = [],
): TServerResponsePromise<GModel> {
  let task = null;
  const sessionUser = await getSessionUser();

  const response = await getTaskById(id);

  if (response.status === "error") {
    return {
      status: "error",
      errors: ["Task not found."],
    };
  }

  if (response.status === "success" && response.data && data.title) {
    task = response.data;
    const title = data.title as string;

    const uniqueResponse = await checkUniqueContraints(
      title,
      task.categoryId,
      task.parentId,
      {
        title: title.toLowerCase() !== task.title.toLowerCase(),
      },
    );
    if (uniqueResponse) {
      return uniqueResponse as TServerResponse<GModel>;
    }

    const isAllowed = await verifyPermissions(categoryId, sessionUser);
    if (!isAllowed) {
      return {
        status: "error",
        errors: [ERROR_MESSAGES.unauthorized],
      };
    }
  }

  try {
    task = await prisma.task.update({
      where: { id },
      data: {
        ...data,
        tags: {
          connect: tagIds.map((id) => {
            return { id };
          }),
        },
      },
    });
    if (tagIds.length === 0) {
      await prisma.task.update({
        where: { id },
        data: {
          tags: { set: [] },
        },
      });
    }
  } catch {
    return {
      status: "error",
      errors: [ERROR_MESSAGES.internalServer],
    };
  }

  revalidatePath(routes.org.tasks.root);

  return {
    status: "success",
    data: task as GModel,
  };
}

export async function deleteTaskById(id: string): TServerResponsePromise<Task> {
  let task;
  const sessionUser = await getSessionUser();

  const response = await getTaskById(id);

  if (response.status === "error") {
    return {
      status: "error",
      errors: [`Task (id: ${id}) not found.`],
    };
  }

  if (response.status === "success" && response.data) {
    task = response.data;

    const isAllowed = await verifyPermissions(task.categoryId, sessionUser);
    if (!isAllowed) {
      return {
        status: "error",
        errors: [ERROR_MESSAGES.unauthorized],
      };
    }
  }

  try {
    await prisma.task.delete({ where: { id } });
  } catch {
    return {
      status: "error",
      errors: [ERROR_MESSAGES.internalServer],
    };
  }

  revalidatePath(routes.org.tasks.root);

  return {
    status: "success",
    data: task,
  };
}

export async function deleteTasksByIds(ids: string[]): TServerResponsePromise {
  const response: TServerResponse = { status: "pending" };

  for (const id of ids) {
    let idResponse;
    try {
      idResponse = await deleteTaskById(id);
    } catch {
      response.status = "error";
      updateServerResponseError(response, `Task (id: ${id}) not found.`);
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

const taskIncludeAll = {
  children: true,
  parent: true,
  category: true,
  tags: true,
  status: true,
  priority: true,
};
