"use client";

import { Divider, Flex } from "@mantine/core";
import TaskTree from "./Tree";

export default function TaskList() {
  return (
    <>
      <Flex direction="column" gap={"sm"} mb={"sm"}>
        <h1>Task List</h1>
        <Divider />
        <Flex direction="column" gap="sm" mb={"sm"} py={"sm"}>
          <TaskTree />
        </Flex>
      </Flex>
    </>
  );
}
