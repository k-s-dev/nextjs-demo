"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { IAdminModelInfo } from "./adminModelList";
import { DataTable } from "@/lib/components/table/DataTable";
import { useMemo, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { Tooltip } from "@mantine/core";

export function AdminTable({ modelList }: { modelList: IAdminModelInfo[] }) {
  const [data] = useState<IAdminModelInfo[]>([...modelList]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columns = useMemo<ColumnDef<IAdminModelInfo, any>[]>(() => {
    return [
      {
        accessorKey: "name",
        id: "name",
        header: "Name",
        cell: (props) => {
          return (
            <div className="table-cell">
              <Link href={props.row.original.href} className="link">
                {props.getValue()}
              </Link>
              <Tooltip label={`Add ${props.row.original.name}`}>
                <Link
                  href={`${props.row.original.rootPath}/create`}
                  className="link table-cell-icon"
                >
                  <FaPlus />
                </Link>
              </Tooltip>
            </div>
          );
        },
        sortingFn: "alphanumeric",
        sortDescFirst: true,
      },
      {
        accessorKey: "category",
        id: "category",
        header: "Category",
        cell: (info) => <div className="table-cell">{info.getValue()}</div>,
        sortingFn: "alphanumeric",
        sortDescFirst: true,
      },
      {
        accessorKey: "count",
        id: "count",
        header: "Count",
        cell: (info) => (
          <div className="table-cell">{info.getValue().toString()}</div>
        ),
        meta: {
          filterVariant: "range",
        },
      },
    ];
  }, []);

  return <DataTable key="admin-table" columns={columns} data={data} />;
}
