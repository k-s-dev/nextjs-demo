"use server";

import prisma from "@/database/prismaClient";
import { Category } from "@/generated/prisma/client";
import {
  TServerResponse,
  TServerResponsePromise,
} from "@/lib/types/serverResponse";
import { revalidatePath } from "next/cache";
import { routes } from "@/lib/utils/routeMapper";
import { TCategory } from "./definitions";
import { ERROR_MESSAGES } from "@/lib/constants/others";
import {
  CategoryCreateWithoutWorkspaceInput,
  CategoryUpdateInput,
} from "@/generated/prisma/models";
import { getWorkspaceById } from "../workspace/dataAccessLayer";
import { updateServerResponseError } from "@/lib/utils/serverResponse";
import { getSessionUser } from "@/lib/features/authentication/getSessionUser";

async function verifyPermissions(workspaceId: string) {
  let response = false;
  const sessionUser = await getSessionUser();

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
  workspaceId: string,
  parentId?: string | null,
  check = { name: true },
): Promise<TServerResponse | null> {
  const errors = [];
  function generateErrorMsg(name: string, caseInsensitive: boolean = true) {
    return `Category ${name} should be unique ${caseInsensitive ? "(case-insensitive) " : ""}within a workspace and parent (if exists).`;
  }

  if (check.name) {
    const category = await prisma.category.findFirst({
      where: {
        AND: {
          name: {
            equals: name,
            mode: "insensitive",
          },
          parentId,
          workspaceId,
        },
      },
    });
    if (category) errors.push(generateErrorMsg("name"));
  }

  if (errors.length > 0) {
    return {
      status: "error",
      errors,
    };
  }

  return null;
}

export async function createCategory<GModel = TCategory>(
  data: CategoryCreateWithoutWorkspaceInput,
  workspaceId: string,
  parentId?: string | null,
): TServerResponsePromise<GModel> {
  let category = null;

  const isAllowed = await verifyPermissions(workspaceId);

  if (!isAllowed) {
    return {
      status: "error",
      errors: [ERROR_MESSAGES.unauthorized],
    };
  }

  const response = await checkUniqueContraints(
    data.name,
    workspaceId,
    parentId,
  );
  if (response) {
    return response as TServerResponse<GModel>;
  }

  try {
    if (parentId) {
      category = await prisma.category.create({
        data: {
          ...data,
          workspace: {
            connect: {
              id: workspaceId,
            },
          },
          parent: {
            connect: {
              id: parentId,
            },
          },
        },
      });
    } else {
      category = await prisma.category.create({
        data: {
          ...data,
          workspace: {
            connect: {
              id: workspaceId,
            },
          },
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
    data: category as GModel,
  };
}

export async function getCategoryById<GModel = Category>(
  id: string,
): TServerResponsePromise<GModel> {
  let category;

  try {
    category = await prisma.category.findUnique({
      where: { id },
    });
  } catch {
    return {
      status: "error",
      errors: [ERROR_MESSAGES.internalServer],
    };
  }

  if (!category) {
    return {
      status: "error",
      errors: [`Category (id: ${id}) not found.`],
    };
  }

  const isAllowed = await verifyPermissions(category.workspaceId);

  if (!isAllowed) {
    return {
      status: "error",
      errors: [ERROR_MESSAGES.unauthorized],
    };
  }

  return {
    status: "success",
    data: category as GModel,
  };
}

export async function updateCategoryById<GModel = Category>(
  id: string,
  data: CategoryUpdateInput,
): TServerResponsePromise<GModel> {
  let category = null;

  const response = await getCategoryById(id);

  if (response.status === "error") {
    return {
      status: "error",
      errors: ["Category not found."],
    };
  }

  if (response.status === "success" && response.data) {
    category = response.data;
    const name = data.name as string;

    const uniqueResponse = await checkUniqueContraints(
      name,
      category.workspaceId,
      category.parentId,
      {
        name: name.toLowerCase() !== category.name.toLowerCase(),
      },
    );
    if (uniqueResponse) {
      return uniqueResponse as TServerResponse<GModel>;
    }

    const isAllowed = await verifyPermissions(category.workspaceId);
    if (!isAllowed) {
      return {
        status: "error",
        errors: [ERROR_MESSAGES.unauthorized],
      };
    }
  }

  try {
    category = await prisma.category.update({
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
    data: category as GModel,
  };
}

export async function deleteCategoryById(
  id: string,
): TServerResponsePromise<Category> {
  let category;

  const response = await getCategoryById(id);

  if (response.status === "error") {
    return {
      status: "error",
      errors: [`Category (id: ${id}) not found.`],
    };
  }

  if (response.status === "success" && response.data) {
    category = response.data;

    const isAllowed = await verifyPermissions(category.workspaceId);
    if (!isAllowed) {
      return {
        status: "error",
        errors: [ERROR_MESSAGES.unauthorized],
      };
    }
  }

  try {
    await prisma.category.delete({ where: { id } });
  } catch {
    return {
      status: "error",
      errors: [ERROR_MESSAGES.internalServer],
    };
  }

  revalidatePath(routes.org.tasks.root);

  return {
    status: "success",
    data: category,
  };
}

export async function deleteCategoriesByIds(
  ids: string[],
): TServerResponsePromise {
  const response: TServerResponse = { status: "pending" };

  for (const id of ids) {
    let idResponse;
    try {
      idResponse = await deleteCategoryById(id);
    } catch {
      response.status = "error";
      updateServerResponseError(response, `Category (id: ${id}) not found.`);
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
