"use client";

import "./Card.scss"

export function CardContent({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section className="card-content">{children}</section>;
}
