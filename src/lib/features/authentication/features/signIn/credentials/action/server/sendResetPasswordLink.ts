"use server";

import * as v from "valibot";

import { VSSignInFormBase } from "../../definitions";
import { parseFormData } from "@/lib/utils/form";
import {
  TUserFormState,
  TUserPublic,
} from "@/lib/dataModels/auth/user/definitions";
import { getUserByEmail } from "@/lib/dataModels/auth/user/dataAccessControl";
import { auth } from "@/lib/features/authentication/auth";
import { routes } from "@/lib/utils/routeMapper";

export async function sendResetPasswordLinkActionServer(
  prevState: TUserFormState | null,
  formData: FormData,
): Promise<TUserFormState> {
  // retreive data
  const parsedFormData = parseFormData({ formData });

  // Validate form
  const validationResult = v.safeParse(VSSignInFormBase, parsedFormData);

  // handle validation errors
  if (!validationResult.success) {
    const errors = v.flatten<typeof VSSignInFormBase>(validationResult.issues);
    return {
      touched: true,
      action: "reset",
      data: parsedFormData,
      errors: errors,
    };
  }

  // prepare form data for submission to backend
  const apiSubmissionData = {
    ...validationResult.output,
  };

  const response = await getUserByEmail(apiSubmissionData.email, "server");
  const user = response.data as TUserPublic;

  // validate: existing user
  if (!user) {
    return {
      touched: true,
      action: "reset",
      data: parsedFormData,
      errors: {
        root: ["Invalid credentials."],
      },
    };
  }

  // validate: verification status
  if (!user?.emailVerified) {
    return {
      touched: true,
      action: "reset",
      data: parsedFormData,
      errors: {
        root: ["Email is not verified yet."],
      },
    };
  }

  // send reset password link
  const data = await auth.api.requestPasswordReset({
    body: {
      email: user.email,
      redirectTo: routes.authentication.resetPassword,
    },
  });

  return {
    touched: true,
    action: "reset",
    data: parsedFormData,
    messages: [data.message],
  };
}
