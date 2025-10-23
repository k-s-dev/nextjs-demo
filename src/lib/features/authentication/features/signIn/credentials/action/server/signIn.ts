"use server";

import * as v from "valibot";
import { VSSignInForm } from "../../definitions";
import { parseFormData } from "@/lib/utils/form";
import { TUserFormState, TUserPublic } from "@/lib/dataModels/auth/user/definitions";
import { getUserByEmail } from "@/lib/dataModels/auth/user/dataAccessControl";
import { auth } from "@/lib/features/authentication/auth";

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
      data: parsedFormData,
      errors: {
        root: ["Invalid credentials."],
      },
    };
  }

  // validate: verification status
  if (!user?.emailVerified) {
    return {
      data: parsedFormData,
      errors: {
        root: ["Email is not verified yet."],
      },
    };
  }

  // validate: password: handled by better-auth
  // session management
  await auth.api.signInEmail({
    body: {
      email: apiSubmissionData.email,
      password: apiSubmissionData.password,
    },
    asResponse: true,
  });

  return {
    status: "success",
    data: { ...validationResult.output },
  };
}
