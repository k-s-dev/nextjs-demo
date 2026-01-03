"use client";

import { Dispatch, SetStateAction } from "react";
import { InputImage } from "@/lib/ui/form/fields/InputImage";
import { UserEmail, UserName, UserRole, UserEmailVerified } from "./Fields";
import { TUserFormState } from "../definitions";
import FormFieldsRow from "@/lib/ui/form/FormFieldsRow";
import Form from "@/lib/ui/form/Form";

export function UserForm({
  formId,
  formState,
  formAction,
  imageFile,
  setImageFileAction,
  initialImageUrl,
  inert = false,
}: IPropsFormUser) {
  return (
    <Form id={formId} inert={inert} noValidate action={formAction}>
      <FormFieldsRow>
        <UserEmail formId={formId} formState={formState} />
        <UserName formId={formId} formState={formState} />
      </FormFieldsRow>

      <FormFieldsRow>
        <UserRole formId={formId} formState={formState} />
        <InputImage
          formId={formId}
          imageFile={imageFile}
          setImageFile={setImageFileAction}
          initialImageUrl={initialImageUrl}
          errors={formState.errors?.nested?.image}
        />
      </FormFieldsRow>

      <UserEmailVerified formId={formId} formState={formState} />
    </Form>
  );
}

export interface IPropsFormUser {
  formId: string;
  formState: TUserFormState;
  formAction: (payload: FormData) => void;
  imageFile: File | null;
  setImageFileAction: Dispatch<SetStateAction<File | null>>;
  initialImageUrl?: string;
  inert?: boolean;
}
