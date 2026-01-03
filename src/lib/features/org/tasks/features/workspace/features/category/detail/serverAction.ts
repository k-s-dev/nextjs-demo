"use server";

import * as v from "valibot";
import { parseFormData } from "@/lib/utils/form";
import { revalidatePath } from "next/cache";
import { routes } from "@/lib/utils/routeMapper";
import sanitizeHtml from "sanitize-html";
import {
  TCategoryFormState,
  VSCategoryForm,
} from "@/lib/dataModels/org/category/definitions";
import {
  getCategoryById,
  updateCategoryById,
} from "@/lib/dataModels/org/category/dataAccessLayer";

export async function categoryUpdateServerAction(
  id: string,
  prevState: TCategoryFormState | null,
  formData: FormData,
): Promise<TCategoryFormState> {
  // retreive data
  const parsedFormData = parseFormData({
    formData,
    info: {
      numbers: ["order"],
    },
  });

  // Validate form
  const validationResult = v.safeParse(VSCategoryForm, parsedFormData);

  // handle validation errors
  if (!validationResult.success) {
    const errors = v.flatten<typeof VSCategoryForm>(validationResult.issues);
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
    response = await getCategoryById(id);
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
    ...response.data,
    description: sanitizeHtml(validatedData.description || ""),
  };

  // try submitting data to backend
  try {
    await updateCategoryById(id, apiSubmissionData);
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

  revalidatePath(routes.org.root);
  return {
    status: "success",
    data: parsedFormData,
  };
}
