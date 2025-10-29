"use client";

import styles from "./AdminFormLinksContainer.module.scss";
import clsx from "clsx";
import { ReactNode } from "react";

export default function AdminFormLinksContainer({
  children,
  className,
  overwriteClassName = false,
}: {
  children: ReactNode;
  className?: string;
  overwriteClassName?: boolean;
}) {
  const cn = clsx(
    !overwriteClassName && styles.buttonsRow,
    className,
  )
  return <section className={cn}>{children}</section>;
}
