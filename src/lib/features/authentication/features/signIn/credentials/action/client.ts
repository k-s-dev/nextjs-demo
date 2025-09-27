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
  const rawFormData = parseFormData(formData);

  const validationResult = v.safeParse(validationSchema, rawFormData);

  if (!validationResult.success) {
    const errors = v.flatten<typeof validationSchema>(validationResult.issues);
    return {
      ...prevState,
      mode: "read",
      status: "failed",
      data: rawFormData,
      errors: errors,
    };
  }

  return await serverAction(prevState, formData);
}
