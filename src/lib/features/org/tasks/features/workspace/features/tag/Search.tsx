"use client";

import { TextInput } from "@mantine/core";
import { Dispatch, SetStateAction } from "react";

export default function SearchTag({
  search,
  setSearchAction,
}: {
  search: string;
  setSearchAction: Dispatch<SetStateAction<string>>;
}) {
  return (
    <TextInput
      value={search}
      onChange={(e) => setSearchAction(e.target.value)}
      placeholder="Search tags ..."
      w={{ base: 200, sm: 400 }}
    />
  );
}
