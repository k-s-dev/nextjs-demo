import * as v from "valibot";
import { parseFormData } from "@/lib/utils/form";
import { categoryUpdateServerAction } from "./serverAction";
import {
  TCategoryFormState,
  VSCategoryForm,
} from "@/lib/dataModels/org/category/definitions";

export async function categoryUpdateClientAction(
  id: string,
  prevState: TCategoryFormState | null,
  formData: FormData,
): Promise<TCategoryFormState> {
  const parsedFormData = parseFormData({
    formData,
    info: {
      numbers: ["order"],
    },
  });

  const validationResult = v.safeParse(VSCategoryForm, parsedFormData);
  if (!validationResult.success) {
    const errors = v.flatten<typeof VSCategoryForm>(validationResult.issues);
    return {
      ...prevState,
      status: "error",
      data: { ...parsedFormData },
      errors: errors,
    };
  }

  return await categoryUpdateServerAction(id, prevState, formData);
}
