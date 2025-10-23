"use client";

import Link from "next/link";
import { PiShieldCheck } from "react-icons/pi";
import { routes } from "@/lib/utils/routeMapper";
import { Divider, Flex, Text } from "@mantine/core";

export default function AuthCardHeader({
  subTitle = "Create an account",
}: {
  subTitle: React.ReactNode;
}) {
  return (
    <Flex component="header" direction="column" justify="center" align="center">
      <Text component="h1" fz="h1" c="blue">
        <Link href={routes.all.home}>
          <PiShieldCheck /> Auth
        </Link>
      </Text>
      <Text component="h2" fz="h2" c="gray.6">
        {subTitle}
      </Text>
      <Divider size="sm" w="100%" mb="md" />
    </Flex>
  );
}
