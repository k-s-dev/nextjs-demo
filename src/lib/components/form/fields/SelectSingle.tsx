import { Select, SelectProps } from "@mantine/core";

import FormControl from "../control/FormControl";

export function SelectSingle({
  formId,
  fieldId,
  errors,
  messages,
  ...selectProps
}: SelectSingleProps) {
  return (
    <FormControl errors={errors} messages={messages}>
      <Select form={formId} id={fieldId} {...selectProps} />
    </FormControl>
  );
}

export interface SelectSingleProps extends SelectProps {
  formId: string;
  fieldId?: string;
  errors?: string[];
  messages?: string[];
}
