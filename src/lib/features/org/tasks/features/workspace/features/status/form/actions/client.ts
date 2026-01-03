import * as v from "valibot";
import { parseFormData } from "@/lib/utils/form";
import { statusServerAction } from "./server";
import { TWorkspaceIncludeAll } from "@/lib/dataModels/org/workspace/definitions";
import {
  TStatusFormData,
  TStatusFormState,
  VSStatusForm,
} from "@/lib/dataModels/org/status/definitions";

export async function statusClientAction(
  id: string | undefined,
  workspace: TWorkspaceIncludeAll,
  mode: "create" | "update",
  prevState: TStatusFormState | null,
  formData: FormData,
): Promise<TStatusFormState> {
  const parsedFormData = parseFormData({
    formData,
    info: { numbers: ["order", "group"] },
  });

  const validationResult = v.safeParse(VSStatusForm, parsedFormData);
  if (!validationResult.success) {
    const errors = v.flatten<typeof VSStatusForm>(validationResult.issues);
    return {
      ...prevState,
      status: "error",
      data: parsedFormData as TStatusFormData,
      errors: errors,
    };
  }

  return await statusServerAction(id, workspace, mode, prevState, formData);
}
