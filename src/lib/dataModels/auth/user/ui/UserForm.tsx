"use client";

import React, { Dispatch, SetStateAction } from "react";

import "./UserForm.scss";

import { InputImage } from "@/lib/components/form/fields/InputImage";
import { UserEmail, UserName, UserRole, UserEmailVerified } from "./Fields";
import { TUserFormState } from "../definitions";
import FormRowFields from "@/lib/components/form/FormRowFields";

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
    <form
      id={formId}
      inert={inert}
      noValidate
      className={`form ${inert ? "form-inert" : ""}`}
      action={formAction}
    >
      <FormRowFields>
        <UserEmail formId={formId} formState={formState} />
        <UserName formId={formId} formState={formState} />
      </FormRowFields>

      <FormRowFields>
        <UserRole formId={formId} formState={formState} />
        <UserEmailVerified formId={formId} formState={formState} clearable />
      </FormRowFields>

      <FormRowFields>
        <InputImage
          formId={formId}
          imageFile={imageFile}
          setImageFile={setImageFileAction}
          initialImageUrl={initialImageUrl}
          errors={formState.errors?.nested?.image}
        />
      </FormRowFields>
    </form>
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
