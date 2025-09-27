"use client";

import * as v from "valibot";

import { parseFormData } from "@/lib/utils/form";
import { VSSignUpForm } from "../definitions";
import { signUpActionServer } from "./server";
import { TUserFormState } from "@/lib/dataModels/auth/user/definitions";

export async function signUpActionClient(
  prevState: TUserFormState | null,
  formData: FormData,
): Promise<TUserFormState> {
  const rawFormData = parseFormData(formData);

  const validationResult = v.safeParse(VSSignUpForm, rawFormData);

  if (!validationResult.success) {
    const errors = v.flatten<typeof VSSignUpForm>(validationResult.issues);
    return {
      ...prevState,
      mode: "create",
      status: "failed",
      data: rawFormData,
      errors: errors,
    };
  }

  return await signUpActionServer(prevState, formData);
}
