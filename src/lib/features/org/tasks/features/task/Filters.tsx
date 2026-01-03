"use client";

import {
  Button,
  Chip,
  ChipGroup,
  ComboboxItem,
  ComboboxItemGroup,
  Container,
  Divider,
  Flex,
  MultiSelect,
  Title,
  Tooltip,
} from "@mantine/core";
import { TASK_VISIBILITY, useTasksContext } from "../../TasksContext";
import { DatePickerInput } from "@mantine/dates";
import dayjs from "dayjs";
import { TCategoryWithChildren } from "@/lib/dataModels/org/category/definitions";
import { FaArrowsRotate } from "react-icons/fa6";

const datePresets = [
  { value: dayjs().format("YYYY-MM-DD"), label: "Today" },
  { value: dayjs().add(1, "day").format("YYYY-MM-DD"), label: "< 1 day" },
  { value: dayjs().add(1, "week").format("YYYY-MM-DD"), label: "< 1 week" },
  { value: dayjs().add(1, "month").format("YYYY-MM-DD"), label: "< 1 month" },
  { value: dayjs().add(3, "month").format("YYYY-MM-DD"), label: "< 3 month" },
  { value: dayjs().add(6, "month").format("YYYY-MM-DD"), label: "< 6 month" },
  { value: dayjs().add(1, "year").format("YYYY-MM-DD"), label: "< 1 year" },
];

export default function TaskFilters() {
  const { state, dispatch } = useTasksContext();

  const workspaceChoices = state.workspaces.map((el) => {
    return { label: el.name, value: el.id };
  });

  const workspaces = state.workspaces.filter((el) =>
    state.filters.workspaces.includes(el.id),
  );

  const priorityChoices: ComboboxItemGroup[] = [];
  workspaces.forEach((workspace) => {
    const group: ComboboxItemGroup = {
      group: `Workspace: ${workspace.name}`,
      items: [],
    };
    workspace.priorities.forEach((priority) => {
      group.items.push({
        label: priority.name,
        value: priority.id,
      });
    });
    priorityChoices.push(group);
  });

  const statusChoices: ComboboxItemGroup[] = [];
  workspaces.forEach((workspace) => {
    const group: ComboboxItemGroup = {
      group: `Workspace: ${workspace.name}`,
      items: [],
    };
    workspace.statuses.forEach((status) => {
      group.items.push({
        label: status.name,
        value: status.id,
      });
    });
    statusChoices.push(group);
  });

  const categoryChoices: ComboboxItemGroup[] = [];
  workspaces.forEach((workspace) => {
    const group: ComboboxItemGroup = {
      group: `Workspace: ${workspace.name}`,
      items: [],
    };
    const rootCategories = workspace.categories.filter((el) => !el.parentId);
    function createItem(
      category: TCategoryWithChildren,
      depth: number = 0,
    ): ComboboxItem[] {
      const items: ComboboxItem[] = [
        {
          label: `${"\u00A0".repeat(2).repeat(depth) + category.name}`,
          value: category.id,
        },
      ];
      const hasChildren = category.children.length > 0;
      if (!hasChildren) return items;
      category.children.forEach((child) => {
        const childCategory = workspace.categories.find(
          (el) => el.id === child.id,
        );
        if (childCategory) {
          items.push(...createItem(childCategory, depth + 1));
        }
      });
      return items;
    }
    rootCategories.forEach((category) => {
      const items = createItem(category);
      group.items.push(...items);
    });
    categoryChoices.push(group);
  });

  const tagChoices = state.tags.map((tag) => {
    return { label: tag.name, value: tag.id };
  });

  return (
    <Container mb={"xs"}>
      <Flex direction={"column"} gap={"xs"}>
        <Flex justify="space-between" gap={"xs"} wrap={"wrap"}>
          <Title order={2}>Filters</Title>
          <Tooltip label="Reset all filters">
            <Button
              variant="subtle"
              color="gray"
              onClick={() => dispatch({ type: "filter:reset" })}
            >
              <FaArrowsRotate />
            </Button>
          </Tooltip>
        </Flex>
        <Divider />
        <Title order={3} fz={"h6"}>
          Workspace Filters
        </Title>
        <MultiSelect
          data={workspaceChoices}
          value={state.filters.workspaces}
          onChange={(ids) => dispatch({ type: "filter:workspaces", ids })}
          label="Workspace"
          clearable
          searchable
        />
        <MultiSelect
          data={priorityChoices}
          value={state.filters.priorities}
          onChange={(ids) => dispatch({ type: "filter:priorities", ids })}
          label="Priority"
          clearable
          searchable
        />
        <MultiSelect
          data={statusChoices}
          value={state.filters.statuses}
          onChange={(ids) => dispatch({ type: "filter:statuses", ids })}
          label="Status"
          clearable
          searchable
        />
        <MultiSelect
          data={categoryChoices}
          value={state.filters.categories}
          onChange={(ids) => dispatch({ type: "filter:categories", ids })}
          label="Category"
          clearable
          searchable
        />
        <Divider />
        <Title order={3} fz={"xs"}>
          Other Filters
        </Title>
        <Title order={4} fz={"sm"} fw={"bold"}>
          Visibility
        </Title>
        <ChipGroup>
          <Flex gap={"xs"} wrap={"wrap"}>
            {TASK_VISIBILITY.map((el, idx) => {
              return (
                <Chip
                  key={idx}
                  checked={state.filters.visibility === el}
                  onChange={() => {
                    dispatch({ type: "filter:visibility", visibility: el });
                  }}
                >
                  {el[0].toUpperCase() + el.slice(1)}
                </Chip>
              );
            })}
          </Flex>
        </ChipGroup>
        <MultiSelect
          data={tagChoices}
          value={state.filters.tags}
          onChange={(ids) => dispatch({ type: "filter:tags", ids })}
          label="Tags"
          clearable
          searchable
        />
        <DatePickerInput
          clearable
          label="Due"
          dropdownType="modal"
          presets={datePresets}
          value={state.filters.due}
          onChange={(value) => {
            dispatch({
              type: "filter:due",
              dueDate: value ? new Date(value) : null,
            });
          }}
        />
        <DatePickerInput
          clearable
          label="Starts"
          dropdownType="modal"
          presets={datePresets}
          value={state.filters.start}
          onChange={(value) => {
            dispatch({
              type: "filter:start",
              startDate: value ? new Date(value) : null,
            });
          }}
        />
      </Flex>
    </Container>
  );
}
