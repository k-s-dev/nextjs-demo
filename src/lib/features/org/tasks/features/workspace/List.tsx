"use client";

import { Workspace } from "@/generated/prisma/client";
import { DataTableWrapper } from "@/lib/ui/table/DataTable";
import {
  generateCheckboxCell,
  generateCheckboxHeader,
} from "@/lib/ui/table/TableCheckbox";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { Button, Text } from "@mantine/core";
import Link from "next/link";
import { routes } from "@/lib/utils/routeMapper";
import { useTasksContext } from "@/lib/features/org/tasks/TasksContext";
import DeleteModalButton from "@/lib/ui/form/DeleteModal";
import {
  deleteWorkspaceById,
  deleteWorkspacesByIds,
} from "@/lib/dataModels/org/workspace/dataAccessLayer";

export default function WorkspaceList() {
  const tasksCtx = useTasksContext();
  const workspaces = tasksCtx.state.workspaces;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columns = useMemo<ColumnDef<Workspace, any>[]>(() => {
    return [
      {
        id: "select",
        header: ({ table }) => {
          return generateCheckboxHeader({ table });
        },
        cell: ({ row }) => {
          return generateCheckboxCell({ row });
        },
      },
      {
        accessorKey: "name",
        id: "name",
        header: "Name",
        cell: (props) => props.getValue(),
      },
      {
        id: "view",
        header: "View",
        cell: (props) => (
          <Button
            component={Link}
            href={routes.org.tasks.workspace.withId(props.row.original.id)}
            variant="outline"
            color="blue"
          >
            View, Configure
          </Button>
        ),
      },
      {
        id: "Delete",
        header: "Delete",
        cell: (props) => (
          <DeleteModalButton
            deleteAction={async () => {
              const response = await deleteWorkspaceById(props.row.original.id);
              return { status: response.status, errors: response.errors };
            }}
            variant="outline"
            color="red"
          >
            <Text fz={"h3"} c={"red"}>
              Workspace <b>{props.row.original.name}</b> will be permanently
              deleted.
            </Text>
            <Text>
              All related settings like categories, tags, statuses, priorities
              will be deleted too.
            </Text>
          </DeleteModalButton>
        ),
      },
    ];
  }, []);

  return (
    <>
      <DataTableWrapper
        columns={columns}
        data={workspaces}
        deleteModalContent={
          <>
            <Text c={"red"} fz={"h3"} mb={"md"}>
              Selected workspaces will be deleted permanently.
            </Text>
            <Text>
              All related settings like categories, tags, statuses, priorities
              will be deleted too.
            </Text>
          </>
        }
        rowSelectionAction={async (ids) => {
          if (ids.length === 0) return { status: "error" };
          const response = await deleteWorkspacesByIds(ids);
          return response;
        }}
        rowSelectionActionTitle="Workspace"
        tableProps={{ id: "workspace-list-table", fz: "lg" }}
        show={{
          pagination: { top: true, bottom: false },
          info: { top: true, bottom: false },
        }}
      />
    </>
  );
}
