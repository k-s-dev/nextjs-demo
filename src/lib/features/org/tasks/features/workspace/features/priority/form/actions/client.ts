import * as v from "valibot";
import { parseFormData } from "@/lib/utils/form";
import { priorityServerAction } from "./server";
import { TWorkspaceIncludeAll } from "@/lib/dataModels/org/workspace/definitions";
import {
  TPriorityFormData,
  TPriorityFormState,
  VSPriorityForm,
} from "@/lib/dataModels/org/priority/definitions";

export async function priorityClientAction(
  id: string | undefined,
  workspace: TWorkspaceIncludeAll,
  mode: "create" | "update",
  prevState: TPriorityFormState | null,
  formData: FormData,
): Promise<TPriorityFormState> {
  const parsedFormData = parseFormData({
    formData,
    info: { numbers: ["order", "group"] },
  });

  const validationResult = v.safeParse(VSPriorityForm, parsedFormData);
  if (!validationResult.success) {
    const errors = v.flatten<typeof VSPriorityForm>(validationResult.issues);
    return {
      ...prevState,
      status: "error",
      data: parsedFormData as TPriorityFormData,
      errors: errors,
    };
  }

  return await priorityServerAction(id, workspace, mode, prevState, formData);
}
