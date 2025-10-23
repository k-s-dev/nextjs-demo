import * as v from "valibot";
import { parseFormData } from "@/lib/utils/form";
import { TUserFormState, VSUserCrudForm } from "../../../definitions";
import { createUserServerAction } from "./serverAction";

export async function createUserClientAction(
  imageFile: File | null,
  prevState: TUserFormState | null,
  formData: FormData,
): Promise<TUserFormState> {
  const parsedFormData = parseFormData({
    formData,
    info: {
      booleans: ["emailVerified"],
    },
    excludeKeys: ["imageFile"],
  });

  const validationResult = v.safeParse(VSUserCrudForm, parsedFormData);
  if (!validationResult.success) {
    const errors = v.flatten<typeof VSUserCrudForm>(validationResult.issues);
    return {
      ...prevState,
      status: "error",
      data: parsedFormData,
      errors: errors,
    };
  }

  return await createUserServerAction(imageFile, prevState, formData);
}
