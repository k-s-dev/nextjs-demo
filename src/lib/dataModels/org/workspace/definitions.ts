import { Prisma, Workspace } from "@/generated/prisma/client";
import * as v from "valibot";

export const VSName = v.pipe(
  v.string("Name must be a string."),
  v.nonEmpty("Name cannot be empty!"),
);

export const VSDescription = v.pipe(v.string("Description must be a string."));

export const VSWorkspace = v.object({
  id: v.string(),
  name: VSName,
  description: v.optional(VSDescription),
});

export type TWorkspace = v.InferInput<typeof VSWorkspace>;
export type TWorkspaceUi = Workspace;

export const VSWorkspaceForm = v.partial(v.omit(VSWorkspace, ["id"]));
export type TWorkspaceForm = v.InferInput<typeof VSWorkspaceForm>;
export type TWorkspaceFormErrors = v.FlatErrors<typeof VSWorkspaceForm>;

export type TWorkspaceFormState = {
  status?: "success" | "error";
  data?: TWorkspaceForm;
  errors?: TWorkspaceFormErrors;
  messages?: string[];
};

export const workspaceIncludeAll = {
  categories: {
    include: {
      parent: true,
      children: true,
    },
  },
  statuses: true,
  priorities: true,
};

export type TWorkspaceIncludeAll = Prisma.WorkspaceGetPayload<{
  include: typeof workspaceIncludeAll;
}>;
