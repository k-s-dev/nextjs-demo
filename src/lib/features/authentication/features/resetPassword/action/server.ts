"use server";

import * as v from "valibot";
import { redirect } from "next/navigation";
import { routes } from "@/lib/utils/routeMapper";
import { VSResetPasswordForm } from "../definitions";
import { TUserFormState } from "@/lib/dataModels/auth/user/definitions";
import { auth } from "../../../auth";
import { decode } from "decode-formdata";

export async function resetPasswordServerAction(
  token: string,
  prevState: TUserFormState | null,
  formData: FormData,
): Promise<TUserFormState> {
  // retreive data
  const parsedFormData = decode(formData);

  // Validate form
  const validationResult = v.safeParse(VSResetPasswordForm, parsedFormData);

  // handle validation errors
  if (!validationResult.success) {
    const errors = v.flatten<typeof VSResetPasswordForm>(
      validationResult.issues,
    );
    return {
      data: {
        ...parsedFormData,
      },
      errors: errors,
    };
  }

  // prepare form data for submission to backend
  const apiSubmissionData = {
    ...validationResult.output,
  };
  let data;

  // try submitting data to backend
  try {
    data = await auth.api.resetPassword({
      body: {
        newPassword: apiSubmissionData.password,
        token: token,
      },
    });
    console.log(data);
  } catch (error) {
    console.log(error);
    return {
      status: "error",
      errors: {
        root: [
          "Failed to update user due to internal server error. Please try again",
        ],
      },
    };
  }

  redirect(routes.all.signIn);
}
