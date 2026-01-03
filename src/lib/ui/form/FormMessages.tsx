"use client";

import { Flex, Text, Title } from "@mantine/core";

export default function FormMessages({
  messages,
  error,
  title,
}: FormMessagesProps) {
  if (!messages || messages.length <= 0) return null;

  const color = error ? "red" : "gray";

  return (
    <>
      {title && (
        <>
          <header>
            <Title>{title}</Title>
          </header>
        </>
      )}
      <Flex component="span" direction={"column"} gap={"xs"}>
        {messages.map((msg, idx) => {
          return (
            <Text
              component="span"
              key={idx}
              data-test-cy={error ? "form-error-item" : "form-message-item"}
              c={color}
            >
              {msg}
            </Text>
          );
        })}
      </Flex>
    </>
  );
}

export interface FormMessagesProps {
  messages?: string[] | [string, ...string[]];
  error?: boolean;
  title?: string | null;
}
