"use client";

import { Card, Center } from "@mantine/core";

export default function AdminFormContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Center>
      <Card
        component="section"
        withBorder
        shadow="lg"
        radius="lg"
        w={{ base: "99%", xl: "80%" }}
      >
        {children}
      </Card>
    </Center>
  );
}
