import { Card } from "@mantine/core";
import AuthCardHeader from "./AuthCardHeader";

export default function AuthCard({
  subTitle,
  children,
}: {
  subTitle: string;
  children: React.ReactNode;
}) {
  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      mx="auto"
      my={{ base: "1rem", xs: "3rem" }}
      w={{ base: "95%", sm: 450 }}
    >
      <AuthCardHeader subTitle={subTitle} />
      {children}
    </Card>
  );
}
