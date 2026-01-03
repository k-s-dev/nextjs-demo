"use client";

import { Chip, Flex } from "@mantine/core";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

export default function SelectTaskView({ view }: { view: "grid" | "table" }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [state, setState] = useState(view);

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  function handleCheck(view: "grid" | "table") {
    setState(view);
    router.replace(pathname + "?" + createQueryString("view", view));
  }

  return (
    <Flex gap="xs">
      <Chip
        checked={state === "grid"}
        onClick={() => handleCheck("grid")}
        variant="outline"
      >
        Grid
      </Chip>
      <Chip
        checked={state === "table"}
        onClick={() => handleCheck("table")}
        variant="outline"
      >
        Table
      </Chip>
    </Flex>
  );
}
