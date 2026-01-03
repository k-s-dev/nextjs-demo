import { Prisma } from "@/generated/prisma/client";
import * as v from "valibot";

export const VSName = v.pipe(
  v.string("Name must be a string."),
  v.nonEmpty("Name cannot be empty!"),
);

export const VSDescription = v.pipe(v.string("Description must be a string."));

export const VSOrder = v.pipe(
  v.number("Order must be a positive number."),
  v.integer("Order must be a positive number."),
);

export const VSCategory = v.object({
  id: v.string(),
  name: VSName,
  description: VSDescription,
  order: VSOrder,
});

export type TCategory = v.InferInput<typeof VSCategory>;

export const VSCategoryForm = v.partial(v.omit(VSCategory, ["id"]));
export type TCategoryFormData = v.InferInput<typeof VSCategoryForm>;
export type TCategoryFormErrors = v.FlatErrors<typeof VSCategoryForm>;

export type TCategoryFormState = {
  status?: "success" | "error";
  data?: TCategoryFormData;
  errors?: TCategoryFormErrors;
  messages?: string[];
};

export type TCategoryWithChildren = Prisma.CategoryGetPayload<{
  include: { children: true };
}>;
