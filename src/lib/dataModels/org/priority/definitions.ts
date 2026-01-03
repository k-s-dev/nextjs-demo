import * as v from "valibot";

export const VSName = v.pipe(
  v.string("Name must be a string."),
  v.nonEmpty("Name cannot be empty!"),
);

export const VSCode = v.pipe(
  v.string("Code must be a string."),
  v.nonEmpty("Code cannot be empty!"),
);

export const VSGroup = v.pipe(
  v.number("Group must be a positive number."),
  v.integer("Group must be a positive number."),
);

export const VSOrder = v.pipe(
  v.number("Order must be a positive number."),
  v.integer("Order must be a positive number."),
);

export const VSPriority = v.object({
  id: v.string(),
  name: VSName,
  code: VSCode,
  group: VSGroup,
  order: VSOrder,
});

export type TPriority = v.InferInput<typeof VSPriority>;

export const VSPriorityForm = v.omit(VSPriority, ["id"]);
export type TPriorityFormData = v.InferInput<typeof VSPriorityForm>;
export type TPriorityFormErrors = v.FlatErrors<typeof VSPriorityForm>;

export type TPriorityFormState = {
  status?: "success" | "error";
  data?: TPriorityFormData;
  errors?: TPriorityFormErrors;
  messages?: string[];
};
