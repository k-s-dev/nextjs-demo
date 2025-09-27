import Link from "next/link";

import "./SignUp.scss";

import { routes } from "@/lib/utils/routeMapper";
import { Card, CardContent } from "@/lib/components/card";
import SignUpForm from "./Form";
import AuthCardHeader from "../../components/AuthCardHeader";
import AuthProviderIcons from "../../components/AuthProviderIcons";
import { Divider } from "@mantine/core";

export default function SignUpCard() {
  return (
    <Card>
      <AuthCardHeader />
      <CardContent>
        <SignUpForm />
        <Divider size="lg" label="Or sign in with other auth providers..." />
        <AuthProviderIcons />
        <Divider size="lg" label="Already have an account?" />
        <SignIn />
        <p>
          *Using OAuth provider (e.g. GitHub or Google) automatically creates
          an account.
        </p>
      </CardContent>
    </Card>
  );
}

function SignIn() {
  return (
    <Link href={routes.all.signIn} className="signUp-signIn-btn">
      Sign In
    </Link>
  );
}
