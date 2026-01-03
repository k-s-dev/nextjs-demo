"use client";

import { CardHeader } from "@/lib/ui/card";
import { Button, Card, Checkbox, Flex, Text, Title } from "@mantine/core";
import CreateTag from "./Create";
import EditTag from "./Edit";
import { useState } from "react";
import { useTasksContext } from "../../../../TasksContext";
import SearchTag from "./Search";
import { useImmer } from "use-immer";
import { deleteTagsByIds } from "@/lib/dataModels/org/tag/dataAccessLayer";
import { notifications } from "@mantine/notifications";
import { FaArrowsRotate } from "react-icons/fa6";
import DeleteModalButton from "@/lib/ui/form/DeleteModal";

export default function TagList() {
  const [resetKey, setResetKey] = useState(0);
  const [search, setSearch] = useState("");
  const [names, setNames] = useState("");
  const [selection, setSelection] = useImmer<string[]>([]);
  const tasksCtx = useTasksContext();

  const tags =
    tasksCtx.state.tags.filter((tag) => {
      if (search === "") return true;
      for (const pattern of search.split(",")) {
        return tag.name.includes(pattern);
      }
    }) || [];

  const allSelected =
    selection.length > 0 && tags.every((tag) => selection.includes(tag.id));
  const someSelected =
    selection.length > 0 && tags.some((tag) => selection.includes(tag.id));

  function toggleAllSelection() {
    if (!allSelected) {
      setSelection((draft) => {
        tags.forEach((tag) => {
          if (!draft.includes(tag.id)) {
            draft.push(tag.id);
          }
        });
      });
    } else {
      setSelection(() => []);
    }
  }

  async function deleteSelected() {
    setSelection([]);
    const response = await deleteTagsByIds(selection);
    if (response.status === "success")
      notifications.show({ message: ["Selected tags deleted successfully."] });
    if (response.errors) notifications.show({ message: response.errors });
    return response;
  }

  function handleReset() {
    setSearch("");
    setSelection([]);
    setNames("");
    setResetKey((p) => p + 1);
  }

  return (
    <Card key={resetKey} withBorder shadow="md">
      <CardHeader>
        <Flex justify={"space-between"}>
          <Title order={2} id="tags">
            Tags
          </Title>
          <Button variant="subtle" color="gray" onClick={handleReset}>
            <FaArrowsRotate />
          </Button>
        </Flex>
      </CardHeader>
      <Flex gap={"xs"} direction={"column"} align={"flex-start"}>
        <CreateTag value={names} setValue={setNames} />
        <Flex gap={"xs"} justify={"space-between"} align={"center"}>
          <Checkbox
            checked={allSelected}
            indeterminate={!allSelected && someSelected}
            onClick={toggleAllSelection}
          />
          <SearchTag search={search} setSearchAction={setSearch} />
          <DeleteModalButton
            deleteAction={deleteSelected}
            disabled={selection.length === 0}
            triggerContent="Delete Selected"
          >
            <Text fz={"h3"} c={"red"}>
              Selected tags will be deleted permanently.
            </Text>
            <Text c={"gray"}>Confirm to proceed.</Text>
          </DeleteModalButton>
        </Flex>
        <Flex gap={"xs"} wrap={"wrap"}>
          {tags.map((tag) => (
            <EditTag
              key={tag.id}
              tag={tag}
              selected={selection.includes(tag.id)}
              setSelectionAction={setSelection}
            />
          ))}
        </Flex>
      </Flex>
    </Card>
  );
}
