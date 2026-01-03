import { Checkbox, SelectProps } from "@mantine/core";
import { SelectSingle } from "@/lib/ui/form/fields/SelectSingle";
import {
  InputPassword,
  InputPasswordProps,
} from "@/lib/ui/form/fields/InputPassword";
import {
  InputText,
  InputTextProps,
} from "@/lib/ui/form/fields/InputText";
import { InputDateTimeProps } from "@/lib/ui/form/fields/InputDateTime";
import { TUserFormState, userRoleEnum } from "../definitions";

export function UserEmail({ formId, formState, ...props }: UserTextFieldProps) {
  return (
    <InputText
      formId={formId}
      name="email"
      label="Email"
      placeholder="e.g. user@gmail.com"
      defaultValue={formState.data?.email}
      errors={formState.errors?.nested?.email}
      required
      data-test-cy="email-input"
      {...props}
    />
  );
}

export function UserName({ formId, formState, ...props }: UserTextFieldProps) {
  return (
    <InputText
      formId={formId}
      name="name"
      label="Name"
      placeholder="e.g. First Last"
      defaultValue={formState.data?.name}
      errors={formState.errors?.nested?.name}
      required
      {...props}
    />
  );
}

export function UserPassword({
  formId,
  formState,
  ...props
}: UserPasswordFieldProps) {
  return (
    <InputPassword
      formId={formId}
      name="password"
      label="Password"
      placeholder="Password"
      defaultValue={formState.data?.password}
      errors={formState.errors?.nested?.password}
      required
      {...props}
    />
  );
}

export function UserConfirmPassword({
  formId,
  formState,
  ...props
}: UserPasswordFieldProps) {
  return (
    <InputPassword
      formId={formId}
      name="confirmPassword"
      label="Confirm Password"
      placeholder="Confirm Password"
      defaultValue={formState.data?.confirmPassword}
      errors={formState.errors?.nested?.confirmPassword}
      required
      {...props}
    />
  );
}

export function UserRole({ formId, formState, ...props }: UserFieldRoleProps) {
  /**
   * Separate node for rendering disabled field is needed
   * to avoid random functionality clashes
   */
  if (formState.data?.role === userRoleEnum.SUPERUSER) {
    return (
      <SelectSingle
        formId={formId}
        data={[userRoleEnum.SUPERUSER]}
        defaultValue={userRoleEnum.SUPERUSER}
        errors={formState.errors?.nested?.role}
        name="role"
        label="Role"
        placeholder="Role"
        disabled
        {...props}
      />
    );
  }
  return (
    <SelectSingle
      formId={formId}
      data={[userRoleEnum.USER, userRoleEnum.ADMIN, userRoleEnum.STAFF]}
      defaultValue={formState.data?.role}
      errors={formState.errors?.nested?.role}
      name="role"
      label="Role"
      placeholder="Role"
      {...props}
    />
  );
}

export function UserEmailVerified({
  formId,
  formState,
  ...props
}: UserFieldProps) {
  return (
    <Checkbox
      form={formId}
      defaultChecked={formState.data?.emailVerified}
      name="emailVerified"
      label="Email Verified"
      labelPosition="left"
      size="lg"
      {...props}
    />
  );
}

export interface UserFieldProps {
  formId: string;
  formState: TUserFormState;
}

export interface UserTextFieldProps extends UserFieldProps, InputTextProps {}

export interface UserPasswordFieldProps
  extends UserFieldProps,
    InputPasswordProps {}

export interface UserConfirmPasswordsProps {
  formId: string;
  passwordFormState: TUserFormState;
  confirmPasswordFormState: TUserFormState;
}

export interface UserFieldRoleProps extends UserFieldProps, SelectProps {}
export interface UserFieldDateTimeProps
  extends UserFieldProps,
    InputDateTimeProps {}
