"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { DataTableWrapper } from "@/lib/ui/table/DataTable";
import { useMemo, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { Anchor, Flex, Tooltip } from "@mantine/core";
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
            <Flex gap={"xs"} align={"center"}>
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
                <Anchor
                  component={Link}
                  href={`${props.row.original.rootPath}/create`}
                  c={"blue.7"}
                >
                  <FaPlus />
                </Anchor>
              </Tooltip>
            </Flex>
          );
        },
        sortingFn: "alphanumeric",
        sortDescFirst: true,
      },
      {
        accessorKey: "category",
        id: "category",
        header: "Category",
        cell: (info) => <span>{info.getValue()}</span>,
        sortingFn: "alphanumeric",
        sortDescFirst: true,
      },
      {
        accessorKey: "count",
        id: "count",
        header: "Count",
        cell: (info) => <span>{info.getValue().toString()}</span>,
        meta: {
          filterVariant: "range",
        },
      },
    ];
  }, []);

  return (
    <DataTableWrapper
      key="admin-table"
      data={data}
      columns={columns}
      tableProps={{ fz: "xl" }}
    />
  );
}
