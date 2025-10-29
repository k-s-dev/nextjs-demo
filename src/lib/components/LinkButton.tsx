"use client";

import { Button, ButtonProps } from "@mantine/core";
import Link from "next/link";

export default function LinkButton({
  href,
  children,
  ...restProps
}: TLinkButtonProps) {
  return (
    <Button component={Link} href={href} {...restProps}>
      {children}
    </Button>
  );
}

export type TLinkButtonProps = {
  href: string;
} & ButtonProps;
