"use server";

import * as v from "valibot";

import { sendVerificationEmail } from "@/lib/features/authentication/verification";
import { VSSignInFormBase } from "../../definitions";
import { parseFormData } from "@/lib/utils/form";
import { TUser, TUserFormState } from "@/lib/dataModels/auth/user/definitions";
import { getUserByEmail } from "@/lib/dataModels/auth/user/dataAccess";

export async function sendVerificationLinkActionServer(
  prevState: TUserFormState | null,
  formData: FormData,
): Promise<TUserFormState> {
  // retreive data
  const rawFormData = parseFormData(formData);

  // Validate form
  const validationResult = v.safeParse(VSSignInFormBase, rawFormData);

  // handle validation errors
  if (!validationResult.success) {
    const errors = v.flatten<typeof VSSignInFormBase>(validationResult.issues);
    return {
      mode: "read",
      data: rawFormData,
      errors: errors,
    };
  }

  // prepare form data for submission to backend
  const apiSubmissionData = {
    ...validationResult.output,
  };

  const user: TUser = await getUserByEmail(apiSubmissionData.email, "server");

  // validate: existing user
  if (!user) {
    return {
      mode: "read",
      data: rawFormData,
      errors: {
        root: ["Invalid credentials."],
      },
    };
  }

  if (user.emailVerified) {
    return {
      mode: "read",
      data: rawFormData,
      messages: ["Email already verified."],
    };
  }

  // send reset password link
  await sendVerificationEmail(user.email, "EMAIL_VERFICATION");
  return {
    mode: "read",
    data: rawFormData,
    messages: [`Email verfication link sent to "${user.email}".`],
  };
}
