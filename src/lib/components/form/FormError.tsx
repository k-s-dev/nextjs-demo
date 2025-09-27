"use client";

import "./Form.scss";

import FormMessage from "./FormMessage";

export default function FormError({
  errors,
  title = "Form Error",
  rootClass = "form-error",
  itemClass = "form-error-item",
}: {
  errors?: string[];
  title?: string | null;
  rootClass?: string;
  itemClass?: string;
}) {
  return (
    <>
      <FormMessage
        messages={errors}
        title={title}
        rootClass={rootClass}
        itemClass={itemClass}
      />
    </>
  );
}
