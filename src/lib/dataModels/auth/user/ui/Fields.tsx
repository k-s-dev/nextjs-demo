import { SelectProps } from "@mantine/core";

import { SelectSingle } from "@/lib/components/form/fields/SelectSingle";
import { USER_ROLE } from "@/generated/prisma";
import {
  InputPassword,
  InputPasswordProps,
} from "@/lib/components/form/fields/InputPassword";
import {
  InputText,
  InputTextProps,
} from "@/lib/components/form/fields/InputText";
import {
  InputDateTime,
  InputDateTimeProps,
} from "@/lib/components/form/fields/InputDateTime";
import { TUserFormState } from "../definitions";

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
      {...props}
    />
  );
}

export function UserRole({ formId, formState, ...props }: UserFieldRoleProps) {
  if (formState.data?.role === USER_ROLE.SUPERUSER) {
    return (
      <SelectSingle
        formId={formId}
        data={[USER_ROLE.SUPERUSER]}
        defaultValue={USER_ROLE.SUPERUSER}
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
      data={[USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE.STAFF]}
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
}: UserFieldDateTimeProps) {
  return (
    <InputDateTime
      formId={formId}
      defaultValue={
        formState.data?.emailVerified
          ? formState.data.emailVerified.toString()
          : undefined
      }
      errors={formState.errors?.nested?.emailVerified}
      name="emailVerified"
      label="Email Verified (on date)"
      placeholder="Pick date/time"
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
