"use client";

import styles from "./Card.module.scss";

export function CardContent({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section className={styles.content}>{children}</section>;
}
