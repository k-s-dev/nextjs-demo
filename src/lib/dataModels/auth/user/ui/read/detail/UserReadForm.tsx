"use client";

import React, { useActionState, useState } from "react";
import { Divider } from "@mantine/core";
import FormError from "@/lib/components/form/FormError";
import FormMessage from "@/lib/components/form/FormMessage";
import { routes } from "@/lib/utils/routeMapper";
import {
  MODEL_NAME,
  TUserFormState,
  TUserFormStateData,
  TUserPublic,
} from "../../../definitions";
import { UserForm } from "../../UserForm";
import { deleteUserServerAction } from "../../delete/action/serverSingle";
import AdminFormContainer from "@/lib/features/admin/ui/form/AdminFormContainer";
import AdminReadFormHeader, {
  IAdminReadFormHeaderProps,
} from "@/lib/features/admin/ui/form/read/AdminReadFormHeader";
import AdminReadFormLinks from "@/lib/features/admin/ui/form/read/AdminReadFormLinks";

export default function UserReadForm({
  user,
  formId = `user-create-form`,
}: {
  user: TUserPublic;
  formId?: string;
}) {
  const [imageFile, setImageFile] = useState<File | null>(null);

  const initialFormState: TUserFormState = {
    data: { ...user } as TUserFormStateData,
  };

  const [formState, formAction] = useActionState(
    (formState) => formState,
    initialFormState,
  );

  if (formState.status === "success") {
    return (
      <div className="form-success-message">
        <p>User created succuesfully.</p>
      </div>
    );
  }

  const adminLinksProps: IAdminReadFormHeaderProps = {
    modelName: MODEL_NAME,
    editHref: routes.admin.user.withId(user.id, "update"),
    backHref: routes.admin.user.read,
    identifier: user.email,
    deleteAction: async () => await deleteUserServerAction(user.id),
  };

  return (
    <AdminFormContainer>
      <AdminReadFormHeader {...adminLinksProps} />
      <UserForm
        formId={formId}
        formState={formState}
        formAction={formAction}
        imageFile={imageFile}
        setImageFileAction={setImageFile}
        initialImageUrl={user.image}
        inert
      />
      <FormError errors={formState.errors?.root} />
      <FormMessage messages={formState.messages} />
      <Divider size="md" my="sm" />
      <AdminReadFormLinks {...adminLinksProps} />
    </AdminFormContainer>
  );
}
