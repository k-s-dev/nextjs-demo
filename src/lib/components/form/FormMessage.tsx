"use client";

import styles from "./FormMessage.module.scss";
import { Divider } from "@mantine/core";
import clsx from "clsx";

export default function FormMessage({
  messages,
  error = false,
  title = "Message",
  containerClass,
  headerClass,
  listClass,
  itemClass,
  appendContainerClass = true,
  appendHeaderClass = true,
  appendListClass = true,
  appendItemClass = true,
}: FormMessageProps) {
  if (!messages || messages.length <= 0) return null;

  const finalContainerClass = clsx(
    appendContainerClass && styles.container,
    containerClass,
  );

  const finalHeaderClass = clsx(
    appendHeaderClass && styles.header,
    headerClass,
  );

  const finalListClass = clsx(
    appendListClass && styles.list,
    appendListClass && !error && styles.message,
    appendListClass && error && styles.error,
    listClass,
  );

  const finalItemClass = clsx(appendItemClass && styles.item, itemClass);

  const messageList = messages.map((msg) => {
    return (
      <li
        key={msg}
        className={finalItemClass}
        data-test-cy={error ? "form-error-item" : "form-message-item"}
      >
        {msg}
      </li>
    );
  });

  return (
    <section className={finalContainerClass}>
      {title && (
        <>
          <Divider size="md" my="sm" />
          <header className={finalHeaderClass}>
            <h4>{title}</h4>
          </header>
        </>
      )}
      <ul className={finalListClass}>{messageList}</ul>
    </section>
  );
}

export interface FormMessageProps {
  messages?: string[];
  error?: boolean;
  title?: string | null;
  containerClass?: string;
  listClass?: string;
  itemClass?: string;
  headerClass?: string;
  appendContainerClass?: boolean;
  appendHeaderClass?: boolean;
  appendListClass?: boolean;
  appendItemClass?: boolean;
}
