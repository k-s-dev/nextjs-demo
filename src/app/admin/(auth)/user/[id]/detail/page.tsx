import { getUser } from "@/lib/dataModels/auth/user/dataAccessControl";
import { TUserPublic } from "@/lib/dataModels/auth/user/definitions";
import UserReadForm from "@/lib/dataModels/auth/user/ui/read/detail/UserReadForm";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const response = await getUser({ id: id }, "server");

  if (response.status === "error") notFound();

  return (
    <>
      {/* // TODO:HACK: review forced type casting */}
      <UserReadForm user={response.data as TUserPublic} />
    </>
  );
}
