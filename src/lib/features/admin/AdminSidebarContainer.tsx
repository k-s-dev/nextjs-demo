import { USER_ROLE } from "@/generated/prisma";
import { getSessionUser } from "../authentication/getSessionUser";
import { getAdminModelList, IAdminModelList } from "./adminModelList";
import { PermissionError } from "@/lib/utils/errors";
import AdminSidebar from "./AdminSidebar";
import { Suspense } from "react";

const allowedAdminRoles: USER_ROLE[] = [];
allowedAdminRoles.push(USER_ROLE.SUPERUSER);

export default async function AdminSidebarWrapper() {
  const modelList = await getAdminModelList();
  const sessionUser = await getSessionUser();

  if (
    !sessionUser ||
    (sessionUser && !allowedAdminRoles.includes(sessionUser.role))
  ) {
    throw new PermissionError({});
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminSidebar modelList={modelList as IAdminModelList} />
    </Suspense>
  );
}
