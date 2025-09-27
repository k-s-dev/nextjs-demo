"use client";

import { Divider } from "@mantine/core";
import { v4 as uuidv4 } from "uuid";

import "./Form.scss";


export default function FormMessage({
  messages,
  title = "Message",
  rootClass = "form-message",
  itemClass = "form-message-item",
}: {
  messages?: string[];
  title?: string | null;
  rootClass?: string;
  itemClass?: string;
}) {
  if (!messages || messages.length <= 0) return null;

  const messageList = messages.map((msg) => {
    return (
      <li key={uuidv4()} className={itemClass}>
        {msg}
      </li>
    );
  });

  return (
    <section className={`${rootClass}-container`}>
      {title && (
        <>
          <Divider size="md" my="sm" />
          <header className={`${rootClass}-header`}>
            <h4>{title}</h4>
          </header>
        </>
      )}
      <ul className={rootClass}>{messageList}</ul>
    </section>
  );
}
