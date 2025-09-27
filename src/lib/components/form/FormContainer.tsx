"use client";

import "./Form.scss"

export default function FormContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section className="form-container">{children}</section>;
}
