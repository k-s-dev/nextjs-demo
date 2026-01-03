"use client";

import { Container, Flex } from "@mantine/core";
import { ReactNode } from "react";

/**
 * Generic container for main section with responsive width for phone and
 * phone-up screens.
 */
export default function Layout03({ children }: { children: ReactNode }) {
  return (
    <Container
      w={{ base: "99%", sm: "75%" }}
      m={"auto"}
      mah={"100vh"}
      mb={"xl"}
      pb={"xl"}
      style={{ overflow: "auto" }}
    >
      <Flex direction={"column"} mb={"50px"} pb={"50px"}>{children}</Flex>
    </Container>
  );
}
