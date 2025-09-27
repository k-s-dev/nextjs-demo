import * as v from "valibot";

import { parseFormData } from "@/lib/utils/form";
import { TUserFormState, VSUserCrudForm } from "../../../definitions";
import { createUserServerAction } from "./serverAction";

export async function createUserClientAction(
  imageFile: File | null,
  prevState: TUserFormState | null,
  formData: FormData,
): Promise<TUserFormState> {
  const rawFormData = parseFormData(formData, ["imageFile"]);

  const validationResult = v.safeParse(VSUserCrudForm, rawFormData);
  if (!validationResult.success) {
    const errors = v.flatten<typeof VSUserCrudForm>(validationResult.issues);
    return {
      ...prevState,
      status: "failed",
      data: rawFormData,
      errors: errors,
      mode: "update",
    };
  }
  return await createUserServerAction(imageFile, prevState, formData);
}
