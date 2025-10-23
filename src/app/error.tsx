"use client";

import { PermissionError } from "@/lib/utils/errors";
import styles from "./error.module.scss";
import { Blockquote, Card } from "@mantine/core";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  if (error.name === PermissionError.name) {
    return (
      <section className={styles.rootContainer}>
        <Card>
          <Blockquote color="red.3">Unauthorized access.</Blockquote>
        </Card>
      </section>
    );
  }

  return (
    <section className={styles.rootContainer}>
      <Blockquote color="orange">
        <header className={styles.header}>
          <h1>Something went wrong!</h1>
        </header>
        <p className={styles.text}>
          There seems to be an internal server error.
        </p>
      </Blockquote>
      <button
        className={styles.resetButton}
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
    </section>
  );
}
