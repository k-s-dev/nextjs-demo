"use client";

import styles from "./Card.module.scss";

export function CardHeader({
  children,
}: {
  children: React.ReactNode;
}) {
  return <header className={styles.header}>{children}</header>;
}
