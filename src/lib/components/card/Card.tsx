"use client";

import styles from "./Card.module.scss";

export function Card({ children }: { children: React.ReactNode }) {
  return <section className={styles.card}>{children}</section>;
}
