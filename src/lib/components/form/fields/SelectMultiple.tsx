import { MultiSelect, MultiSelectProps } from "@mantine/core";
import FormControl from "../control/FormControl";

export function SelectMultiple({
  formId,
  fieldId,
  errors,
  messages,
  ...multiSelectProps
}: SelectMultipleProps) {
  return (
    <FormControl errors={errors} messages={messages}>
      <MultiSelect form={formId} id={fieldId} {...multiSelectProps} />
    </FormControl>
  );
}

export interface SelectMultipleProps extends MultiSelectProps {
  formId: string;
  fieldId?: string;
  errors?: string[];
  messages?: string[];
}
