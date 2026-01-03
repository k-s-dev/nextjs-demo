"use server";

import { ERROR_MESSAGES } from "@/lib/constants/others";
import { updateTaskById } from "@/lib/dataModels/org/task/dataAccessLayer";
import { TTaskUi } from "@/lib/dataModels/org/task/definitions";
import { getSessionUser } from "@/lib/features/authentication/getSessionUser";
import { TServerResponse } from "@/lib/types/serverResponse";
import { routes } from "@/lib/utils/routeMapper";
import { revalidatePath } from "next/cache";

export async function addTagsToTask({
  task,
  tagNames,
}: {
  task: TTaskUi;
  tagNames: string;
}) {
  const sessionUser = await getSessionUser();
  const response: TServerResponse = { status: "pending" };

  tagNames.split(",").forEach(async (tagName) => {
    if (tagName.trim().length > 0) {
      try {
        await updateTaskById(task.id, task.categoryId, {
          tags: {
            connectOrCreate: {
              create: { name: tagName.trim(), createdById: sessionUser.id },
              where: {
                createdById_name: {
                  name: tagName.trim(),
                  createdById: sessionUser.id,
                },
              },
            },
          },
        });
        response.status = "success";
      } catch {
        response.status = "error";
        response.errors = [ERROR_MESSAGES.internalServer];
      }
    }
  });

  revalidatePath(routes.org.tasks.root);

  return response;
}
