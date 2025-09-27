import "./page.scss";
import "@/styles/components/_button.scss";

import { getUsers } from "@/lib/dataModels/auth/user/dataAccess";
import { Divider } from "@mantine/core";
import Link from "next/link";
import { routes } from "@/lib/utils/routeMapper";
import { UserTable } from "@/lib/dataModels/auth/user/ui/UserTable";
import { getSessionUser } from "@/lib/features/authentication/getSessionUser";

export default async function Page() {
  const sessionUser = await getSessionUser()
  const users = await getUsers({}, "client", sessionUser);

  return (
    <div>
      <header className="admin-user-list-header">
        <h1>User: List</h1>
        <Link href={routes.admin.user.create} className="btn-create">
          Create User
        </Link>
      </header>
      <Divider size="md" mb="md" />
      <UserTable users={users} />
    </div>
  );
}
