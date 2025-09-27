"use client";

import { TUserPublic } from "../definitions";
import { useEffect, useMemo, useState } from "react";
import { DataTable } from "@/lib/components/table/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import TableCellWithCopy from "@/lib/components/table/TableCellWithCopy";
import { Checkbox } from "@mantine/core";
import TableCell from "@/lib/components/table/TableCell";
import { dateFormat1 } from "@/lib/utils/format";
import { routes } from "@/lib/utils/routeMapper";
import Link from "next/link";
import EditIcon from "@/lib/components/icons/EditIcon";
import CopyIcon from "@/lib/components/icons/CopyIcon";
import DeleteModal from "@/lib/components/form/DeleteModal";
import { deleteUserServerAction } from "./delete/action/serverSingle";
import { deleteManyUsersServerAction } from "./delete/action/serverMany";

export function UserTable({ users }: { users: TUserPublic[] }) {
  const [data, setData] = useState([...users]);

  useEffect(() => {
    setData([...users]);
  }, [users]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columns = useMemo<ColumnDef<TUserPublic, any>[]>(() => {
    return [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
          />
        ),
        cell: ({ row }) => (
          <TableCell>
            <Checkbox
              {...{
                checked: row.getIsSelected(),
                disabled: !row.getCanSelect(),
                indeterminate: row.getIsSomeSelected(),
                onChange: row.getToggleSelectedHandler(),
              }}
            />
          </TableCell>
        ),
      },
      {
        accessorKey: "email",
        id: "email",
        header: "Email",
        cell: (props) => {
          return (
            <>
              {props.row.original && (
                <>
                  <TableCell className="table-cell table-cell--primary">
                    <Link
                      href={routes.admin.user.withId(
                        props.row.original.id,
                        "detail",
                      )}
                      className="link"
                    >
                      {props.getValue()}
                    </Link>
                    <section className="table-cell-icons-row">
                      <CopyIcon copyText={props.getValue()} />
                      <Link
                        href={routes.admin.user.withId(
                          props.row.original.id,
                          "update",
                        )}
                      >
                        <EditIcon />
                      </Link>
                      <DeleteModal
                        resource="User"
                        identifier={`${props.row.original.email} (id: ${props.row.original.id})`}
                        deleteAction={async () => {
                          const result = await deleteUserServerAction(
                            props.row.original?.id,
                          );
                          return result;
                        }}
                      />
                    </section>
                  </TableCell>
                </>
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
        cell: (props) => <div className="table-cell">{props.getValue()}</div>,
        footer: "Role",
      },
      {
        accessorKey: "emailVerfified",
        id: "emailVerified",
        header: "Verified",
        cell: (props) => {
          const emailVerified = props.row.original.emailVerified;
          const dateObj = emailVerified ? new Date(emailVerified) : undefined;
          return (
            <div className="table-cell">
              {dateObj ? dateFormat1.format(dateObj) : ""}
            </div>
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
    <DataTable
      key="admin-user-table"
      columns={columns}
      data={data}
      rowSelectionAction={async (ids) => {
        if (ids.length === 0) return "failed";
        const result = await deleteManyUsersServerAction(ids);
        return result;
      }}
    />
  );
}
