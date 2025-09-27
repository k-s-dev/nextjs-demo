"use client";

import { Blockquote } from "@mantine/core";
import "./error.scss";

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

  return (
    <section className="error-page-container">
      <Blockquote color="orange">
        <header className="error-page-header">
          <h1>Something went wrong!</h1>
        </header>
        <p className="error-page-text">
          There seems to be an internal server error.
        </p>
      </Blockquote>
      <button
        className="error-page-btn--reset"
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
