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
import {
  UserConfirmPassword,
  UserPassword,
} from "@/lib/dataModels/auth/user/ui/Fields";
import Form from "@/lib/components/form/Form";
import { Button } from "@mantine/core";

export default function ResetPasswordForm({
  token,
  formId = "reset-password-form",
}: PropsFormResetPassword) {
  const [visible, { toggle }] = useDisclosure(false);

  const initialFormData = {} as TUserFormStateData;

  const initialFormState: TUserFormState = {
    data: initialFormData,
  };

  const [formState, formAction, isPending] = useActionState(
    resetPasswordClientAction.bind(
      null,
      resetPasswordServerAction,
      VSResetPasswordForm,
      token,
    ),
    initialFormState,
  );

  const formErrors = formState.errors?.root;

  return (
    <>
      <Form id={formId} action={formAction} noValidate>
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

        <Button
          type="submit"
          form={formId}
          disabled={isPending}
          data-test-cy="reset-password-submit-btn"
          color="yellow.1"
        >
          Save
        </Button>
      </Form>
      <FormError errors={formErrors} />
      <FormMessage messages={formState.messages} />
    </>
  );
}

export interface PropsFormResetPassword {
  token: string;
  formId?: string;
}
