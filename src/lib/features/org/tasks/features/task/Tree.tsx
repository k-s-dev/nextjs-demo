import EditTaskRow, { TaskEditRowTitle } from "./EditRow";
import {
  Box,
  Card,
  Divider,
  Flex,
  NumberInput,
  Pagination,
  Text,
} from "@mantine/core";
import { Task } from "@/generated/prisma/client";
import { Updater, useImmer } from "use-immer";
import { useEffect, useState } from "react";
import { deleteTasksByIds } from "@/lib/dataModels/org/task/dataAccessLayer";
import { notifications } from "@mantine/notifications";
import {
  addItem,
  getAllChildren,
  getAllParents,
  getChildren,
  getRoot,
} from "@/lib/utils/tree";
import { useProcessedTasks, useTasksContext } from "../../TasksContext";
import TaskQuickCreate from "./QuickCreate";
import { TTaskUi } from "@/lib/dataModels/org/task/definitions";
import TaskSearch from "./Search";
import { useDebouncedCallback } from "@mantine/hooks";

export default function TaskTree() {
  const tasksCtx = useTasksContext();
  const processedTasks = useProcessedTasks();
  const [pageState, setPageState] = useImmer<IPageState>({
    itemsPerPage: 10,
    current: 1,
  });

  const tasks = [] as TTaskUi[];

  const [state, setState] = useImmer<TreeState>({});

  useEffect(() => {
    setState((draft) => {
      tasksCtx.state.tasks.forEach((task) => {
        if (!draft[task.id]) {
          draft[task.id] = {
            showChildren: false,
            showAddChild: false,
            isSelected: false,
          };
        }
      });
    });
  }, [setState, tasksCtx.state.tasks]);

  processedTasks.forEach((task) => {
    addItem(tasks, task);
    const parents = getAllParents(tasksCtx.state.tasks, task);
    parents.forEach((parent) => addItem(tasks, parent));
  });

  if (tasksCtx.state.sort.length > 0) {
    tasksCtx.state.sort.forEach((spec) => {
      if (!spec.direction) return;
      tasks.sort(spec.fn);
    });
  }

  const rootTasks = [] as TTaskUi[];
  tasks.forEach((task) => {
    const rootId = getRoot(tasksCtx.state.tasks, task);
    if (!rootTasks.find((item) => item.id === rootId)) {
      const root = tasksCtx.state.tasks.find((item) => item.id === rootId);
      if (root) rootTasks.push(root);
    }
  });

  if (tasksCtx.state.sort.length > 0) {
    tasksCtx.state.sort.forEach((spec) => {
      if (!spec.direction) return;
      rootTasks.sort(spec.fn);
    });
  }

  function toggleAllSelection() {
    tasksCtx.state.tasks.forEach((task) => {
      setState((draft) => {
        draft[task.id].isSelected = !draft[task.id].isSelected;
      });
    });
  }

  async function deleteAllSelected() {
    const ids = Object.entries(state)
      .map(([k, v]) => (v.isSelected ? k : null))
      .filter((el) => el !== null);

    const response = await deleteTasksByIds(ids);

    if (response.status === "success") {
      notifications.show({
        message: "Deleted selected ids successfully.",
      });
    }
    if (response.status === "error") {
      notifications.show({ message: response.errors, color: "red" });
    }
    ids.forEach((id) => {
      setState((draft) => {
        delete draft[id];
      });
    });
    return response;
  }

  const debouncedChangeItemsPerPage = useDebouncedCallback(
    (value: number | string) => {
      setPageState((draft) => {
        draft.itemsPerPage = Number(value);
      });
    },
    500,
  );

  const stateIds = Object.keys(state);
  const someSelected =
    stateIds.length > 0 && stateIds.some((k) => state[k].isSelected);
  const allSelected =
    stateIds.length > 0 && Object.keys(state).every((k) => state[k].isSelected);

  if (rootTasks.length === 0) {
    return (
      <>
        <TaskQuickCreate />
        <Text c="gray" fz={"xl"}>
          There are no tasks with current filters.
        </Text>
      </>
    );
  }

  const idxLast = pageState.current * pageState.itemsPerPage;
  const idxFirst = idxLast - pageState.itemsPerPage;
  const currentPageTasks = rootTasks.slice(idxFirst, idxLast);

  return (
    <>
      <Box maw={"90vw"}>
        <TaskQuickCreate />
        <TaskSearch />
      </Box>

      <Card shadow="xs" miw={"fit-content"} style={{ overflowX: "scroll" }}>
        <Flex direction="column" gap={"md"} px={"xs"} pb={"xs"}>
          <TaskEditRowTitle
            deleteAction={deleteAllSelected}
            deleteDisabled={!someSelected}
            selectedProps={{
              checked: allSelected,
              indeterminate: !allSelected && someSelected,
              onChange: toggleAllSelection,
            }}
          />
          {currentPageTasks.map((task) => {
            return (
              <RenderNode
                key={task.id}
                tasks={tasks}
                task={task}
                state={state}
                setState={setState}
              />
            );
          })}
        </Flex>
      </Card>

      <Flex
        justify={"space-between"}
        align={"flex-end"}
        gap={"xs"}
        wrap={"wrap"}
      >
        <Pagination
          total={Math.ceil(rootTasks.length / pageState.itemsPerPage)}
          value={pageState.current}
          onChange={(value) =>
            setPageState((draft) => {
              draft.current = value;
            })
          }
        />
        <NumberInput
          label="Items per page"
          allowNegative={false}
          min={1}
          value={pageState.itemsPerPage}
          onChange={(value) => debouncedChangeItemsPerPage(value)}
        />
      </Flex>
    </>
  );
}

function RenderNode({
  tasks,
  task,
  state,
  setState,
  depth = 0,
  offset = 12,
}: {
  tasks: TTaskUi[];
  task: TTaskUi;
  state: TreeState;
  setState: Updater<TreeState>;
  depth?: number;
  offset?: number;
}) {
  const [resetKey, setResetKey] = useState(0);

  function toggleChildren(id: string) {
    setState((draft) => {
      draft[id].showChildren = !draft[id].showChildren;
    });
  }

  function toggleAllChildren(task: Task) {
    setState((draft) => {
      if (draft[task.id]) {
        const currentState = draft[task.id].showChildren;
        draft[task.id].showChildren = !currentState;
        const allChildren = getAllChildren(tasks, task);
        allChildren.forEach((child) => {
          draft[child.id].showChildren = !currentState;
        });
      }
    });
  }

  function toggleAddChild(id: string) {
    setState((draft) => {
      draft[id].showAddChild = !draft[id].showAddChild;
    });
  }

  function toggleSelection(task: Task, tasks: Task[]) {
    setState((draft) => {
      draft[task.id].isSelected = !draft[task.id].isSelected;
    });
    const children = getAllChildren(tasks, task);
    children.forEach((child) => {
      setState((draft) => {
        draft[child.id].isSelected = !draft[child.id].isSelected;
      });
    });
  }

  const children = getChildren(tasks, task);
  const isLeaf = children.length <= 0;

  return (
    <Flex
      direction={"column"}
      ps={{ base: 0.75 * offset * depth, sm: offset * depth }}
      gap={"xs"}
      w={"100%"}
      miw={800}
    >
      <EditTaskRow
        key={resetKey}
        task={task}
        open={state[task.id] ? state[task.id].showChildren : false}
        selected={state[task.id] ? state[task.id].isSelected : false}
        isLeaf={isLeaf}
        toggleSelectionAction={() => toggleSelection(task, tasks)}
        toggleOpenAction={() => toggleChildren(task.id)}
        toggleOpenAllAction={() => toggleAllChildren(task)}
        toggleAddChildAction={() => toggleAddChild(task.id)}
        setResetKeyAction={() => setResetKey((p) => p + 1)}
        deleteSelectionAction={() => {
          setState((draft) => {
            delete draft[task.id];
          });
        }}
      />

      {state[task.id] && state[task.id].showAddChild && (
        <Flex>
          <Divider orientation="vertical" size={"xs"} />
          <Box
            ps={{
              base: 0.5 * offset * (depth + 1),
              sm: offset * (depth + 1),
            }}
          >
            <TaskQuickCreate
              parentId={task.id}
              postAddAction={() =>
                setState((draft) => {
                  draft[task.id].showAddChild = false;
                })
              }
            />
          </Box>
        </Flex>
      )}

      {children.length > 0 &&
        state[task.id] &&
        state[task.id].showChildren &&
        children.map((child) => {
          return (
            <Flex key={child.id}>
              <Divider orientation="vertical" size={"xs"} />
              <RenderNode
                tasks={tasks}
                task={child}
                state={state}
                setState={setState}
                depth={depth + 1}
              />
            </Flex>
          );
        })}
    </Flex>
  );
}

interface TreeState {
  [k: string]: {
    showChildren: boolean;
    showAddChild: boolean;
    isSelected: boolean;
  };
}

interface IPageState {
  itemsPerPage: number;
  current: number;
}
