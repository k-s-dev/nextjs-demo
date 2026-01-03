"use client";

import { CardHeader } from "@/lib/ui/card";
import { Button, Card, Flex, TextInput, Title } from "@mantine/core";
import { useState } from "react";
import { FaArrowsRotate } from "react-icons/fa6";
import { useTasksContext } from "../../TasksContext";

export default function TaskSearch({
  formId = "task-search-form",
}: {
  formId?: string;
}) {
  const [state, setState] = useState("");
  const { dispatch } = useTasksContext();

  return (
    <Card shadow="md" mb={"xs"} p={"xs"}>
      <CardHeader>
        <Title order={2}>Search</Title>
      </CardHeader>
      <Flex
        direction={{ base: "column", md: "row" }}
        justify={"space-between"}
        gap={"xs"}
      >
        <Flex justify={"flex-start"} align={"flex-end"} wrap="wrap" gap={"xs"}>
          <TextInput
            form={formId}
            value={state}
            onChange={(e) => setState(e.target.value)}
            placeholder="Search text in title, description ..."
            w={{ base: 200, sm: 400 }}
          />
          <Button
            variant="light"
            onClick={() => {
              const searchString = state.split(",").map((el) => el.trim());
              dispatch({ type: "search:update", search: searchString });
            }}
          >
            Submit
          </Button>
          <Button
            variant="light"
            color="gray"
            onClick={() => {
              setState("");
              dispatch({ type: "search:update", search: null });
            }}
          >
            <FaArrowsRotate />
          </Button>
        </Flex>
      </Flex>
    </Card>
  );
}
