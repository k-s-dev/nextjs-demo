"use client";

import { useMediaQuery } from "@mantine/hooks";

export function useGetMedia() {
  const isPhone = useMediaQuery("(0 <= width < 600px)");

  return { isPhone };
}
