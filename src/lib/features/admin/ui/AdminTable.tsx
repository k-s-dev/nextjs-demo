"use client";

import * as dtStyles from "@/lib/components/table/DataTable.module.scss";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { DataTable } from "@/lib/components/table/DataTable";
import { useMemo, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { Anchor, Tooltip } from "@mantine/core";
import clsx from "clsx";
import { IAdminModelInfo } from "../adminModelList";

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
            <div className={dtStyles.default.cell}>
              <Anchor
                component={Link}
                href={props.row.original.href}
                underline="not-hover"
                fz="lg"
                c="blue.7"
              >
                {props.getValue()}
              </Anchor>
              <Tooltip label={`Add ${props.row.original.name}`}>
                <Link
                  href={`${props.row.original.rootPath}/create`}
                  className={clsx("link", dtStyles.default.cellIcon)}
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
        cell: (info) => (
          <div className={dtStyles.default.cell}>{info.getValue()}</div>
        ),
        sortingFn: "alphanumeric",
        sortDescFirst: true,
      },
      {
        accessorKey: "count",
        id: "count",
        header: "Count",
        cell: (info) => (
          <div className={dtStyles.default.cell}>
            {info.getValue().toString()}
          </div>
        ),
        meta: {
          filterVariant: "range",
        },
      },
    ];
  }, []);

  return (
    <DataTable
      key="admin-table"
      columns={columns}
      data={data}
      tableProps={{ fz: "xl" }}
    />
  );
}
