"use client";

import Link from "next/link";
import { BackIcon, EditIcon } from "@/lib/components/icons/TooltipIcons";
import DeleteModalIcon from "@/lib/components/form/DeleteModalIcon";
import AdminFormLinksContainer from "../AdminFormLinksContainer";
import { TServerResponsePromise } from "@/lib/utils/types";

export default function AdminReadFormLinks({
  modelName,
  editHref,
  backHref,
  identifier,
  deleteAction,
}: IAdminReadFormLinksProps) {
  return (
    <AdminFormLinksContainer>
      <Link href={editHref}>
        <EditIcon textProps={{ fz: "h2" }} />
      </Link>
      <DeleteModalIcon
        resource={modelName}
        identifier={identifier}
        deleteAction={deleteAction}
        iconProps={{ fz: "h2" }}
        data-test-cy={`delete-${modelName.toLowerCase()}-button`}
      />
      <Link href={backHref}>
        <BackIcon label="Back to List" textProps={{ fz: "h2" }} />
      </Link>
    </AdminFormLinksContainer>
  );
}

export interface IAdminReadFormLinksProps {
  modelName: string;
  editHref: string;
  backHref: string;
  identifier: string;
  deleteAction: () => TServerResponsePromise;
}
