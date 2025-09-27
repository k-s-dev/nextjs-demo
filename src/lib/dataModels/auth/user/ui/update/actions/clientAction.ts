import * as v from "valibot";

import { parseFormData } from "@/lib/utils/form";
import {
  TUserFormState,
  TUserPublic,
  VSUserCrudForm,
} from "../../../definitions";
import { updateUserServerAction } from "./serverAction";
import { USER_ROLE } from "@/generated/prisma";

export async function updateUserClientAction(
  user: TUserPublic,
  imageFile: File | null,
  prevState: TUserFormState | null,
  formData: FormData,
): Promise<TUserFormState> {
  let rawFormData = parseFormData(formData, ["imageFile"]);
  if (user.role === USER_ROLE.SUPERUSER) {
    rawFormData = {
      ...rawFormData,
      role: USER_ROLE.SUPERUSER,
    };
  }

  const validationResult = v.safeParse(VSUserCrudForm, rawFormData);
  if (!validationResult.success) {
    const errors = v.flatten<typeof VSUserCrudForm>(validationResult.issues);
    return {
      ...prevState,
      mode: "update",
      status: "failed",
      data: { ...rawFormData },
      errors: errors,
    };
  }

  return await updateUserServerAction(user, imageFile, prevState, formData);
}
