import { getUsers } from "@/lib/dataModels/auth/user/dataAccessControl";
import { routes } from "@/lib/utils/routeMapper";
import { UserTable } from "@/lib/dataModels/auth/user/ui/UserTable";
import { getSessionUser } from "@/lib/features/authentication/getSessionUser";
import LinkButton from "@/lib/ui/LinkButton";
import AdminFormHeaderContainer from "@/lib/features/admin/ui/form/AdminFormHeaderContainer";
import {
  MODEL_NAME,
  TUser,
} from "@/lib/dataModels/auth/user/definitions";

export default async function Page() {
  const sessionUser = await getSessionUser();
  const response = await getUsers({}, "client", sessionUser);

  let users;

  if (response.status === "error") {
    users = [] as TUser[];
  } else {
    users = response.data;
  }

  return (
    <div>
      <AdminFormHeaderContainer modelName={MODEL_NAME} mode="list">
        <LinkButton href={routes.admin.user.create} color="blue.1" fz="lg">
          Create User
        </LinkButton>
      </AdminFormHeaderContainer>
      <UserTable users={users as TUser[]} />
    </div>
  );
}
