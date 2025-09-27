"use server";

import * as v from "valibot";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

import { routes } from "@/lib/utils/routeMapper";
import { VSResetPasswordForm } from "../definitions";
import { parseFormData } from "@/lib/utils/form";
import { TUser, TUserFormState } from "@/lib/dataModels/auth/user/definitions";
import {
  getUserByEmail,
  updateUser,
} from "@/lib/dataModels/auth/user/dataAccess";
import { getSessionUser } from "../../../getSessionUser";

export async function resetPasswordServerAction(
  prevState: TUserFormState | null,
  formData: FormData,
): Promise<TUserFormState> {
  // retreive data
  const rawFormData = parseFormData(formData);

  // Validate form
  const validationResult = v.safeParse(VSResetPasswordForm, rawFormData);

  // handle validation errors
  if (!validationResult.success) {
    const errors = v.flatten<typeof VSResetPasswordForm>(
      validationResult.issues,
    );
    return {
      mode: "update",
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

  const existingUser: TUser = await getUserByEmail(
    apiSubmissionData.email,
    "server",
  );

  if (!existingUser) {
    return {
      mode: "update",
      data: rawFormData,
      errors: {
        root: ["User not found."],
      },
    };
  }

  // try submitting data to backend
  try {
    const sessionUser = await getSessionUser();
    await updateUser(
      {
        email: apiSubmissionData.email,
      },
      {
        email: apiSubmissionData.email,
        password: hashedPassword,
      },
      "client",
      sessionUser,
    );
  } catch (error) {
    console.log(error);
    return {
      mode: "update",
      errors: {
        root: [
          "Failed to update user due to internal server error. Please try again",
        ],
      },
    };
  }

  redirect(routes.all.signIn);
}
