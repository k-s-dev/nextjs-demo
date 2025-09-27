"use client";

import "./Table.scss";

import {
  Divider,
  Pagination,
  Select,
  Table,
  TableScrollContainer,
  TableTbody,
  TableTd,
  TableTh,
  TableThead,
  TableTr,
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
import { useMemo, useState } from "react";
import DebouncedInput from "../DebouncedInput";
import DeleteModal from "../form/DeleteModal";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  rowSelectionAction?: (ids: string[]) => Promise<"success" | "failed" | never>;
  rowSelectionActionTitle?: string;
}

const PAGE_SIZE = [2, 5, 10, 15, 20];

export function DataTable<TData, TValue>({
  columns,
  data,
  rowSelectionAction,
  rowSelectionActionTitle,
}: DataTableProps<TData, TValue>) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGE_SIZE[1],
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const table = useReactTable({
    data,
    columns,

    // hack: id must be provided by actual table usage
    // @ts-expect-error id must be provided by actual table usage
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
      <DataTablePagination table={table} />
      <DataTableInfo
        {...{
          rowSelection: rowSelection,
          rowSelectionAction: rowSelectionAction,
          rowSelectionActionTitle: rowSelectionActionTitle,
        }}
      />

      <Divider size="sm" mb="md" />
      <TableScrollContainer minWidth={600}>
        <Table striped withTableBorder withRowBorders withColumnBorders>
          <TableThead className="table-head">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableTr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableTh
                      key={header.id}
                      colSpan={header.colSpan}
                      className="table-th"
                    >
                      <div className="table-th-container">
                        {header.isPlaceholder ? null : (
                          <>
                            <div
                              {...{
                                className: header.column.getCanSort()
                                  ? "table-head-title-sort"
                                  : "table-head-title",
                                onClick:
                                  header.column.getToggleSortingHandler(),
                              }}
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                              {{
                                asc: " 🔼",
                                desc: " 🔽",
                              }[header.column.getIsSorted() as string] ?? null}
                            </div>
                            {header.column.getCanFilter() ? (
                              <Filter column={header.column} />
                            ) : null}
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
                <TableTd colSpan={columns.length} className="">
                  No results.
                </TableTd>
              </TableTr>
            )}
          </TableTbody>
        </Table>
      </TableScrollContainer>
      <Divider size="sm" mb="md" />
      <DataTablePagination table={table} />
      <DataTableInfo
        {...{
          rowSelection: rowSelection,
          rowSelectionAction: rowSelectionAction,
          rowSelectionActionTitle: rowSelectionActionTitle,
        }}
      />
    </>
  );
}

function DataTablePagination<TData>({ table }: { table: TsDataTable<TData> }) {
  return (
    <>
      <div className="table-pagination-container">
        <Pagination
          size="xs"
          withEdges
          withPages
          withControls
          total={table.getPageCount()}
          value={table.getState().pagination.pageIndex + 1}
          onChange={(n) => table.setPageIndex(n - 1)}
        />
        <div className="table-pagination-show-container">
          <div>Show</div>
          <Select
            size="xs"
            data={PAGE_SIZE.map((value) => value.toString())}
            value={table.getState().pagination.pageSize.toString()}
            onChange={(n) => table.setPageSize(Number(n))}
          />
        </div>
      </div>
    </>
  );
}

function DataTableInfo({
  rowSelection,
  rowSelectionAction,
  rowSelectionActionTitle = "Delete selected rows",
}: {
  rowSelection: RowSelectionState;
  rowSelectionAction?: (ids: string[]) => Promise<"success" | "failed" | never>;
  rowSelectionActionTitle?: string;
}) {
  const count = Object.values(rowSelection).reduce((count, item) => {
    return Number(count) + Number(item);
  }, 0);

  const identifier = `${count} user${count > 1 ? "s" : ""}`;

  return (
    <div className="table-info-container">
      <p className="table-info">
        <i>* Click column title to sort</i>
      </p>

      {rowSelectionAction && (
        <DeleteModal
          disabled={count < 1}
          tooltipLabel={count < 1 ? "No selection" : rowSelectionActionTitle}
          resource="User"
          identifier={identifier}
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
            const result = rowSelectionAction(ids);
            return result;
          }}
        />
      )}
    </div>
  );
}

function Filter<TData>({ column }: { column: Column<TData, unknown> }) {
  const columnFilterValue = column.getFilterValue();
  // @ts-expect-error column definition will be provided when calling data-table
  const { filterVariant } = column.columnDef.meta ?? {};

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
      <div className="table-filter-range-container">
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
          value={(columnFilterValue as [number, number])?.[0] ?? ""}
          handleChangeAction={(value) =>
            column.setFilterValue((old: [number, number]) => [value, old?.[1]])
          }
          placeholder={`Min ${
            column.getFacetedMinMaxValues()?.[0] !== undefined
              ? `(${column.getFacetedMinMaxValues()?.[0]})`
              : ""
          }`}
          className="table-filter table-filter-range"
        />
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
          value={(columnFilterValue as [number, number])?.[1] ?? ""}
          handleChangeAction={(value) =>
            column.setFilterValue((old: [number, number]) => [old?.[0], value])
          }
          placeholder={`Max ${
            column.getFacetedMinMaxValues()?.[1]
              ? `(${column.getFacetedMinMaxValues()?.[1]})`
              : ""
          }`}
          className="table-filter table-filter-range"
        />
      </div>
    </div>
  ) : filterVariant === "select" ? (
    <select
      onChange={(e) => column.setFilterValue(e.target.value)}
      value={columnFilterValue?.toString()}
    >
      {sortedUniqueValues.map((value) => (
        //dynamically generated select options from faceted values feature
        <option value={value} key={value} className="table-filter-select">
          {value}
        </option>
      ))}
    </select>
  ) : (
    <>
      {/* Autocomplete suggestions from faceted values feature */}
      <datalist id={column.id + "list"}>
        {sortedUniqueValues.map((value: string | number | undefined) => (
          <option value={value} key={value} className="table-filter-select" />
        ))}
      </datalist>
      <DebouncedInput
        type="text"
        value={(columnFilterValue ?? "") as string}
        handleChangeAction={(value) => column.setFilterValue(value)}
        placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
        className="table-filter table-filter-text"
        list={column.id + "list"}
      />
    </>
  );
}
