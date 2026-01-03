import * as v from "valibot";
import { parseFormData } from "@/lib/utils/form";
import { workspaceUpdateServerAction } from "./serverAction";
import { TWorkspaceFormState, VSWorkspaceForm } from "@/lib/dataModels/org/workspace/definitions";

export async function workspaceUpdateClientAction(
  id: string,
  prevState: TWorkspaceFormState | null,
  formData: FormData,
): Promise<TWorkspaceFormState> {
  const parsedFormData = parseFormData({ formData });

  const validationResult = v.safeParse(VSWorkspaceForm, parsedFormData);
  if (!validationResult.success) {
    const errors = v.flatten<typeof VSWorkspaceForm>(validationResult.issues);
    console.log(errors);
    return {
      ...prevState,
      status: "error",
      data: { ...parsedFormData },
      errors: errors,
    };
  }

  return await workspaceUpdateServerAction(id, prevState, formData);
}
