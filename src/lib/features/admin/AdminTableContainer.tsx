import { Suspense } from "react";
import { AdminTable } from "./AdminTable";
import { Skeleton } from "@mantine/core";
import { getAdminModelList, IAdminModelInfo } from "./adminModelList";

export default async function AdminTableWrapper() {
  const modelList = await getAdminModelList(true);

  return (
      <Suspense fallback={<Skeleton height={8} radius="xl" />}>
        <AdminTable modelList={modelList as IAdminModelInfo[]} />
      </Suspense>
  )
}

