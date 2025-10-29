import { PermissionError } from "@/lib/utils/errors";
import AdminSidebar from "./AdminSidebar";
import { Suspense } from "react";
import { getAdminModelList, IAdminModelList } from "../adminModelList";
import { getSessionUser } from "../../authentication/getSessionUser";
import { USER_ROLE, userRoleEnum } from "@/lib/dataModels/auth/user/definitions";

const allowedAdminRoles: USER_ROLE[] = [];
allowedAdminRoles.push(userRoleEnum.SUPERUSER);

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
