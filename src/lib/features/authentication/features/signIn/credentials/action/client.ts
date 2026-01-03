"use client";

import * as v from "valibot";

import { parseFormData } from "@/lib/utils/form";
import { TServerAction } from "@/lib/types/serverResponse";
import { VSSignInForm, VSSignInFormBase } from "../definitions";
import {
  TSignInFormAction,
  TUserFormState,
} from "@/lib/dataModels/auth/user/definitions";
import { Dispatch, SetStateAction } from "react";

export async function signInActionClient(
  serverAction: TServerAction<TUserFormState>,
  validationSchema: typeof VSSignInForm | typeof VSSignInFormBase,
  actionName: TSignInFormAction,
  setActionName: Dispatch<SetStateAction<TSignInFormAction | null>>,
  prevState: TUserFormState | null,
  formData: FormData,
): Promise<TUserFormState> {
  setActionName(actionName)
  const parsedFormData = parseFormData({ formData });

  const validationResult = v.safeParse(validationSchema, parsedFormData);

  if (!validationResult.success) {
    const errors = v.flatten<typeof validationSchema>(validationResult.issues);
    return {
      ...prevState,
      status: "error",
      data: parsedFormData,
      errors: errors,
      action: actionName,
      touched: true,
    };
  }

  return await serverAction(prevState, formData);
}
