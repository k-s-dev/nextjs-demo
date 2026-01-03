import { Card, CardProps } from "@mantine/core";

export default function BasicCard({ children, ...rest }: TBasicCardProps) {
  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      mx="auto"
      my={{ base: "1rem", xs: "3rem" }}
      w={{ base: "95%", sm: 450 }}
      {...rest}
    >
      {children}
    </Card>
  );
}

export type TBasicCardProps = {
  children: React.ReactNode;
} & CardProps;
