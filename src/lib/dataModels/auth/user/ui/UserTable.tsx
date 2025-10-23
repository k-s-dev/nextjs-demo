"use client";

import * as dtStyles from "@/lib/components/table/DataTable.module.scss";
import { TUserPublic } from "../definitions";
import { useEffect, useMemo, useState } from "react";
import { DataTable } from "@/lib/components/table/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import TableCellWithCopy from "@/lib/components/table/TableCellWithCopy";
import TableCell from "@/lib/components/table/TableCell";
import { routes } from "@/lib/utils/routeMapper";
import Link from "next/link";
import CopyIcon from "@/lib/components/icons/CopyIcon";
import { deleteUserServerAction } from "./delete/action/serverSingle";
import { deleteManyUsersServerAction } from "./delete/action/serverMany";
import clsx from "clsx";
import {
  generateCheckboxCell,
  generateCheckboxHeader,
} from "@/lib/components/table/TableCheckbox";
import { Anchor, Checkbox } from "@mantine/core";
import { EditIcon } from "@/lib/components/icons/TooltipIcons";
import DeleteModalIcon from "@/lib/components/form/DeleteModalIcon";

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
                <>
                  <TableCell
                    className={clsx(
                      dtStyles.default.cell,
                      dtStyles.default.cellPrimary,
                    )}
                  >
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
                    <section className={dtStyles.default.cellIconsRow}>
                      <CopyIcon copyText={props.getValue()} />
                      <Link
                        href={routes.admin.user.withId(
                          props.row.original.id,
                          "update",
                        )}
                      >
                        <EditIcon />
                      </Link>
                      <DeleteModalIcon
                        resource="User"
                        identifier={`${props.row.original.email} (id: ${props.row.original.id})`}
                        deleteAction={async () => {
                          const result = await deleteUserServerAction(
                            props.row.original?.id,
                          );
                          return result;
                        }}
                        data-test-cy="delete-user-button"
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
        cell: (props) => (
          <div className={dtStyles.default.cell}>{props.getValue()}</div>
        ),
        footer: "Role",
      },
      {
        accessorKey: "emailVerfified",
        id: "emailVerified",
        header: "Verified",
        cell: (props) => {
          const emailVerified = props.row.original.emailVerified;
          return (
            <div className={dtStyles.default.cell}>
              <Checkbox checked={emailVerified} onChange={() => {}} />
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
        if (ids.length === 0) return { status: "error" };
        const result = await deleteManyUsersServerAction(ids);
        return result;
      }}
      // NOTE: id needed for test
      tableProps={{ id: "admin-user-table", fz: "lg" }}
    />
  );
}
