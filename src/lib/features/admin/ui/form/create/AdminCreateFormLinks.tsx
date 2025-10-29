"use client";

import { Button } from "@mantine/core";
import AdminFormLinksContainer from "../AdminFormLinksContainer";
import LinkButton from "@/lib/components/LinkButton";

export default function AdminCreateFormLinks(
  props: IAdminCreateFormLinksProps,
) {
  return (
    <AdminFormLinksContainer>
      <Button
        type="submit"
        form={props.form}
        disabled={props.isPending}
        data-test-cy="user-create-form-submit-button"
        color="yellow.1"
      >
        Save
      </Button>
      <LinkButton href={props.cancelHref} color="blue.1">
        Cancel
      </LinkButton>
    </AdminFormLinksContainer>
  );
}

export interface IAdminCreateFormLinksProps {
  form: string;
  isPending: boolean;
  modelName: string;
  cancelHref: string;
}
