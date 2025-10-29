"use client";

import React, { useActionState, useEffect, useState } from "react";
import { Divider } from "@mantine/core";
import FormError from "@/lib/components/form/FormError";
import FormMessage from "@/lib/components/form/FormMessage";
import { createUserClientAction } from "./actions/clientAction";
import {
  MODEL_NAME,
  TUserFormState,
  TUserFormStateData,
  userRoleEnum,
} from "../../definitions";
import { routes } from "@/lib/utils/routeMapper";
import { UserForm } from "../UserForm";
import { notifications } from "@mantine/notifications";
import { redirect } from "next/navigation";
import AdminFormContainer from "@/lib/features/admin/ui/form/AdminFormContainer";
import AdminCreateFormLinks, {
  IAdminCreateFormLinksProps,
} from "@/lib/features/admin/ui/form/create/AdminCreateFormLinks";
import AdminCreateFormHeader from "@/lib/features/admin/ui/form/create/AdminCreateFormHeader";

export default function UserCreateForm({
  formId = `user-create-form`,
}: {
  formId?: string;
}) {
  const [imageFile, setImageFile] = useState<File | null>(null);

  const initialFormState: TUserFormState = {
    data: { role: userRoleEnum.USER } as TUserFormStateData,
  };

  const [formState, formAction, isPending] = useActionState(
    createUserClientAction.bind(null, imageFile),
    initialFormState,
  );

  useEffect(() => {
    if (formState.status === "success") {
      notifications.show({
        message: (
          <p>
            User: <b>{formState.data?.email}</b> created successfully.
          </p>
        ),
        autoClose: 3000,
        color: "green",
      });
      redirect(routes.admin.user.read);
    }
  }, [formState]);

  const linksProps: IAdminCreateFormLinksProps = {
    form: formId,
    isPending: isPending,
    modelName: MODEL_NAME,
    cancelHref: routes.admin.user.read,
  };

  return (
    <AdminFormContainer>
      <AdminCreateFormHeader {...linksProps} />
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
      <AdminCreateFormLinks {...linksProps} />
    </AdminFormContainer>
  );
}
