import * as v from "valibot";
import { parseFormData } from "@/lib/utils/form";
import {
  TUserFormState,
  TUserPublic,
  userRoleEnum,
  VSUserCrudForm,
} from "../../../definitions";
import { updateUserServerAction } from "./serverAction";

export async function updateUserClientAction(
  user: TUserPublic,
  imageFile: File | null,
  prevState: TUserFormState | null,
  formData: FormData,
): Promise<TUserFormState> {
  let parsedFormData = parseFormData({
    formData,
    info: {
      booleans: ["emailVerified"],
    },
    excludeKeys: ["imageFile"],
  });

  // SUPERUSER role cannot be changed
  if (user.role === userRoleEnum.SUPERUSER) {
    parsedFormData = {
      ...parsedFormData,
      role: userRoleEnum.SUPERUSER,
    };
  }

  const validationResult = v.safeParse(VSUserCrudForm, parsedFormData);
  if (!validationResult.success) {
    const errors = v.flatten<typeof VSUserCrudForm>(validationResult.issues);
    console.log(errors);
    return {
      ...prevState,
      status: "error",
      data: { ...parsedFormData },
      errors: errors,
    };
  }

  return await updateUserServerAction(user, imageFile, prevState, formData);
}
