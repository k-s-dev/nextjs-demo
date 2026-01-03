"use client";

import { useActionState, useState } from "react";
import { Divider, Text } from "@mantine/core";
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
import FormMessages from "@/lib/ui/form/FormMessages";

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
    deleteModalContent: (
      <Text>User: {user.email} will be deleted permanently.</Text>
    ),
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
      <FormMessages error messages={formState.errors?.root} />
      <FormMessages messages={formState.messages} />
      <Divider size="md" my="sm" />
      <AdminReadFormLinks {...adminLinksProps} />
    </AdminFormContainer>
  );
}
