"use server";

import * as v from "valibot";
import { parseFormData, prepareValibotErrors } from "@/lib/utils/form";
import { revalidatePath } from "next/cache";
import { routes } from "@/lib/utils/routeMapper";
import { ERROR_MESSAGES } from "@/lib/constants/others";
import { TWorkspaceIncludeAll } from "@/lib/dataModels/org/workspace/definitions";
import {
  TStatusFormData,
  TStatusFormState,
  VSStatusForm,
} from "@/lib/dataModels/org/status/definitions";
import {
  createStatus,
  updateStatusById,
} from "@/lib/dataModels/org/status/dataAccessLayer";

export async function statusServerAction(
  id: string | undefined,
  workspace: TWorkspaceIncludeAll,
  mode: "create" | "update",
  prevState: TStatusFormState | null,
  formData: FormData,
): Promise<TStatusFormState> {
  // parse form data
  const parsedFormData = parseFormData({
    formData,
    info: { numbers: ["order", "group"] },
  });

  // Validate data
  const validationResult = v.safeParse(VSStatusForm, parsedFormData);

  // handle validation errors
  if (!validationResult.success) {
    const errors = v.flatten<typeof VSStatusForm>(validationResult.issues);
    return {
      ...prevState,
      status: "error",
      data: parsedFormData as TStatusFormData,
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
    response = await createStatus(apiSubmissionData, workspace.id);
  }

  if (mode === "update" && id) {
    response = await updateStatusById(id, apiSubmissionData);
  }

  if (response?.status === "success") {
    revalidatePath(routes.org.tasks.root);
    return {
      status: "success",
      data: mode === "update" ? (parsedFormData as TStatusFormData) : undefined,
    };
  }

  return {
    status: "error",
    data: parsedFormData as TStatusFormData,
    errors: {
      root: response?.errors
        ? prepareValibotErrors(response.errors)
        : [ERROR_MESSAGES.internalServer],
    },
  };
}
