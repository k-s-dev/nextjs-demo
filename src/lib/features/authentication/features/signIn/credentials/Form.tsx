"use client";

import React, { useActionState, useEffect, useState } from "react";
import { redirect, useSearchParams } from "next/navigation";
import FormError from "@/lib/components/form/FormError";
import FormMessage from "@/lib/components/form/FormMessage";
import {
  TUserFormState,
  TUserFormStateData,
} from "@/lib/dataModels/auth/user/definitions";
import { signInActionClient } from "./action/client";
import { credentialsSignInActionServer } from "./action/server/signIn";
import { sendVerificationLinkActionServer } from "./action/server/sendVerficationLink";
import { VSSignInForm, VSSignInFormBase } from "./definitions";
import { UserEmail, UserPassword } from "@/lib/dataModels/auth/user/ui/Fields";
import { routes } from "@/lib/utils/routeMapper";
import Form from "@/lib/components/form/Form";
import { Button } from "@mantine/core";
import { authClient } from "../../../auth-client";
import { sendResetPasswordLinkActionServer } from "./action/server/sendResetPasswordLink";

export default function CredentialsSignInForm({
  formId = "signIn-form",
}: CredentialsSigninProps) {
  const [formState, setFormState] = useState<TUserFormState>({});
  const [isPending, setIsPending] = useState(false);
  const searchParams = useSearchParams();

  const initialFormData = {} as TUserFormStateData;

  const initialFormState: TUserFormState = {
    data: initialFormData,
  };

  const [formStateSignIn, signInAction, isPendingSignIn] = useActionState(
    signInActionClient.bind(null, credentialsSignInActionServer, VSSignInForm),
    initialFormState,
  );

  const [formStateResetPassword, resetPasswordAction, isPendingResetPassword] =
    useActionState(
      signInActionClient.bind(
        null,
        sendResetPasswordLinkActionServer,
        VSSignInFormBase,
      ),
      initialFormState,
    );

  const [
    formStateSendVerificationLink,
    sendVerificationEmailFormAction,
    isPendingSendVerificationLink,
  ] = useActionState(
    signInActionClient.bind(
      null,
      sendVerificationLinkActionServer,
      VSSignInFormBase,
    ),
    initialFormState,
  );

  useEffect(() => {
    setIsPending(isPendingSignIn);
    setFormState(formStateSignIn);
  }, [formStateSignIn, isPendingSignIn]);

  useEffect(() => {
    setIsPending(isPendingSendVerificationLink);
    setFormState(formStateSendVerificationLink);
  }, [formStateSendVerificationLink, isPendingSendVerificationLink]);

  useEffect(() => {
    setIsPending(isPendingResetPassword);
    setFormState(formStateResetPassword);
  }, [formStateResetPassword, isPendingResetPassword]);

  const formErrors = [];
  if (searchParams.get("error") === "OAuthAccountNotLinked") {
    formErrors.push(`Email already registered with another provider.`);
    formErrors.push(`Use the initial provier used to sign in.`);
  }
  if (Array.isArray(formState.errors?.root)) {
    formErrors.push(...formState.errors?.root);
  } else if (formState.errors?.root) {
    formErrors.push(formState.errors?.root);
  }

  useEffect(() => {
    async function signIn() {
      if (
        formState.status === "success" &&
        formState.data?.email &&
        formState.data.password
      ) {
        const { error } = await authClient.signIn.email({
          email: formState.data?.email,
          password: formState.data?.password,
          callbackURL: routes.DEFAULT_LOGIN_REDIRECT,
        });
        if (error) {
          formState.status = "error";
          formState.errors = {
            root: [error.message || ""],
          };

          return formState;
        }

        return redirect(routes.DEFAULT_LOGIN_REDIRECT);
      }
    }
    signIn();
  }, [formState]);

  return (
    <>
      <Form id={formId} noValidate>
        <UserEmail
          formId={formId}
          formState={formState}
          data-test-cy="signIn-email"
        />
        <UserPassword
          formId={formId}
          formState={formState}
          required
          data-test-cy="signIn-password"
        />

        <Button
          type="submit"
          form={formId}
          formAction={signInAction}
          disabled={isPending}
          color="green.1"
          data-test-cy="signIn-btn"
        >
          Sign In
        </Button>

        <Button
          type="submit"
          form={formId}
          formAction={sendVerificationEmailFormAction}
          disabled={isPending}
          color="gray.2"
          fullWidth
          data-test-cy="send_verification_link_email-btn"
        >
          Resend email verification link
        </Button>

        <Button
          type="submit"
          form={formId}
          formAction={resetPasswordAction}
          disabled={isPending}
          color="gray.2"
          fullWidth
          data-test-cy="reset_password-btn"
        >
          Reset Password
        </Button>
      </Form>
      <FormError errors={formErrors} />
      <FormMessage messages={formState.messages || []} />
    </>
  );
}

export interface CredentialsSigninProps {
  formId?: string;
}
