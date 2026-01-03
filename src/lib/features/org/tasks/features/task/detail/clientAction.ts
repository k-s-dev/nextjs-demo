import * as v from "valibot";
import { parseFormData } from "@/lib/utils/form";
import { taskUpdateServerAction } from "./serverAction";
import {
  TTaskFormState,
  VSTaskForm,
} from "@/lib/dataModels/org/task/definitions";

export async function taskUpdateClientAction(
  id: string,
  categoryId: string,
  tagIds: string[],
  prevState: TTaskFormState | null,
  formData: FormData,
): Promise<TTaskFormState> {
  const parsedFormData = parseFormData({
    formData,
    info: {
      dates: ["start_date", "end_date", "estimated_start", "estimated_end"],
    },
  });

  const validationResult = v.safeParse(VSTaskForm, parsedFormData);
  if (!validationResult.success) {
    const errors = v.flatten<typeof VSTaskForm>(validationResult.issues);
    return {
      ...prevState,
      status: "error",
      data: { ...parsedFormData },
      errors: errors,
    };
  }

  return await taskUpdateServerAction(
    id,
    categoryId,
    tagIds,
    prevState,
    formData,
  );
}
