"use client";

import * as v from "valibot";

import { parseFormData } from "@/lib/utils/form";
import { TServerAction } from "@/lib/utils/types";
import { VSSignInForm, VSSignInFormBase } from "../definitions";
import { TUserFormState } from "@/lib/dataModels/auth/user/definitions";

export async function signInActionClient(
  serverAction: TServerAction<TUserFormState>,
  validationSchema: typeof VSSignInForm | typeof VSSignInFormBase,
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
      data: parsedFormData,
      errors: errors,
    };
  }

  return await serverAction(prevState, formData);
}
