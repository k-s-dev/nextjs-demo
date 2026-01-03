"use client";

import {
  Button,
  Chip,
  ChipGroup,
  Divider,
  Flex,
  Title,
  Tooltip,
} from "@mantine/core";
import { useTasksContext } from "../../TasksContext";
import { FaArrowDown, FaArrowsRotate, FaArrowUp } from "react-icons/fa6";
import { TTaskUi } from "@/lib/dataModels/org/task/definitions";

export default function TaskSort() {
  const { dispatch } = useTasksContext();

  return (
    <Flex direction={"column"} gap={"xs"}>
      <Flex justify="space-between" gap={"xs"} wrap={"wrap"}>
        <Title order={2}>Sort</Title>
        <Tooltip label="Reset all sort options">
          <Button
            variant="subtle"
            color="gray"
            onClick={() => dispatch({ type: "sort:reset" })}
          >
            <FaArrowsRotate />
          </Button>
        </Tooltip>
      </Flex>
      <Divider />
      <SortSpec
        name={"title"}
        ascendingFn={(a, b) => a.title.localeCompare(b.title)}
      />
      <SortSpec
        name={"category"}
        ascendingFn={(a, b) => a.category.name.localeCompare(b.category.name)}
      />
      <SortSpec
        name={"End Date"}
        ascendingFn={(a, b) => {
          let result = 0;
          if (a.end_date && b.end_date) {
            if (a.end_date > b.end_date) result = 1;
            if (a.end_date < b.end_date) result = -1;
          }
          return result;
        }}
      />
      <SortSpec
        name={"Start Date"}
        ascendingFn={(a, b) => {
          let result = 0;
          if (a.start_date && b.start_date) {
            if (a.start_date > b.start_date) result = 1;
            if (a.start_date < b.start_date) result = -1;
          }
          return result;
        }}
      />
    </Flex>
  );
}

function SortSpec({
  name,
  ascendingFn,
}: {
  name: string;
  ascendingFn: (a: TTaskUi, b: TTaskUi) => number;
}) {
  const { state, dispatch } = useTasksContext();
  const spec = state.sort.find((el) => el.name === name);

  return (
    <Flex justify={"space-between"} align={"baseline"} gap={"xs"} wrap={"wrap"}>
      <Title order={3} fz={"h6"} tt={"capitalize"}>
        {name}
      </Title>
      <Flex align={"baseline"} gap={"xs"} wrap={"wrap"}>
        <ChipGroup>
          <Chip
            variant="outline"
            checked={!spec || !spec.direction}
            onClick={() => {
              dispatch({
                type: "sort:update",
                spec: { name, direction: null },
              });
            }}
          >
            Off
          </Chip>
          <Chip
            variant="outline"
            checked={spec && spec.direction === "ascending"}
            onClick={() => {
              dispatch({
                type: "sort:update",
                spec: {
                  name,
                  direction: "ascending",
                  fn: (a, b) => ascendingFn(a, b),
                },
              });
            }}
          >
            <FaArrowUp />
          </Chip>
          <Chip
            variant="outline"
            checked={spec && spec.direction === "descending"}
            onClick={() => {
              dispatch({
                type: "sort:update",
                spec: {
                  name,
                  direction: "descending",
                  fn: (a, b) => {
                    const result = ascendingFn(a, b);
                    return result === 0 ? 0 : -1 * result;
                  },
                },
              });
            }}
          >
            <FaArrowDown />
          </Chip>
        </ChipGroup>
      </Flex>
    </Flex>
  );
}
