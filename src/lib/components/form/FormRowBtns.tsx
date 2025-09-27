"use client";

import "./Form.scss"

export default function FormRowBtns({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section className="form-row-btns">{children}</section>;
}
