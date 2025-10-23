import { Blockquote, Center, Text } from "@mantine/core";
import { FaTriangleExclamation } from "react-icons/fa6";
import AuthCard from "./AuthCard";
import SignInLinkButton from "../features/signIn/SignInLinkButton";

export default function AuthInvalidLink({
  title,
  subTitle = "Invalid Link",
  children,
}: {
  title: string;
  subTitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <AuthCard subTitle={title}>
      <Blockquote color="orange.3" mb="md">
        <Center>
          <Text component="h2" c="red.8" fz="h2">
            <FaTriangleExclamation /> {subTitle}
          </Text>
        </Center>
        {children}
      </Blockquote>
      <SignInLinkButton />
    </AuthCard>
  );
}
