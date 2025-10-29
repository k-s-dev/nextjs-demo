"use client";

import React, { useActionState, useState } from "react";
import { Divider } from "@mantine/core";
import FormError from "@/lib/components/form/FormError";
import FormMessage from "@/lib/components/form/FormMessage";
import {
  MODEL_NAME,
  TUserFormState,
  TUserFormStateData,
  TUserPublic,
} from "../../definitions";
import { routes } from "@/lib/utils/routeMapper";
import { UserForm } from "../UserForm";
import { updateUserClientAction } from "./actions/clientAction";
import AdminFormContainer from "@/lib/features/admin/ui/form/AdminFormContainer";
import AdminUpdateFormLinks, {
  IAdminUpdateFormLinksProps,
} from "@/lib/features/admin/ui/form/update/AdminUpdateFormLinks";
import AdminUpdateFormHeader from "@/lib/features/admin/ui/form/update/AdminUpdateFormHeader";

export default function UserUpdateForm({
  user,
  formId = `user-update-form`,
}: {
  user: TUserPublic;
  formId?: string;
}) {
  const [imageFile, setImageFile] = useState<File | null>(null);

  const initialFormState: TUserFormState = {
    data: { ...user } as TUserFormStateData,
  };

  const [formState, formAction, isPending] = useActionState(
    updateUserClientAction.bind(null, user, imageFile),
    initialFormState,
  );

  const linksProps: IAdminUpdateFormLinksProps = {
    form: formId,
    isPending: isPending,
    modelName: MODEL_NAME,
    cancelHref: routes.admin.user.withId(user.id, "detail"),
  };

  return (
    <AdminFormContainer>
      <AdminUpdateFormHeader {...linksProps} />
      <UserForm
        formId={formId}
        formState={formState}
        formAction={formAction}
        imageFile={imageFile}
        setImageFileAction={setImageFile}
        initialImageUrl={user.image}
      />
      <FormError errors={formState.errors?.root} />
      <FormMessage messages={formState.messages} />
      <Divider size="md" my="sm" />
      <AdminUpdateFormLinks {...linksProps} />
    </AdminFormContainer>
  );
}
