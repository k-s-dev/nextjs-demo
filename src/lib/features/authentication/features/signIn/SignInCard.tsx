import { Suspense } from "react";
import AuthProviderIcons from "../../components/AuthProviderIcons";
import { Divider } from "@mantine/core";
import CredentialsSignInForm from "./credentials/Form";
import AuthCard from "../../components/AuthCard";
import SignUpLinkButton from "../signUp/SignUpLinkButton";

export default function SignInCard() {
  return (
    <AuthCard subTitle="Welcome Back">
      <Suspense>
        <CredentialsSignInForm />
      </Suspense>
      <Divider size="md" label="SignIn with other providers..." />
      <AuthProviderIcons />
      <Divider size="md" label="Don't have an account?" />
      <SignUpLinkButton />
    </AuthCard>
  );
}
