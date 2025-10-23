"use server";

import * as v from "valibot";

import { VSSignInFormBase } from "../../definitions";
import { parseFormData } from "@/lib/utils/form";
import { TUserFormState, TUserPublic } from "@/lib/dataModels/auth/user/definitions";
import { getUserByEmail } from "@/lib/dataModels/auth/user/dataAccessControl";
import { auth } from "@/lib/features/authentication/auth";
import { routes } from "@/lib/utils/routeMapper";

export async function sendVerificationLinkActionServer(
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

  if (user.emailVerified) {
    return {
      data: parsedFormData,
      messages: ["Email already verified."],
    };
  }

  // send reset password link
  const data = await auth.api.sendVerificationEmail({
    body: {
      email: apiSubmissionData.email,
      callbackURL: routes.generic.home,
    },
  });
  if (data.status) {
    return {
      data: parsedFormData,
      messages: [`Email verfication link sent to "${user.email}".`],
    };
  }

  return {
    data: parsedFormData,
    messages: ["Failed to send email verification link, please try again."],
  };
}
