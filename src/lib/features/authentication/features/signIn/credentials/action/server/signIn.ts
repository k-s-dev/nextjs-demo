"use server";

import * as v from "valibot";
import { VSSignInForm } from "../../definitions";
import { parseFormData } from "@/lib/utils/form";
import {
  TUserFormState,
  TUserPublic,
} from "@/lib/dataModels/auth/user/definitions";
import { getUserByEmail } from "@/lib/dataModels/auth/user/dataAccessControl";
import { auth } from "@/lib/features/authentication/auth";
import { redirect } from "next/navigation";
import { routes } from "@/lib/utils/routeMapper";

export async function credentialsSignInActionServer(
  prevState: TUserFormState | null,
  formData: FormData,
): Promise<TUserFormState> {
  // retreive data
  const parsedFormData = parseFormData({ formData });

  // Validate form
  const validationResult = v.safeParse(VSSignInForm, parsedFormData);

  // handle validation errors
  if (!validationResult.success) {
    const errors = v.flatten<typeof VSSignInForm>(validationResult.issues);
    return {
      touched: true,
      action: "signIn",
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
      action: "signIn",
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
      action: "signIn",
      data: parsedFormData,
      errors: {
        root: ["Email is not verified yet."],
      },
    };
  }

  // validate: password: handled by better-auth
  // session management
  const authResponse = await auth.api.signInEmail({
    body: {
      email: apiSubmissionData.email,
      password: apiSubmissionData.password,
    },
    asResponse: true,
  });

  if (authResponse.status !== 200) {
    return {
      touched: true,
      action: "signIn",
      data: parsedFormData,
      errors: {
        root: ["Invalid credentials."],
      },
    };
  }

  redirect(routes.DEFAULT_LOGIN_REDIRECT);
}
