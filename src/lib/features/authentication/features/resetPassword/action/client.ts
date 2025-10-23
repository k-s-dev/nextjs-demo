"use client";

import * as v from "valibot";

import { parseFormData } from "@/lib/utils/form";
import { VSResetPasswordForm } from "../definitions";
import { TUserFormState } from "@/lib/dataModels/auth/user/definitions";
import { resetPasswordServerAction } from "./server";

export async function resetPasswordClientAction(
  serverAction: typeof resetPasswordServerAction,
  validationSchema: typeof VSResetPasswordForm,
  token: string,
  prevState: TUserFormState | null,
  formData: FormData,
): Promise<TUserFormState> {
  const parsedFormData = parseFormData({ formData });

  const validationResult = v.safeParse(validationSchema, parsedFormData);
  if (!validationResult.success) {
    const errors = v.flatten<typeof validationSchema>(validationResult.issues);
    return {
      ...prevState,
      status: "error",
      data: { ...parsedFormData },
      errors: errors,
    };
  }

  return await serverAction(token, prevState, formData);
}
