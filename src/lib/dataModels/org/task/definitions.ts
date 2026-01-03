import { Prisma } from "@/generated/prisma/client";
import * as v from "valibot";

export const VSTitle = v.pipe(
  v.string("Title must be a string."),
  v.nonEmpty("Title cannot be empty!"),
  v.maxLength(500, "Title cannot be longer than 500 characters."),
);

export const VSDescription = v.pipe(v.string("Description must be a string."));

export const VSStartDate = v.nullable(v.date());
export const VSEndDate = v.nullable(v.date());
export const VSEstimatedStart = v.nullable(v.date());
export const VSEstimatedEnd = v.nullable(v.date());
export const VSIsArchived = v.boolean();
export const VSIsArchiveOnCompletion = v.boolean();
export const VSPriorityId = v.string();
export const VSStatusId = v.string();

export const VSTask = v.object({
  id: v.string(),
  title: VSTitle,
  description: VSDescription,
  is_archived: VSIsArchived,
  start_date: VSStartDate,
  end_date: VSEndDate,
  estimated_start: VSEstimatedStart,
  estimated_end: VSEstimatedEnd,
  priorityId: VSPriorityId,
  statusId: VSStatusId,
});

export type TTask = v.InferInput<typeof VSTask>;
export type TTaskUi = TTaskIncludeAll;

export const VSTaskInput = v.required(
  v.partial(v.omit(VSTask, ["id", "priorityId", "statusId"])),
  ["title"],
);
export type TTaskInput = v.InferInput<typeof VSTaskInput>;

export const VSTaskForm = v.partial(v.omit(VSTask, ["id"]));
export type TTaskFormData = v.InferInput<typeof VSTaskForm>;
export type TTaskFormErrors = v.FlatErrors<typeof VSTaskForm>;

export type TTaskFormState = {
  status?: "success" | "error";
  data?: TTaskFormData;
  errors?: TTaskFormErrors;
  messages?: string[];
};

export type TTaskWithChildren = Prisma.TaskGetPayload<{
  include: { children: true };
}>;

export type TTaskIncludeAll = Prisma.TaskGetPayload<{
  include: {
    children: true;
    parent: true;
    category: true;
    tags: true;
    status: true;
    priority: true;
  };
}>;
