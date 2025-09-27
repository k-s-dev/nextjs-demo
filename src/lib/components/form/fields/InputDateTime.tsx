import { DateTimePicker, DateTimePickerProps } from "@mantine/dates";

import FormControl from "../control/FormControl";

/**
 * Input component for Datetime fields. FormControl wrapper is added to provide error and messages.
 */
export function InputDateTime({
  formId,
  defaultValue,
  errors,
  messages,
  ...props
}: InputDateTimeProps) {
  return (
    <FormControl errors={errors} messages={messages}>
      <DateTimePicker
        form={formId}
        defaultValue={defaultValue}
        error={!!errors}
        clearable
        timePickerProps={{
          withDropdown: true,
          popoverProps: { withinPortal: false },
          format: "24h",
        }}
        {...props}
      />
    </FormControl>
  );
}

export interface InputDateTimeProps extends DateTimePickerProps {
  formId: string;
  defaultValue?: string;
  errors?: string[];
  messages?: string[];
}
