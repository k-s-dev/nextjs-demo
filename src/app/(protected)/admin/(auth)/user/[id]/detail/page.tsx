import { getUser } from "@/lib/dataModels/auth/user/dataAccess";
import { TUserPublic } from "@/lib/dataModels/auth/user/definitions";
import UserReadForm from "@/lib/dataModels/auth/user/ui/read/detail/UserReadForm";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await getUser({ id: id }, "server");

  if (!user) notFound();

  return (
    <>
      {/* // TODO:HACK: review forced type casting */}
      <UserReadForm user={user as TUserPublic} />
    </>
  );
}
