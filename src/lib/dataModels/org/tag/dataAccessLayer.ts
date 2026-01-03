"use server";

import prisma from "@/database/prismaClient";
import { Tag } from "@/generated/prisma/client";
import {
  TServerResponse,
  TServerResponsePromise,
} from "@/lib/types/serverResponse";
import { revalidatePath } from "next/cache";
import { routes } from "@/lib/utils/routeMapper";
import { TTag, TTagFormData } from "./definitions";
import { ERROR_MESSAGES } from "@/lib/constants/others";
import { TUserPublic } from "../../auth/user/definitions";
import { TagCreateManyCreatedByInput } from "@/generated/prisma/models";
import { updateServerResponseError } from "@/lib/utils/serverResponse";
import { getSessionUser } from "@/lib/features/authentication/getSessionUser";

async function verifyPermissions(
  createdById: string,
  sessionUser: TUserPublic,
) {
  let response = false;

  if (createdById === sessionUser.id) response = true;

  return response;
}

async function checkUniqueContraints(
  name: string,
  createdById: string,
  check = { name: true },
): Promise<TServerResponse | null> {
  const errors = [];
  function generateErrorMsg(name: string, caseInsensitive: boolean = true) {
    return `Tag ${name} should be unique ${caseInsensitive ? "(case-insensitive) " : ""}within a workspace.`;
  }

  if (check.name) {
    const tag = await prisma.tag.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
        createdById,
      },
    });
    if (tag) errors.push(generateErrorMsg("name"));
  }

  if (errors.length > 0) {
    return {
      status: "error",
      errors,
    };
  }

  return null;
}

export async function createTag<GModel = Tag>(
  data: TagCreateManyCreatedByInput,
): TServerResponsePromise<GModel> {
  let tag = null;
  const sessionUser = await getSessionUser();
  const createdById = sessionUser.id;

  const isAllowed = await verifyPermissions(createdById, sessionUser);

  if (!isAllowed) {
    return {
      status: "error",
      errors: [ERROR_MESSAGES.unauthorized],
    };
  }

  const response = await checkUniqueContraints(data.name, createdById);
  if (response) {
    return response as TServerResponse<GModel>;
  }

  try {
    tag = await prisma.tag.create({
      data: {
        ...data,
        createdBy: {
          connectOrCreate: {
            create: { userId: sessionUser.id },
            where: { userId: sessionUser.id },
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
    data: tag as GModel,
  };
}

export async function getTagById<GModel = Tag>(
  id: string,
): TServerResponsePromise<GModel> {
  let tag;
  const sessionUser = await getSessionUser();

  try {
    tag = await prisma.tag.findUnique({
      where: { id },
    });
  } catch {
    return {
      status: "error",
      errors: [ERROR_MESSAGES.internalServer],
    };
  }

  if (!tag) {
    return {
      status: "error",
      errors: [`Tag (id: ${id}) not found.`],
    };
  }

  const isAllowed = await verifyPermissions(tag.createdById, sessionUser);

  if (!isAllowed) {
    return {
      status: "error",
      errors: [ERROR_MESSAGES.unauthorized],
    };
  }

  return {
    status: "success",
    data: tag as GModel,
  };
}

export async function getTagsByCreatedById<
  GModel = Tag,
>(): TServerResponsePromise<GModel[]> {
  let tags;
  const sessionUser = await getSessionUser();

  try {
    tags = await prisma.tag.findMany({
      where: { createdById: sessionUser.id },
    });
  } catch {
    return {
      status: "error",
      errors: [ERROR_MESSAGES.internalServer],
    };
  }

  if (!tags) {
    return {
      status: "error",
      errors: ["No tags found."],
    };
  }

  return {
    status: "success",
    data: tags as GModel[],
  };
}

export async function updateTagById<GModel = TTag>(
  id: string,
  data: TTagFormData,
): TServerResponsePromise<GModel> {
  let tag = null;
  const sessionUser = await getSessionUser();

  const response = await getTagById(id);

  if (response.status === "error") {
    return {
      status: "error",
      errors: ["Tag not found."],
    };
  }

  if (response.status === "success" && response.data) {
    tag = response.data;

    const uniqueResponse = await checkUniqueContraints(
      data.name,
      tag.createdById,
      {
        name: data.name.toLowerCase() !== tag.name.toLowerCase(),
      },
    );
    if (uniqueResponse) {
      return uniqueResponse as TServerResponse<GModel>;
    }

    const isAllowed = await verifyPermissions(tag.createdById, sessionUser);
    if (!isAllowed) {
      return {
        status: "error",
        errors: [ERROR_MESSAGES.unauthorized],
      };
    }
  }

  try {
    tag = await prisma.tag.update({
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
    data: tag as GModel,
  };
}

export async function deleteTagById(id: string): TServerResponsePromise<TTag> {
  let tag;
  const sessionUser = await getSessionUser();

  const response = await getTagById(id);

  if (response.status === "error") {
    return {
      status: "error",
      errors: [`Tag (id: ${id}) not found.`],
    };
  }

  if (response.status === "success" && response.data) {
    tag = response.data;

    const isAllowed = await verifyPermissions(tag.createdById, sessionUser);
    if (!isAllowed) {
      return {
        status: "error",
        errors: [ERROR_MESSAGES.unauthorized],
      };
    }
  }

  try {
    await prisma.tag.delete({ where: { id } });
  } catch {
    return {
      status: "error",
      errors: [ERROR_MESSAGES.internalServer],
    };
  }

  revalidatePath(routes.org.tasks.root);

  return {
    status: "success",
    data: tag,
  };
}

export async function deleteTagsByIds(ids: string[]): TServerResponsePromise {
  const response: TServerResponse = { status: "pending" };

  for (const id of ids) {
    let idResponse;
    try {
      idResponse = await deleteTagById(id);
    } catch {
      response.status = "error";
      updateServerResponseError(response, `Tag (id: ${id}) not found.`);
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
