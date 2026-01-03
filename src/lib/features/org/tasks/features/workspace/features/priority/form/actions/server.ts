"use server";

import * as v from "valibot";
import { parseFormData, prepareValibotErrors } from "@/lib/utils/form";
import { revalidatePath } from "next/cache";
import { routes } from "@/lib/utils/routeMapper";
import {
  TPriorityFormData,
  TPriorityFormState,
  VSPriorityForm,
} from "@/lib/dataModels/org/priority/definitions";
import {
  createPriority,
  updatePriorityById,
} from "@/lib/dataModels/org/priority/dataAccessLayer";
import { TWorkspaceIncludeAll } from "@/lib/dataModels/org/workspace/definitions";
import { ERROR_MESSAGES } from "@/lib/constants/others";

export async function priorityServerAction(
  id: string | undefined,
  workspace: TWorkspaceIncludeAll,
  mode: "create" | "update",
  prevState: TPriorityFormState | null,
  formData: FormData,
): Promise<TPriorityFormState> {
  // parse form data
  const parsedFormData = parseFormData({
    formData,
    info: { numbers: ["order", "group"] },
  });

  // Validate data
  const validationResult = v.safeParse(VSPriorityForm, parsedFormData);

  // handle validation errors
  if (!validationResult.success) {
    const errors = v.flatten<typeof VSPriorityForm>(validationResult.issues);
    return {
      ...prevState,
      status: "error",
      data: parsedFormData as TPriorityFormData,
      errors: errors,
    };
  }

  const validatedData = validationResult.output;

  // prepare data for submission to backend
  const apiSubmissionData = {
    ...validatedData,
  };

  // try submitting data to backend
  let response;

  if (mode === "create") {
    response = await createPriority(apiSubmissionData, workspace.id);
  }

  if (mode === "update" && id) {
    response = await updatePriorityById(id, apiSubmissionData);
  }

  if (response?.status === "success") {
    revalidatePath(routes.org.tasks.root);
    return {
      status: "success",
      data:
        mode === "update" ? (parsedFormData as TPriorityFormData) : undefined,
    };
  }

  return {
    status: "error",
    data: parsedFormData as TPriorityFormData,
    errors: {
      root: response?.errors
        ? prepareValibotErrors(response.errors)
        : [ERROR_MESSAGES.internalServer],
    },
  };
}
