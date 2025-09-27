"use client";

import "./Card.scss"

export function CardHeader({
  children,
}: {
  children: React.ReactNode;
}) {
  return <header className="card-header">{children}</header>;
}
