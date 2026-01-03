"use client";

import Link from "next/link";
import { BackIcon, EditIcon } from "@/lib/ui/icons/TooltipIcons";
import DeleteModalIcon from "@/lib/ui/form/DeleteModalIcon";
import AdminFormLinksContainer from "../AdminFormLinksContainer";
import { TServerResponsePromise } from "@/lib/types/serverResponse";
import { ReactNode } from "react";

export default function AdminReadFormLinks({
  modelName,
  editHref,
  backHref,
  deleteModalContent,
  deleteAction,
}: IAdminReadFormLinksProps) {
  return (
    <AdminFormLinksContainer>
      <Link
        href={editHref}
        style={{ display: "inline-flex", alignItems: "center" }}
      >
        <EditIcon textProps={{ fz: "h2" }} />
      </Link>

      <DeleteModalIcon
        deleteAction={deleteAction}
        textProps={{
          fz: "h2",
          "data-test-cy": `delete-${modelName.toLowerCase()}-button`,
        }}
      >
        {deleteModalContent}
      </DeleteModalIcon>

      <Link
        href={backHref}
        style={{ display: "inline-flex", alignItems: "center" }}
      >
        <BackIcon label="Back to List" textProps={{ fz: "h2" }} />
      </Link>
    </AdminFormLinksContainer>
  );
}

export interface IAdminReadFormLinksProps {
  modelName: string;
  editHref: string;
  backHref: string;
  deleteModalContent: string | ReactNode;
  deleteAction: () => TServerResponsePromise;
}
