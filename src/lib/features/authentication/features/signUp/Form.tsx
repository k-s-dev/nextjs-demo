"use client";

import React, { useActionState } from "react";
import { useDisclosure } from "@mantine/hooks";

import FormError from "@/lib/components/form/FormError";
import FormMessage from "@/lib/components/form/FormMessage";
import {
  TUserFormState,
  TUserFormStateData,
} from "@/lib/dataModels/auth/user/definitions";
import { FormSubmitButton } from "@/lib/components/form/FormSubmitButton";
import { signUpActionClient } from "./action/client";
import {
  UserConfirmPassword,
  UserEmail,
  UserName,
  UserPassword,
} from "@/lib/dataModels/auth/user/ui/Fields";

export default function SignUpForm({
  formId = "signUp-form",
}: SignUpFormProps) {
  const [visible, { toggle }] = useDisclosure(false);

  const initialFormData = {} as TUserFormStateData;

  const initialFormState: TUserFormState = {
    mode: "update",
    data: initialFormData,
  };

  const [formState, formAction, isPending] = useActionState(
    signUpActionClient,
    initialFormState,
  );

  const formErrors = formState.errors?.root;

  if (formState.status === "success") {
    return (
      <div
        className="signUp-success-message"
        data-test-cy="signUp-success-message"
      >
        <p>User created succuesfully.</p>
        <p>
          Verification link has been sent to email:{" "}
          <span>{formState.data?.email}</span>
        </p>
        <p className="signUp-verification-notice">
          Email verification is needed to be able to sign in using email and
          password.
        </p>
      </div>
    );
  }

  return (
    <>
      <form id={formId} className="form" noValidate>
        <UserEmail
          formId={formId}
          formState={formState}
          data-test-cy="signUp-email"
        />
        <UserPassword
          formId={formId}
          formState={formState}
          visible={visible}
          onVisibilityChange={toggle}
          data-test-cy="signUp-password"
        />
        <UserConfirmPassword
          formId={formId}
          formState={formState}
          visible={visible}
          onVisibilityChange={toggle}
          data-test-cy="signUp-confirmPassword"
        />

        <UserName
          formId={formId}
          formState={formState}
          data-test-cy="signUp-name"
        />

        <FormSubmitButton
          formId={formId}
          formAction={formAction}
          isPending={isPending}
          buttonText="SignUp"
          type="submit"
          data-test-cy="signUp-btn"
        />
      </form>
      <FormError errors={formErrors} />
      <FormMessage messages={formState.messages} />
    </>
  );
}

export interface SignUpFormProps {
  formId?: string;
}
