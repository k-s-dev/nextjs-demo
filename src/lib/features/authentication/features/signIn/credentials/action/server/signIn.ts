"use server";

import * as v from "valibot";
import bcrypt from "bcryptjs";

import { signIn } from "@/lib/features/authentication/config";
import { VSSignInForm } from "../../definitions";
import { parseFormData } from "@/lib/utils/form";
import { TUser, TUserFormState } from "@/lib/dataModels/auth/user/definitions";
import { getUserByEmail } from "@/lib/dataModels/auth/user/dataAccess";

export async function credentialsSignInActionServer(
  prevState: TUserFormState | null,
  formData: FormData,
): Promise<TUserFormState> {
  // retreive data
  const rawFormData = parseFormData(formData);

  // Validate form
  const validationResult = v.safeParse(VSSignInForm, rawFormData);

  // handle validation errors
  if (!validationResult.success) {
    const errors = v.flatten<typeof VSSignInForm>(validationResult.issues);
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

  const hashedPassword = await bcrypt.hash(
    validationResult.output.password,
    10,
  );

  apiSubmissionData.password = hashedPassword;

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

  // validate: verification status
  if (!user?.emailVerified) {
    return {
      mode: "read",
      data: rawFormData,
      errors: {
        root: ["Email is not verified yet."],
      },
    };
  }

  // validate: password
  const passwordMatch = await bcrypt.compare(
    validationResult.output.password,
    user?.password || "",
  );

  if (!passwordMatch) {
    return {
      mode: "read",
      data: rawFormData,
      errors: {
        root: ["Invalid credentials."],
      },
    };
  }

  // session management
  await signIn("credentials", {
    ...validationResult.output,
    redirect: false,
  });

  return {
    mode: "read",
    status: "success",
    data: { ...validationResult.output },
  };
}
