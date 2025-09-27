"use client";

import React, { useActionState, useEffect, useState } from "react";
import { redirect, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

import "./SignInForm.scss";

import FormError from "@/lib/components/form/FormError";
import FormMessage from "@/lib/components/form/FormMessage";
import {
  TUserFormState,
  TUserFormStateData,
} from "@/lib/dataModels/auth/user/definitions";
import { FormSubmitButton } from "@/lib/components/form/FormSubmitButton";
import { signInActionClient } from "./action/client";
import { credentialsSignInActionServer } from "./action/server/signIn";
import { sendResetPasswordLinkActionServer } from "./action/server/sendResetPasswordLink";
import { sendVerificationLinkActionServer } from "./action/server/sendVerficationLink";
import { VSSignInForm, VSSignInFormBase } from "./definitions";
import { UserEmail, UserPassword } from "@/lib/dataModels/auth/user/ui/Fields";
import { routes } from "@/lib/utils/routeMapper";

export default function CredentialsSignInForm({
  formId = "signIn-form",
}: CredentialsSigninProps) {
  const [formState, setFormState] = useState<TUserFormState>({ mode: "read" });
  const [isPending, setIsPending] = useState(false);
  const searchParams = useSearchParams();
  const { update: updateSession } = useSession();

  const initialFormData = {} as TUserFormStateData;

  const initialFormState: TUserFormState = {
    mode: "update",
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
    if (formState.status === "success") {
      updateSession(formState.data);
      return redirect(routes.DEFAULT_LOGIN_REDIRECT);
    }
  }, [formState.data, formState.status, updateSession]);

  return (
    <>
      <form id={formId} className="form" noValidate>
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

        <FormSubmitButton
          formId={formId}
          formAction={signInAction}
          isPending={isPending}
          buttonText="SignIn"
          data-test-cy="signIn-btn"
        />

        <section className="signIn-form-extra-btns-row">
          <FormSubmitButton
            formId={formId}
            formAction={sendVerificationEmailFormAction}
            isPending={isPending}
            buttonText="Resend email verification link"
            className="signIn-form-send_verification_link_email-btn"
            data-test-cy="send_verification_link_email-btn"
          />
          <FormSubmitButton
            formId={formId}
            formAction={resetPasswordAction}
            isPending={isPending}
            buttonText="Reset password"
            className="signIn-form-reset_password-btn"
            data-test-cy="reset_password-btn"
          />
        </section>
      </form>
      <FormError errors={formErrors} />
      <FormMessage messages={formState.messages || []} />
    </>
  );
}

export interface CredentialsSigninProps {
  formId?: string;
}
