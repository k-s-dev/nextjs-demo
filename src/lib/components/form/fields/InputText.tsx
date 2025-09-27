import { TextInput, TextInputProps } from "@mantine/core";
import FormControl from "../control/FormControl";

/**
 * Input component for text fields. FormControl wrapper is added to provide error and messages.
 */
export function InputText({
  formId,
  defaultValue,
  errors,
  messages,
  ...props
}: InputTextProps) {
  return (
    <FormControl errors={errors} messages={messages}>
      <TextInput
        form={formId}
        defaultValue={defaultValue}
        error={!!errors}
        {...props}
      />
    </FormControl>
  );
}

export interface InputTextProps extends TextInputProps {
  formId: string;
  defaultValue?: string;
  errors?: string[];
  messages?: string[];
}
