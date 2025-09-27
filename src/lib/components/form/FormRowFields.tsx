"use client";

import "./Form.scss"

export default function FormRowFields({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section className="form-row-fields">{children}</section>;
}

