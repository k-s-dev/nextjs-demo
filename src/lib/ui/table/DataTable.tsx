"use client";

import styles from "./DataTable.module.scss";
import {
  Center,
  Divider,
  NumberInput,
  Pagination,
  Select,
  Table,
  TableProps,
  TableScrollContainer,
  TableTbody,
  TableTd,
  TableTh,
  TableThead,
  TableTr,
  TextInput,
} from "@mantine/core";
import {
  Column,
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  RowSelectionState,
  SortingState,
  Table as TsDataTable,
  useReactTable,
} from "@tanstack/react-table";
import { ReactNode, useMemo, useState } from "react";
import clsx from "clsx";
import DeleteModalIcon from "../form/DeleteModalIcon";
import { TServerResponsePromise } from "@/lib/types/serverResponse";
import { FaArrowDown, FaArrowUp } from "react-icons/fa6";
import { useDebouncedCallback } from "@mantine/hooks";

interface DataTableWrapperProps<TData, TValue> {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  deleteModalContent?: string | ReactNode;
  rowSelectionAction?: (ids: string[]) => TServerResponsePromise;
  rowSelectionActionTitle?: string;
  pageSize?: number[];
  tableProps?: TableProps;
  show?: {
    pagination?: {
      top?: boolean;
      bottom?: boolean;
    };
    info?: {
      top?: boolean;
      bottom?: boolean;
    };
  };
}

export function DataTableWrapper<TData, TValue>({
  data,
  columns,
  deleteModalContent,
  rowSelectionAction,
  rowSelectionActionTitle,
  pageSize = [5, 10, 25, 50, 100],
  tableProps,
  show = {
    pagination: {
      top: true,
      bottom: true,
    },
    info: {
      top: true,
      bottom: true,
    },
  },
}: DataTableWrapperProps<TData, TValue>) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: pageSize[pageSize.length - 1],
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const table = useReactTable({
    data,
    columns,

    // NOTE:HACK: @ts-expect-error
    // @ts-expect-error id must be present in table data provided
    getRowId: (row) => row.id,

    getCoreRowModel: getCoreRowModel(),

    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,

    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    autoResetPageIndex: false,

    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,

    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),

    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,

    state: {
      sorting,
      pagination,
      columnFilters,
      rowSelection,
    },
  });

  return (
    <>
      {show.pagination?.top && (
        <DataTablePagination table={table} pageSize={pageSize} />
      )}
      {show.info?.top && (
        <DataTableInfo
          {...{
            rowSelection,
            deleteModalContent,
            rowSelectionAction,
            rowSelectionActionTitle,
          }}
        />
      )}
      {(show.pagination?.top || show.info?.top) && (
        <Divider size="sm" mb="xs" />
      )}

      <DataTable table={table} columns={columns} tableProps={tableProps} />

      {(show.pagination?.bottom || show.info?.bottom) && (
        <>
          <Divider size="sm" mb="md" />
        </>
      )}
      {show.pagination?.bottom && (
        <DataTablePagination table={table} pageSize={pageSize} />
      )}
      {show.info?.bottom && (
        <DataTableInfo
          {...{
            rowSelection,
            deleteModalContent,
            rowSelectionAction,
            rowSelectionActionTitle,
          }}
        />
      )}
    </>
  );
}

export interface DataTableProps<TData, TValue> {
  table: TsDataTable<TData>;
  columns: ColumnDef<TData, TValue>[];
  tableProps?: TableProps;
}

export function DataTable<TData, TValue>({
  table,
  columns,
  tableProps,
}: DataTableProps<TData, TValue>) {
  return (
    <>
      {/* Note: max-width is linked to admin root layout 20-80 (1fr 4fr) sidebar-main */}
      <Center maw="80vw">
        <TableScrollContainer minWidth={200}>
          <Table
            striped
            withTableBorder
            withRowBorders
            withColumnBorders
            verticalSpacing="sm"
            {...tableProps}
          >
            <TableThead>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableTr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableTh
                        key={header.id}
                        colSpan={header.colSpan}
                        className={styles.th}
                      >
                        <div className={styles.thContainer}>
                          {header.column.getCanFilter() ? (
                            <Filter column={header.column} />
                          ) : (
                            <div></div>
                          )}
                          {header.isPlaceholder ? null : (
                            <>
                              <div
                                onClick={header.column.getToggleSortingHandler()}
                              >
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext(),
                                )}
                                {{
                                  asc: <FaArrowUp />,
                                  desc: <FaArrowDown />,
                                }[header.column.getIsSorted() as string] ??
                                  null}
                              </div>
                            </>
                          )}
                        </div>
                      </TableTh>
                    );
                  })}
                </TableTr>
              ))}
            </TableThead>
            <TableTbody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableTr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableTd key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableTd>
                    ))}
                  </TableTr>
                ))
              ) : (
                <TableTr>
                  <TableTd colSpan={columns.length} className={styles.td}>
                    No results.
                  </TableTd>
                </TableTr>
              )}
            </TableTbody>
          </Table>
        </TableScrollContainer>
      </Center>
    </>
  );
}

export function DataTablePagination<TData>({
  table,
  pageSize,
}: {
  table: TsDataTable<TData>;
  pageSize: number[];
}) {
  const pageSizeOptions = pageSize
    .filter((value) => value !== table.getRowCount())
    .map((value) => value.toString());

  return (
    <>
      <div className={styles.paginationContainer}>
        <Pagination
          size="xs"
          withEdges
          withPages
          withControls
          total={table.getPageCount()}
          value={table.getState().pagination.pageIndex + 1}
          onChange={(n) => table.setPageIndex(n - 1)}
        />
        <div className={styles.paginationShowContainer}>
          <div>Show</div>
          <Select
            size="xs"
            data={[
              { value: table.getRowCount().toString(), label: "All" },
              ...pageSizeOptions,
            ]}
            value={table.getState().pagination.pageSize.toString()}
            onChange={(n) => table.setPageSize(Number(n))}
          />
        </div>
      </div>
    </>
  );
}

export function DataTableInfo({
  deleteModalContent,
  rowSelection,
  rowSelectionAction,
  rowSelectionActionTitle = "Delete selected rows",
}: {
  deleteModalContent?: ReactNode;
  rowSelection: RowSelectionState;
  rowSelectionAction?: (ids: string[]) => TServerResponsePromise;
  rowSelectionActionTitle?: string;
}) {
  const count = Object.values(rowSelection).reduce((count, item) => {
    return Number(count) + Number(item);
  }, 0);

  return (
    <div className={styles.infoContainer}>
      <p className={styles.info}>
        <i>* Click column title to sort</i>
      </p>

      {rowSelectionAction && (
        <DeleteModalIcon
          disabled={count < 1}
          tooltipLabel={count < 1 ? "No selection" : rowSelectionActionTitle}
          deleteAction={async () => {
            const ids = [];
            for (const rowId in rowSelection) {
              if (rowSelection.hasOwnProperty(rowId)) {
                const isSelected = rowSelection[rowId];
                if (isSelected) {
                  ids.push(rowId);
                }
              }
            }
            const result = await rowSelectionAction(ids);
            return result;
          }}
          textProps={{ "data-test-cy": "delete-all-button" }}
        >
          {deleteModalContent}
        </DeleteModalIcon>
      )}
    </div>
  );
}

export function Filter<TData>({ column }: { column: Column<TData, unknown> }) {
  const columnFilterValue = column.getFilterValue();
  // NOTE:HACK: @ts-expect-error
  // @ts-expect-error column definition will be provided when calling data-table
  const { filterVariant } = column.columnDef.meta ?? {};
  const [value, setValue] = useState<
    string | number | [number, number] | undefined
  >("");
  const debouncedSetFilterRangeMin = useDebouncedCallback(
    (value) =>
      column.setFilterValue((old: [number, number]) => [value, old?.[1]]),
    {
      delay: 500,
      flushOnUnmount: true,
    },
  );
  const debouncedSetFilterRangeMax = useDebouncedCallback(
    (value) =>
      column.setFilterValue((old: [number, number]) => [old?.[0], value]),
    {
      delay: 500,
      flushOnUnmount: true,
    },
  );
  const debouncedSetFilterText = useDebouncedCallback(
    (value) => column.setFilterValue(value),
    {
      delay: 500,
      flushOnUnmount: true,
    },
  );

  const sortedUniqueValues = useMemo(
    () =>
      filterVariant === "range"
        ? []
        : Array.from(column.getFacetedUniqueValues().keys())
            .sort()
            .slice(0, 5000),
    [column, filterVariant],
  );

  return filterVariant === "range" ? (
    <div>
      <div className={styles.filterRangeContainer}>
        <NumberInput
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
          value={(value as [number, number])?.[0] ?? ""}
          onChange={(value) => {
            setValue(value);
            debouncedSetFilterRangeMin(value);
          }}
          placeholder={`Min ${
            column.getFacetedMinMaxValues()?.[0] !== undefined
              ? `(${column.getFacetedMinMaxValues()?.[0]})`
              : ""
          }`}
          className={clsx(styles.filter)}
          w={100}
        />
        <NumberInput
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
          value={(value as [number, number])?.[1] ?? ""}
          onChange={(value) => {
            setValue(value);
            debouncedSetFilterRangeMax(value);
          }}
          placeholder={`Max ${
            column.getFacetedMinMaxValues()?.[1]
              ? `(${column.getFacetedMinMaxValues()?.[1]})`
              : ""
          }`}
          className={clsx(styles.filter, styles.filterRange)}
          w={100}
        />
      </div>
    </div>
  ) : filterVariant === "select" ? (
    <Select
      data={sortedUniqueValues}
      defaultValue={columnFilterValue?.toString()}
    />
  ) : (
    <>
      {/* Autocomplete suggestions from faceted values feature */}
      <datalist id={column.id + "list"}>
        {sortedUniqueValues.map((value: string | number | undefined) => (
          <option value={value} key={value} className={styles.filterSelect} />
        ))}
      </datalist>
      <TextInput
        value={(value ?? "") as string}
        onChange={(e) => {
          setValue(e.target.value);
          debouncedSetFilterText(e.target.value);
        }}
        placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
        className={clsx(styles.filter, styles.filterText)}
        list={column.id + "list"}
      />
    </>
  );
}
