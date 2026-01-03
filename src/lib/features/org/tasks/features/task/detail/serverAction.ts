"use server";

import * as v from "valibot";
import { parseFormData } from "@/lib/utils/form";
import { revalidatePath } from "next/cache";
import { routes } from "@/lib/utils/routeMapper";
import sanitizeHtml from "sanitize-html";
import {
  TTaskFormState,
  VSTaskForm,
} from "@/lib/dataModels/org/task/definitions";
import {
  getTaskById,
  updateTaskById,
} from "@/lib/dataModels/org/task/dataAccessLayer";

export async function taskUpdateServerAction(
  id: string,
  categoryId: string,
  tagIds: string[],
  prevState: TTaskFormState | null,
  formData: FormData,
): Promise<TTaskFormState> {
  // retreive data
  const parsedFormData = parseFormData({
    formData,
    info: {
      dates: ["start_date", "end_date", "estimated_start", "estimated_end"],
    },
  });

  // Validate form
  const validationResult = v.safeParse(VSTaskForm, parsedFormData);

  // handle validation errors
  if (!validationResult.success) {
    const errors = v.flatten<typeof VSTaskForm>(validationResult.issues);
    return {
      ...prevState,
      status: "error",
      data: parsedFormData,
      errors: errors,
    };
  }

  const validatedData = validationResult.output;

  // prepare form data for submission to backend
  let response;

  try {
    response = await getTaskById(id);
  } catch {
    return {
      status: "error",
      data: parsedFormData,
      errors: {
        root: [
          "Failed to update user due to internal server error. Please try again.",
        ],
      },
    };
  }

  if (response.status !== "success" || !response.data) {
    return {
      status: "error",
      data: parsedFormData,
      errors: {
        root: [
          "Failed to update user due to internal server error. Please try again.",
        ],
      },
    };
  }

  const apiSubmissionData = {
    ...validatedData,
    description: sanitizeHtml(validatedData.description || ""),
  };

  // try submitting data to backend
  try {
    await updateTaskById(id, categoryId, apiSubmissionData, tagIds);
  } catch (error) {
    console.log(error);
    return {
      status: "error",
      data: parsedFormData,
      errors: {
        root: [
          "Failed to update user due to internal server error. Please try again.",
        ],
      },
    };
  }

  revalidatePath(routes.org.tasks.root);

  return {
    status: "success",
    data: parsedFormData,
  };
}
