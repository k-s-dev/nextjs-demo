import { Row, Table } from "@tanstack/react-table";
import { Checkbox } from "@mantine/core";

export function generateCheckboxHeader<T>({ table }: { table: Table<T> }) {
  return (
    <Checkbox
      {...{
        checked: table.getIsAllRowsSelected(),
        indeterminate: table.getIsSomeRowsSelected(),
        onChange: table.getToggleAllRowsSelectedHandler(),
      }}
    />
  );
}

export function generateCheckboxCell<T>({ row }: { row: Row<T> }) {
  return (
    <Checkbox
      {...{
        checked: row.getIsSelected(),
        disabled: !row.getCanSelect(),
        indeterminate: row.getIsSomeSelected(),
        onChange: row.getToggleSelectedHandler(),
      }}
      data-test-cy={`select-row-${row.index}`}
    />
  );
}
