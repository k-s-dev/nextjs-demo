"use client";

import "./Card.scss"

export function Card({ children }: { children: React.ReactNode }) {
  return <section className="card">{children}</section>;
}
