"use client";

import styles from "./FormFieldsRow.module.scss";

export default function FormFieldsRow({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section className={styles.fieldsRow}>{children}</section>;
}
