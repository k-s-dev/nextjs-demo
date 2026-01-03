"use client";

import { useActionState, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  TSignInFormAction,
  TUserFormState,
} from "@/lib/dataModels/auth/user/definitions";
import { signInActionClient } from "./action/client";
import { credentialsSignInActionServer } from "./action/server/signIn";
import { sendVerificationLinkActionServer } from "./action/server/sendVerficationLink";
import { VSSignInForm, VSSignInFormBase } from "./definitions";
import { UserEmail, UserPassword } from "@/lib/dataModels/auth/user/ui/Fields";
import Form from "@/lib/ui/form/Form";
import { Button } from "@mantine/core";
import { sendResetPasswordLinkActionServer } from "./action/server/sendResetPasswordLink";
import FormMessages from "@/lib/ui/form/FormMessages";

export default function CredentialsSignInForm({
  initialState,
  resetAction,
  formId = "signIn-form",
}: CredentialsSigninProps) {
  const searchParams = useSearchParams();
  const [actionName, setActionName] = useState<TSignInFormAction | null>(null);

  const [signInFormState, signInAction, isPendingSignIn] = useActionState(
    signInActionClient.bind(
      null,
      credentialsSignInActionServer,
      VSSignInForm,
      "signIn",
      setActionName,
    ),
    { ...initialState, action: "signIn" },
  );

  const [resetFormState, resetPasswordAction, isPendingReset] = useActionState(
    signInActionClient.bind(
      null,
      sendResetPasswordLinkActionServer,
      VSSignInFormBase,
      "reset",
      setActionName,
    ),
    { ...initialState, action: "reset" },
  );

  const [
    verificationFormState,
    sendVerificationEmailFormAction,
    isPendingVerification,
  ] = useActionState(
    signInActionClient.bind(
      null,
      sendVerificationLinkActionServer,
      VSSignInFormBase,
      "verify",
      setActionName,
    ),
    { ...initialState, action: "verify" },
  );

  const knownErrors: string[] = [];
  if (searchParams.get("error") === "OAuthAccountNotLinked") {
    knownErrors.push(`Email already registered with another provider.`);
    knownErrors.push(`Use the initial provier used to sign in.`);
  }

  let formState: TUserFormState = initialState;
  if (signInFormState.touched && actionName === "signIn")
    formState = signInFormState;
  if (resetFormState.touched && actionName === "reset")
    formState = resetFormState;
  if (verificationFormState.touched && actionName === "verify")
    formState = verificationFormState;

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
          disabled={isPendingSignIn || isPendingReset || isPendingVerification}
          color="green.1"
          data-test-cy="signIn-btn"
        >
          Sign In
        </Button>

        <Button
          type="submit"
          form={formId}
          formAction={sendVerificationEmailFormAction}
          disabled={isPendingSignIn || isPendingReset || isPendingVerification}
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
          disabled={isPendingSignIn || isPendingReset || isPendingVerification}
          color="gray.2"
          fullWidth
          data-test-cy="reset_password-btn"
        >
          Reset Password
        </Button>

        <Button
          type="button"
          fullWidth
          variant="light"
          color="gray"
          onClick={() => {
            resetAction();
            // setActionName(null);
            // setInitialState({ data: {} as TUserFormStateData, touched: false });
          }}
        >
          Reset
        </Button>
      </Form>
      {formState.errors?.root && (
        <FormMessages error messages={formState.errors.root} />
      )}
      {formState.messages && <FormMessages messages={formState.messages} />}
    </>
  );
}

export interface CredentialsSigninProps {
  initialState: TUserFormState;
  resetAction: () => void;
  formId?: string;
}
