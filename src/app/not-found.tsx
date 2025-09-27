"use client";

import { useRouter } from "next/navigation";
import "./not-found.scss";

import { Blockquote } from "@mantine/core";

export default function NotFound() {
  const router = useRouter();

  return (
    <section className="not_found-container">
      <Blockquote color="orange">
        <b>Page</b>/<b>Resource</b> you were looking for, was <b>not found</b>.
      </Blockquote>
      <button
        type="button"
        className="not_found-back-btn"
        onClick={() => {
          router.back();
        }}
      >
        Back
      </button>
    </section>
  );
}
