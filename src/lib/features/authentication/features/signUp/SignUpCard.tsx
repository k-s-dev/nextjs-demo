import { Text } from "@mantine/core";
import AuthProviderIcons from "../../components/AuthProviderIcons";
import { Divider } from "@mantine/core";
import SignUpForm from "./form/Form";
import SignInLinkButton from "../signIn/SignInLinkButton";
import AuthCard from "../../components/AuthCard";

export default function SignUpCard() {
  return (
    <AuthCard subTitle="Create an account">
      <SignUpForm />
      <Divider size="lg" label="Or sign in with other auth providers..." />
      <AuthProviderIcons />
      <Divider size="lg" label="Already have an account?" />
      <SignInLinkButton />
      <Text size="md" fs="italic" c="gray.6">
        *Using OAuth provider (e.g. GitHub or Google) automatically creates an
        account.
      </Text>
    </AuthCard>
  );
}
