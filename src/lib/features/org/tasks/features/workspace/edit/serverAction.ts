"use server";

import * as v from "valibot";
import { parseFormData } from "@/lib/utils/form";
import { revalidatePath } from "next/cache";
import { routes } from "@/lib/utils/routeMapper";
import { redirect } from "next/navigation";
import sanitizeHtml from "sanitize-html";
import {
  TWorkspaceFormState,
  VSWorkspaceForm,
} from "@/lib/dataModels/org/workspace/definitions";
import { updateWorkspaceById } from "@/lib/dataModels/org/workspace/dataAccessLayer";

export async function workspaceUpdateServerAction(
  id: string,
  prevState: TWorkspaceFormState | null,
  formData: FormData,
): Promise<TWorkspaceFormState> {
  // retreive data
  const parsedFormData = parseFormData({ formData });

  // Validate form
  const validationResult = v.safeParse(VSWorkspaceForm, parsedFormData);

  // handle validation errors
  if (!validationResult.success) {
    const errors = v.flatten<typeof VSWorkspaceForm>(validationResult.issues);
    return {
      ...prevState,
      status: "error",
      data: parsedFormData,
      errors: errors,
    };
  }

  const validatedData = validationResult.output;

  // prepare form data for submission to backend
  const apiSubmissionData = {
    ...validatedData,
    description: sanitizeHtml(validatedData.description || ""),
  };

  // try submitting data to backend
  try {
    await updateWorkspaceById(id, apiSubmissionData);
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
  redirect(routes.org.tasks.workspace.withId(id));
}
