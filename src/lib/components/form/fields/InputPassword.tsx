import { PasswordInput, PasswordInputProps } from "@mantine/core";
import FormControl from "../control/FormControl";

/**
 * Input component for text fields. FormControl wrapper is added to provide error and messages.
 */
export function InputPassword({
  formId,
  defaultValue,
  errors,
  messages,
  ...props
}: InputPasswordProps) {
  return (
    <FormControl errors={errors} messages={messages}>
      <PasswordInput
        form={formId}
        defaultValue={defaultValue}
        error={!!errors}
        {...props}
      />
    </FormControl>
  );
}

export interface InputPasswordProps extends PasswordInputProps {
  formId: string;
  defaultValue?: string;
  errors?: string[];
  messages?: string[];
}
