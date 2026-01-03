"use client";

import { TUserPublic } from "../definitions";
import { useMemo } from "react";
import { DataTableWrapper } from "@/lib/ui/table/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import TableCellWithCopy from "@/lib/ui/table/TableCellWithCopy";
import { routes } from "@/lib/utils/routeMapper";
import Link from "next/link";
import CopyIcon from "@/lib/ui/icons/CopyIcon";
import { deleteUserServerAction } from "./delete/action/serverSingle";
import { deleteManyUsersServerAction } from "./delete/action/serverMany";
import {
  generateCheckboxCell,
  generateCheckboxHeader,
} from "@/lib/ui/table/TableCheckbox";
import { Anchor, Checkbox, Flex, Text } from "@mantine/core";
import { EditIcon } from "@/lib/ui/icons/TooltipIcons";
import DeleteModalIcon from "@/lib/ui/form/DeleteModalIcon";

export function UserTable({ users }: { users: TUserPublic[] }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columns = useMemo<ColumnDef<TUserPublic, any>[]>(() => {
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
        accessorKey: "email",
        id: "email",
        header: "Email",
        cell: (props) => {
          return (
            <>
              {props.row.original && (
                <Flex gap={"xs"} w={400}>
                  <Anchor
                    component={Link}
                    href={routes.admin.user.withId(
                      props.row.original.id,
                      "detail",
                    )}
                    fz="lg"
                    c="blue.7"
                    underline="not-hover"
                  >
                    {props.getValue()}
                  </Anchor>

                  <CopyIcon copyText={props.getValue()} />
                  <Link
                    style={{ alignItems: "center", display: "inline-flex" }}
                    href={routes.admin.user.withId(
                      props.row.original.id,
                      "update",
                    )}
                  >
                    <EditIcon />
                  </Link>

                  <DeleteModalIcon
                    deleteAction={async () => {
                      const result = await deleteUserServerAction(
                        props.row.original?.id,
                      );
                      return result;
                    }}
                    textProps={{ "data-test-cy": "delete-user-button" }}
                  >
                    <Text>
                      User: {props.row.original.email} will be permanently
                      deleted.
                    </Text>
                  </DeleteModalIcon>
                </Flex>
              )}
            </>
          );
        },
      },
      {
        accessorKey: "name",
        id: "name",
        header: "Name",
        cell: (props) => <TableCellWithCopy text={props.getValue()} />,
      },
      {
        accessorKey: "role",
        id: "role",
        header: "Role",
        cell: (props) => <span>{props.getValue()}</span>,
        footer: "Role",
      },
      {
        accessorKey: "emailVerfified",
        id: "emailVerified",
        header: "Verified",
        cell: (props) => {
          const emailVerified = props.row.original.emailVerified;
          return (
            <span>
              <Checkbox checked={emailVerified} onChange={() => {}} />
            </span>
          );
        },
        footer: "Verified",
        enableColumnFilter: false,
      },
      {
        accessorKey: "id",
        id: "id",
        header: "Id",
        cell: (props) => <TableCellWithCopy text={props.getValue()} />,
      },
    ];
  }, []);

  return (
    <DataTableWrapper
      key="admin-user-table"
      columns={columns}
      data={users}
      deleteModalContent={
        <Text c={"red"} fw={"bold"}>
          Selected user[s] will be deleted permanently.
        </Text>
      }
      rowSelectionAction={async (ids) => {
        if (ids.length === 0) return { status: "error" };
        const result = await deleteManyUsersServerAction(ids);
        return result;
      }}
      // NOTE: id needed for test
      tableProps={{ id: "admin-user-table", fz: "lg" }}
    />
  );
}
