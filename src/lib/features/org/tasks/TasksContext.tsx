"use client";

import { Tag } from "@/generated/prisma/client";
import { TUserPublic } from "@/lib/dataModels/auth/user/definitions";
import { TTaskUi } from "@/lib/dataModels/org/task/definitions";
import { TWorkspaceIncludeAll } from "@/lib/dataModels/org/workspace/definitions";
import { createContext, Dispatch, useContext, useEffect } from "react";
import { useImmerReducer } from "use-immer";

export const TasksContext = createContext<ITasksContext | null>(null);

export function useTasksContext() {
  const tasksCtx = useContext(TasksContext);
  if (!tasksCtx) {
    throw new Error("Tasks context is null.");
  }
  return tasksCtx;
}

export function TasksProvider({
  stateData,
  children,
}: {
  stateData: ITasksState;
  children: React.ReactNode;
}) {
  const [state, dispatch] = useImmerReducer(tasksReducer, stateData);

  useEffect(() => {
    dispatch({ type: "update:state", data: stateData });
  }, [dispatch, stateData]);

  return (
    <TasksContext.Provider value={{ state, dispatch }}>
      {children}
    </TasksContext.Provider>
  );
}

export function tasksReducer(draft: ITasksState, action: TTasksAction) {
  let workspaces;

  switch (action.type) {
    case "update:state":
      return action.data;

    case "search:update":
      draft.search = action.search;
      break;

    case "filter:reset":
      draft.filters = {
        workspaces: [],
        categories: [],
        priorities: [],
        statuses: [],
        tags: [],
        visibility: "active",
      };
      break;

    case "filter:workspaces":
      draft.filters.workspaces = action.ids;

      workspaces = draft.workspaces.filter((el) =>
        draft.filters.workspaces.includes(el.id),
      );

      const categories: string[] = [];
      workspaces.forEach((workspace) => {
        workspace.categories.forEach((category) => {
          if (draft.filters.categories.includes(category.id)) {
            categories.push(category.id);
          }
        });
      });
      draft.filters.categories = categories;

      const priorities: string[] = [];
      workspaces.forEach((workspace) => {
        workspace.priorities.forEach((el) => {
          if (draft.filters.priorities.includes(el.id)) {
            priorities.push(el.id);
          }
        });
      });
      draft.filters.priorities = priorities;

      const statuses: string[] = [];
      workspaces.forEach((workspace) => {
        workspace.statuses.forEach((el) => {
          if (draft.filters.statuses.includes(el.id)) {
            statuses.push(el.id);
          }
        });
      });
      draft.filters.statuses = statuses;
      break;

    case "filter:priorities":
      draft.filters.priorities = action.ids;
      break;

    case "filter:statuses":
      draft.filters.statuses = action.ids;
      break;

    case "filter:categories":
      draft.filters.categories = action.ids;
      break;

    case "filter:visibility":
      draft.filters.visibility = action.visibility;
      break;

    case "filter:tags":
      draft.filters.tags = action.ids;
      break;

    case "filter:due":
      draft.filters.due = action.dueDate;
      break;

    case "filter:start":
      draft.filters.due = action.startDate;
      break;

    case "sort:reset":
      draft.sort = [];
      break;

    case "sort:update":
      const specIdx = draft.sort.findIndex(
        (el) => el.name === action.spec.name,
      );
      if (specIdx === -1) {
        if (action.spec.direction) draft.sort.push(action.spec);
      }
      if (specIdx !== -1) {
        if (!action.spec.direction) draft.sort.splice(specIdx, 1);
        if (action.spec.direction) draft.sort.splice(specIdx, 1, action.spec);
      }
      break;

    default:
      break;
  }
}

export function useProcessedTasks() {
  const { state } = useTasksContext();

  const filteredTasks = state.tasks.filter((task) => {
    const checkWorkspace =
      state.filters.workspaces.length === 0 ||
      state.filters.workspaces.includes(task.category.workspaceId);
    const checkCategory =
      state.filters.categories.length === 0 ||
      state.filters.categories.includes(task.categoryId);
    const checkPriority =
      !task.priorityId ||
      state.filters.priorities.length === 0 ||
      state.filters.priorities.includes(task.priorityId);
    const checkStatus =
      !task.statusId ||
      state.filters.statuses.length === 0 ||
      state.filters.statuses.includes(task.statusId);
    const checkTags =
      state.filters.tags.length === 0 ||
      task.tags.some((tag) => state.filters.tags.includes(tag.id));
    const checkVisibility =
      !state.filters.visibility ||
      state.filters.visibility === "all" ||
      (state.filters.visibility === "archived" && task.is_archived) ||
      (state.filters.visibility === "active" && !task.is_archived);
    const checkDue =
      !state.filters.due ||
      (task.end_date && task.end_date <= state.filters.due);
    const checkStart =
      !state.filters.start ||
      (task.start_date && task.start_date <= state.filters.start);

    return (
      checkWorkspace &&
      checkCategory &&
      checkPriority &&
      checkStatus &&
      checkTags &&
      checkVisibility &&
      checkDue &&
      checkStart
    );
  });

  const searchedTasks = filteredTasks.filter((task) => {
    if (!state.search) return true;
    if (state.search) {
      const checkTitle = state.search.some((pattern) => {
        return task.title.toLowerCase().includes(pattern.toLowerCase());
      });
      const checkDescription = state.search.some((pattern) => {
        if (task.description) {
          return task.description.toLowerCase().includes(pattern.toLowerCase());
        }
      });
      return checkTitle || checkDescription;
    }
  });

  return searchedTasks;
}

export function useGetDefaultStatusByCategoryId(categoryId: string) {
  const ctx = useTasksContext();
  const workspace = ctx.state.workspaces.find((el) =>
    el.categories.find((c) => c.id === categoryId),
  );
  const orders = workspace?.statuses.map((el) => el.order);
  const minOrder = orders ? Math.min(...orders) : 1;
  const status = workspace?.statuses.find((el) => el.order === minOrder);
  return status;
}

export function useGetDefaultPriorityByCategoryId(categoryId: string) {
  const ctx = useTasksContext();
  const workspace = ctx.state.workspaces.find((el) =>
    el.categories.find((c) => c.id === categoryId),
  );
  const orders = workspace?.priorities.map((el) => el.order);
  const minOrder = orders ? Math.min(...orders) : 1;
  const priority = workspace?.priorities.find((el) => el.order === minOrder);
  return priority;
}

export interface ITasksState {
  user: TUserPublic;
  workspaces: TWorkspaceIncludeAll[];
  tags: Tag[];
  tasks: TTaskUi[];
  search?: string[] | null;
  filters: {
    workspaces: string[];
    categories: string[];
    priorities: string[];
    statuses: string[];
    tags: string[];
    visibility: TTaskVisibility | null; // null is needed for mantine DatePicker
    due?: Date | null;
    start?: Date | null;
  };
  sort: TSortSpec[];
}

export const TASK_VISIBILITY = ["all", "active", "archived"] as const;

export type TTaskVisibility = (typeof TASK_VISIBILITY)[number];

export type TSortSpec = {
  name: string;
  direction: "ascending" | "descending" | null;
  fn?: (a: TTaskUi, b: TTaskUi) => number;
};

export interface ITasksContext {
  state: ITasksState;
  dispatch: Dispatch<TTasksAction>;
}

export type TTasksAction =
  | { type: "update:state"; data: ITasksState }
  | { type: "search:update"; search: string[] | null }
  | { type: "filter:reset" }
  | { type: "filter:workspaces"; ids: string[] }
  | { type: "filter:priorities"; ids: string[] }
  | { type: "filter:statuses"; ids: string[] }
  | { type: "filter:categories"; ids: string[] }
  | { type: "filter:visibility"; visibility: TTaskVisibility | null }
  | { type: "filter:tags"; ids: string[] }
  | { type: "filter:due"; dueDate?: Date | null }
  | { type: "filter:start"; startDate?: Date | null }
  | { type: "sort:reset" }
  | { type: "sort:update"; spec: TSortSpec };
