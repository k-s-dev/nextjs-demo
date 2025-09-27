"use client";

import { Divider } from "@mantine/core";

import "./Form.scss"

export default function FormHeader({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <section className="form-header">{children}</section>
      <Divider size="md" my="sm" />
    </>
  );
}
