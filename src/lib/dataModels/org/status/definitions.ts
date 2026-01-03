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

export const VSIsCompletion = v.pipe(v.optional(v.boolean(), false));

export const VSStatus = v.object({
  id: v.string(),
  name: VSName,
  code: VSCode,
  group: VSGroup,
  order: VSOrder,
  isCompletion: VSIsCompletion,
});

export type TStatus = v.InferInput<typeof VSStatus>;

export const VSStatusForm = v.omit(VSStatus, ["id"]);
export type TStatusFormData = v.InferInput<typeof VSStatusForm>;
export type TStatusFormErrors = v.FlatErrors<typeof VSStatusForm>;

export type TStatusFormState = {
  status?: "success" | "error";
  data?: TStatusFormData;
  errors?: TStatusFormErrors;
  messages?: string[];
};
