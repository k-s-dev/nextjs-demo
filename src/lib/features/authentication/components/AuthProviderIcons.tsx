"use client";

import { FaGithub, FaGoogle } from "react-icons/fa6";
import { Button, Flex } from "@mantine/core";
import { SocialProvider } from "better-auth/social-providers";
import { authClient } from "../auth-client";

export default function AuthProviderIcons() {
  return (
    <>
      <Flex
        component="section"
        gap="1rem"
        justify="space-evenly"
        align="center"
        wrap="wrap"
      >
        <ProviderForm oAuthProvider="github">
          <FaGithub />
        </ProviderForm>
        <ProviderForm oAuthProvider="google">
          <FaGoogle />
        </ProviderForm>
      </Flex>
    </>
  );
}

export function ProviderForm({
  oAuthProvider,
  children,
}: {
  oAuthProvider: SocialProvider;
  children: React.ReactNode;
}) {
  return (
    <Button
      type="button"
      onClick={async () => {
        await authClient.signIn.social({
          provider: oAuthProvider,
        });
      }}
      fz={24}
      variant="gradient"
      gradient={{ from: "green", to: "blue", deg: 45 }}
    >
      {children}
    </Button>
  );
}
