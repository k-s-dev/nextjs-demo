"use client";

import React, { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { Divider } from "@mantine/core";

import "../UserForm.scss";

import FormError from "@/lib/components/form/FormError";
import FormMessage from "@/lib/components/form/FormMessage";
import { createUserClientAction } from "./actions/clientAction";
import {
  FormSubmitButton,
  IPropsFormBtn,
} from "@/lib/components/form/FormSubmitButton";
import { TUserFormState, TUserFormStateData } from "../../definitions";
import { routes } from "@/lib/utils/routeMapper";
import FormContainer from "@/lib/components/form/FormContainer";
import FormRowBtns from "@/lib/components/form/FormRowBtns";
import FormHeader from "@/lib/components/form/FormHeader";
import { UserForm } from "../UserForm";
import { USER_ROLE } from "@/generated/prisma";
import { notifications } from "@mantine/notifications";
import { redirect } from "next/navigation";

export default function UserCreateForm({
  formId = `user-create-form`,
}: {
  formId?: string;
}) {
  const [imageFile, setImageFile] = useState<File | null>(null);

  const initialFormState: TUserFormState = {
    data: { role: USER_ROLE.USER } as TUserFormStateData,
    mode: "create",
  };

  const [formState, formAction, isPending] = useActionState(
    createUserClientAction.bind(null, imageFile),
    initialFormState,
  );

  useEffect(() => {
    if (formState.status === "success") {
      notifications.show({
        message: <p>User: <b>{formState.data?.email}</b> created successfully.</p>,
        autoClose: 3000,
        color: "green",
      });
      redirect(routes.admin.user.read);
    }
  }, [formState]);

  return (
    <FormContainer>
      <FormHeaderUser formId={formId} isPending={isPending} />
      <UserForm
        formId={formId}
        formState={formState}
        formAction={formAction}
        imageFile={imageFile}
        setImageFileAction={setImageFile}
      />
      <FormError errors={formState.errors?.root} />
      <FormMessage messages={formState.messages} />
      <Divider size="md" my="sm" />
      <FormRowBtnsUser formId={formId} isPending={isPending} />
    </FormContainer>
  );
}

export function FormRowBtnsUser({ formId, isPending }: IPropsFormBtn) {
  return (
    <FormRowBtns>
      <FormSubmitButton
        formId={formId}
        isPending={isPending}
        buttonText="Save"
      />
      <Link href={routes.admin.user.read} className="form-btn-cancel">
        Cancel
      </Link>
    </FormRowBtns>
  );
}

export function FormHeaderUser({ formId, isPending }: IPropsFormBtn) {
  return (
    <FormHeader>
      <h1>User: Create</h1>
      <FormRowBtnsUser formId={formId} isPending={isPending} />
    </FormHeader>
  );
}
