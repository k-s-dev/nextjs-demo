"use client";

import AuthProviderIcons from "../../components/AuthProviderIcons";
import { Divider } from "@mantine/core";
import CredentialsSignInForm from "./credentials/Form";
import AuthCard from "../../components/AuthCard";
import SignUpLinkButton from "../signUp/SignUpLinkButton";
import { useState } from "react";
import { TUserFormStateData } from "@/lib/dataModels/auth/user/definitions";

export default function SignInCard() {
  const [resetKey, setResetKey] = useState(0);

  return (
    <AuthCard subTitle="Welcome Back">
      <CredentialsSignInForm
        key={resetKey}
        initialState={{ data: {} as TUserFormStateData, touched: false }}
        resetAction={() => setResetKey((p) => p + 1)}
      />
      <Divider size="md" label="SignIn with other providers..." />
      <AuthProviderIcons />
      <Divider size="md" label="Don't have an account?" />
      <SignUpLinkButton />
    </AuthCard>
  );
}
