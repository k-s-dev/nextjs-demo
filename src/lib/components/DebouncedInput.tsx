"use client";

import { useEffect, useState } from "react";

export default function DebouncedInput({
  value: initialValue,
  handleChangeAction,
  debounce = 500,
  ...props
}: {
  value: string | number;
  handleChangeAction: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      handleChangeAction(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [debounce, handleChangeAction, value]);

  return (
    <input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

