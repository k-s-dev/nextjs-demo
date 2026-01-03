import { getUser } from "@/lib/dataModels/auth/user/dataAccessControl";
import { TUserPublic } from "@/lib/dataModels/auth/user/definitions";
import UserUpdateForm from "@/lib/dataModels/auth/user/ui/update/UserUpdateForm";
import { notFound } from "next/navigation";

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const response = await getUser({ id: id }, "server");

  if (response.status === "error") notFound();

  return (
    <div>
      <UserUpdateForm user={response.data as TUserPublic} />
    </div>
  );
}
