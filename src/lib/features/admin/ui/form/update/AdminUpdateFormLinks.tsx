"use client";

import { Button } from "@mantine/core";
import AdminFormLinksContainer from "../AdminFormLinksContainer";
import LinkButton from "@/lib/components/LinkButton";

export default function AdminUpdateFormLinks(
  props: IAdminUpdateFormLinksProps,
) {
  return (
    <AdminFormLinksContainer>
      <Button
        type="submit"
        form={props.form}
        disabled={props.isPending}
        data-test-cy="save-user-updates-button"
        color="green.1"
      >
        Save
      </Button>
      <LinkButton href={props.cancelHref} color="yellow.1">
        Cancel
      </LinkButton>
    </AdminFormLinksContainer>
  );
}

export interface IAdminUpdateFormLinksProps {
  form: string;
  isPending: boolean;
  modelName: string;
  cancelHref: string;
}
