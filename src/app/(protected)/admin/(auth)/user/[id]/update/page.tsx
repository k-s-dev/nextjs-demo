import { getUser } from "@/lib/dataModels/auth/user/dataAccess";
import { TUserPublic } from "@/lib/dataModels/auth/user/definitions";
import UserUpdateForm from "@/lib/dataModels/auth/user/ui/update/UserUpdateForm";
import { notFound } from "next/navigation";

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await getUser({ id: id }, "server");

  if (!user) notFound();

  return (
    <div>
      <UserUpdateForm user={user as TUserPublic} />
    </div>
  );
}
