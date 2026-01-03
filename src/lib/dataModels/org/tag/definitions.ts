import * as v from "valibot";

export const VSName = v.pipe(
  v.string("Name must be a string."),
  v.nonEmpty("Name cannot be empty!"),
);

export const VSTag = v.object({
  id: v.string(),
  name: VSName,
});

export type TTag = v.InferInput<typeof VSTag>;

export const VSTagForm = v.omit(VSTag, ["id"]);
export type TTagFormData = v.InferInput<typeof VSTagForm>;
export type TTagFormErrors = v.FlatErrors<typeof VSTagForm>;

export type TTagFormState = {
  status?: "success" | "error";
  data?: TTagFormData;
  errors?: TTagFormErrors;
  messages?: string[];
};
