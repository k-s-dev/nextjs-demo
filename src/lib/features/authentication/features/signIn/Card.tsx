import Link from "next/link";
import { Suspense } from "react";

import "./SignIn.scss";

import { routes } from "@/lib/utils/routeMapper";
import { Card, CardContent } from "@/lib/components/card";
import CredentialsSignInForm from "./credentials/Form";
import AuthCardHeader from "../../components/AuthCardHeader";
import AuthProviderIcons from "../../components/AuthProviderIcons";
import { Divider } from "@mantine/core";

export default function SignInCard() {
  return (
    <Card>
      <AuthCardHeader subTitle="Welcome back" />
      <CardContent>
        <Suspense>
          <CredentialsSignInForm />
        </Suspense>
        <Divider size="md" label="SignIn with other providers..." />
        <AuthProviderIcons />
        <Divider size="md" label="Don't have an account?" />
        <SignUpLink />
      </CardContent>
    </Card>
  );
}

function SignUpLink() {
  return (
    <Link href={routes.all.signUp} className="signIn-signUp-btn">
      Sign Up
    </Link>
  );
}
