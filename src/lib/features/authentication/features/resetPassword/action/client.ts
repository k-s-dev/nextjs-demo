"use client";

import * as v from "valibot";

import { parseFormData } from "@/lib/utils/form";
import { TServerAction } from "@/lib/utils/types";
import { VSResetPasswordForm } from "../definitions";
import { TUserFormState } from "@/lib/dataModels/auth/user/definitions";

export async function resetPasswordClientAction(
  serverAction: TServerAction<TUserFormState>,
  validationSchema: typeof VSResetPasswordForm,
  prevState: TUserFormState | null,
  formData: FormData,
): Promise<TUserFormState> {
  const rawFormData = parseFormData(formData);

  const validationResult = v.safeParse(validationSchema, rawFormData);
  if (!validationResult.success) {
    const errors = v.flatten<typeof validationSchema>(validationResult.issues);
    return {
      ...prevState,
      mode: "update",
      status: "failed",
      data: rawFormData,
      errors: errors,
    };
  }

  return await serverAction(prevState, formData);
}
