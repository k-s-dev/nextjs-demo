"use client";

import React, { useActionState } from "react";
import { useDisclosure } from "@mantine/hooks";

import FormError from "@/lib/components/form/FormError";
import FormMessage from "@/lib/components/form/FormMessage";
import {
  TUserFormState,
  TUserFormStateData,
} from "@/lib/dataModels/auth/user/definitions";
import { resetPasswordClientAction } from "./action/client";
import { resetPasswordServerAction } from "./action/server";
import { VSResetPasswordForm } from "./definitions";
import { FormSubmitButton } from "@/lib/components/form/FormSubmitButton";
import {
  UserConfirmPassword,
  UserEmail,
  UserPassword,
} from "@/lib/dataModels/auth/user/ui/Fields";

export default function ResetPasswordForm({
  formId = "reset-password-form",
}: PropsFormResetPassword) {
  const [visible, { toggle }] = useDisclosure(false);

  const initialFormData = {} as TUserFormStateData;

  const initialFormState: TUserFormState = {
    mode: "update",
    data: initialFormData,
  };

  const [formState, formAction, isPending] = useActionState(
    resetPasswordClientAction.bind(
      null,
      resetPasswordServerAction,
      VSResetPasswordForm,
    ),
    initialFormState,
  );

  const formErrors = formState.errors?.root;

  return (
    <>
      <form id={formId} action={formAction} className="form" noValidate>
        <UserEmail
          formId={formId}
          formState={formState}
          data-test-cy="reset-password-email"
        />
        <UserPassword
          formId={formId}
          formState={formState}
          visible={visible}
          onVisibilityChange={toggle}
          data-test-cy="reset-password-password"
        />
        <UserConfirmPassword
          formId={formId}
          formState={formState}
          visible={visible}
          onVisibilityChange={toggle}
          data-test-cy="reset-password-confirmPassword"
        />

        <FormSubmitButton
          formId={formId}
          isPending={isPending}
          buttonText="Save"
          data-test-cy="reset-password-submit-btn"
        />
      </form>
      <FormError errors={formErrors} />
      <FormMessage messages={formState.messages} />
    </>
  );
}

export interface PropsFormResetPassword {
  formId?: string;
}
