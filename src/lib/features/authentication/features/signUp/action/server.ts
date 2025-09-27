"use server";

import * as v from "valibot";
import bcrypt from "bcryptjs";

import { VSSignUpForm } from "../definitions";
import { sendVerificationEmail } from "../../../verification";
import { parseFormData } from "@/lib/utils/form";
import { TUser, TUserFormState } from "@/lib/dataModels/auth/user/definitions";
import {
  createUser,
  getUserByEmail,
} from "@/lib/dataModels/auth/user/dataAccess";

export async function signUpActionServer(
  prevState: TUserFormState | null,
  formData: FormData,
): Promise<TUserFormState> {
  // retreive data
  const rawFormData = parseFormData(formData);

  // Validate form
  const validationResult = v.safeParse(VSSignUpForm, rawFormData);

  // handle validation errors
  if (!validationResult.success) {
    const errors = v.flatten<typeof VSSignUpForm>(validationResult.issues);
    return {
      mode: "create",
      status: "failed",
      data: rawFormData,
      errors: errors,
    };
  }

  const validatedData = validationResult.output;

  // check for existing user
  const existingUser: TUser = await getUserByEmail(
    validatedData.email,
    "server",
  );

  if (existingUser) {
    return {
      mode: "create",
      status: "failed",
      data: rawFormData,
      errors: {
        root: ["User already exists."],
      },
    };
  }

  // prepare form data for submission to backend
  const hashedPassword = await bcrypt.hash(
    validationResult.output.password,
    10,
  );

  const apiSubmissionData = {
    ...validatedData,
    password: hashedPassword,
  };

  // try submitting data to backend
  try {
    await createUser({
      name: apiSubmissionData.name,
      email: apiSubmissionData.email,
      password: apiSubmissionData.password,
    });
  } catch (error) {
    console.log(error);
    return {
      mode: "create",
      status: "failed",
      data: rawFormData,
      errors: {
        root: [
          "Failed to create user due to internal server error. Please try again.",
        ],
      },
    };
  }

  await sendVerificationEmail(apiSubmissionData.email, "EMAIL_VERFICATION");

  return {
    mode: "create",
    data: rawFormData,
    messages: [
      "User created successfully. Verification email sent. Sign in will work post verfication.",
    ],
    status: "success",
  };
}
