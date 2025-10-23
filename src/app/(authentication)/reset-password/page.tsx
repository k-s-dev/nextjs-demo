import ResetPasswordCard from "@/lib/features/authentication/features/resetPassword/ResetPasswordCard";
import ResetPasswordForm from "@/lib/features/authentication/features/resetPassword/Form";
import AuthInvalidLink from "@/lib/features/authentication/components/AuthInvalidLink";
import { auth } from "@/lib/features/authentication/auth";
import { headers } from "next/headers";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const token = (await searchParams).token;
  const reqHeaders = await headers();

  if (!token || typeof token !== "string") {
    return <InvalidLink />;
  }

  await auth.api.revokeSessions({ headers: reqHeaders });
  await auth.api.signOut({ headers: reqHeaders });

  return (
    <div>
      <ResetPasswordCard>
        <ResetPasswordForm token={token} />
      </ResetPasswordCard>
    </div>
  );
}

function InvalidLink() {
  return (
    <AuthInvalidLink title="Reset Password">
      Invalid link. Reset password link can be generated from Sign In page.
    </AuthInvalidLink>
  );
}
