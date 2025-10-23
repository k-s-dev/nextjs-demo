"use client";

import FormMessage from "./FormMessage";

export default function FormError({
  errors,
  title = "Form Error",
  containerClass,
  listClass,
  itemClass,
  headerClass,
  appendContainerClass = true,
  appendHeaderClass = true,
  appendListClass = true,
  appendItemClass = true,
}: {
  errors?: string[];
  title?: string | null;
  containerClass?: string;
  listClass?: string;
  itemClass?: string;
  headerClass?: string;
  appendContainerClass?: boolean;
  appendHeaderClass?: boolean;
  appendListClass?: boolean;
  appendItemClass?: boolean;
}) {
  return (
    <>
      <FormMessage
        messages={errors}
        error
        title={title}
        containerClass={containerClass}
        listClass={listClass}
        itemClass={itemClass}
        headerClass={headerClass}
        appendContainerClass={appendContainerClass}
        appendHeaderClass={appendHeaderClass}
        appendListClass={appendListClass}
        appendItemClass={appendItemClass}
      />
    </>
  );
}
