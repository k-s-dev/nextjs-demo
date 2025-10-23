"use client";

import * as v from "valibot";

import { parseFormData } from "@/lib/utils/form";
import { TUserFormState } from "@/lib/dataModels/auth/user/definitions";
import { VSSignUpForm } from "../../definitions";
import { authClient } from "@/lib/features/authentication/auth-client";
import { routes } from "@/lib/utils/routeMapper";

export async function signUpActionClient(
  prevState: TUserFormState | null,
  formData: FormData,
): Promise<TUserFormState> {
  const parsedFormData = parseFormData({ formData });

  const validationResult = v.safeParse(VSSignUpForm, parsedFormData);

  if (!validationResult.success) {
    const errors = v.flatten<typeof VSSignUpForm>(validationResult.issues);
    return {
      ...prevState,
      status: "error",
      data: parsedFormData,
      errors: errors,
    };
  }

  const result = await authClient.signUp.email({
    ...validationResult.output,
    callbackURL: routes.generic.home,
  });

  if (result.error?.message) {
    return {
      ...prevState,
      status: "error",
      data: parsedFormData,
      errors: { root: [result.error.message] },
    };
  }

  return {
    data: parsedFormData,
    messages: [
      "User created successfully. Verification email sent. Sign in will work post verfication.",
    ],
    status: "success",
  };
}
