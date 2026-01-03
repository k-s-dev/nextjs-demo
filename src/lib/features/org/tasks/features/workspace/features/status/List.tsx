"use client";

import { useTasksContext } from "@/lib/features/org/tasks/TasksContext";
import { Button, Card, Flex, Text, Title, Tooltip } from "@mantine/core";
import { CardHeader } from "@/lib/ui/card";
import StatusFormRow, { StatusFormHeader } from "./form/Form";
import { generateRandomString } from "@/lib/utils/random";
import { Updater, useImmer } from "use-immer";
import DeleteModalButton from "@/lib/ui/form/DeleteModal";
import { useState } from "react";
import { deleteStatusesByIds } from "@/lib/dataModels/org/status/dataAccessLayer";

export default function StatusList({ workspaceId }: { workspaceId: string }) {
  const [resetKey, setResetKey] = useState(0);
  const [selectedIds, setSelectedIds] = useImmer<string[]>([]);
  const tasksCtx = useTasksContext();
  const workspace = tasksCtx.state.workspaces.find(
    (workspace) => workspace.id === workspaceId,
  );

  if (!workspace) {
    return null;
  }

  const statuses = workspace.statuses || [];

  const allSelected =
    statuses.length > 0 && statuses.every((el) => selectedIds.includes(el.id));
  const someSelected =
    statuses.length > 0 && statuses.some((el) => selectedIds.includes(el.id));

  function handleReset() {
    setSelectedIds([]);
    setResetKey((p) => p + 1);
  }

  function handleToggleSelection() {
    if (allSelected) setSelectedIds([]);
    statuses.forEach((el) => {
      if (!selectedIds.includes(el.id))
        setSelectedIds((prev) => {
          prev.push(el.id);
        });
    });
  }

  return (
    <>
      <Card key={resetKey} withBorder shadow="md" miw={800}>
        <CardHeader>
          <Flex justify={"space-between"}>
            <Title order={2} id="statuses">
              Statuses
            </Title>
            <Flex gap={"xs"}>
              <DeleteSelected
                selectedIds={selectedIds}
                setSelectedIdsAction={setSelectedIds}
              />
              <Button onClick={handleReset} color="gray" variant="light">
                Reset
              </Button>
            </Flex>
          </Flex>
        </CardHeader>
        <Flex gap={"xs"} direction={"column"}>
          <StatusFormHeader
            toggleAllAction={handleToggleSelection}
            checked={allSelected}
            indeterminate={!allSelected && someSelected}
          />
          {statuses.map((status) => {
            return (
              <StatusFormRow
                key={status.id}
                mode="update"
                workspace={workspace}
                status={status}
                selectedIds={selectedIds}
                setSelectedIdsAction={setSelectedIds}
              />
            );
          })}
          <StatusFormRow
            mode="create"
            workspace={workspace}
            randomFormId={generateRandomString(6)}
            selectedIds={selectedIds}
            setSelectedIdsAction={setSelectedIds}
          />
        </Flex>
      </Card>
    </>
  );
}

function DeleteSelected({
  selectedIds,
  setSelectedIdsAction,
}: {
  selectedIds: string[];
  setSelectedIdsAction: Updater<string[]>;
}) {
  return (
    <DeleteModalButton
      triggerContent={
        <>
          <Tooltip label="Delete selected">
            <Text component="span">Delete Selected</Text>
          </Tooltip>
        </>
      }
      deleteAction={async () => {
        const response = await deleteStatusesByIds(selectedIds);
        setSelectedIdsAction([]);
        return {
          status: response?.status || "error",
          errors: response?.errors || [],
        };
      }}
      disabled={selectedIds.length <= 0}
      color="red"
      variant="light"
      mb={"xs"}
    >
      <Text fz={"xl"} c={"red"}>
        Selected statuses will be deleted permanently.
      </Text>
    </DeleteModalButton>
  );
}
