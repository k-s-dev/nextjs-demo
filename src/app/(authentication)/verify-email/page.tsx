import Link from "next/link";

import "./verifyEmailPage.scss";

import { verifyToken } from "@/lib/features/authentication/verification";
import { routes } from "@/lib/utils/routeMapper";
import VerifyEmailCard from "@/lib/features/authentication/features/verify-email/verifyEmailCard";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const token = (await searchParams).verificationToken;

  if (!token || typeof token !== "string") {
    return <InvalidLink />;
  }

  const result = await verifyToken(token, "EMAIL_VERFICATION");

  if (!result || !result.data?.payload || !result.data.payload.email) {
    return <InvalidLink />;
  }

  let verficationStatusMessage;

  if (result.status === "verified") {
    verficationStatusMessage = (
      <p className="text text-valid">
        <span>Email: </span>
        <span className="text-highlight">
          {result.data.payload.email as string}
        </span>
        <span>, is already verified and can be used to sign in.</span>
      </p>
    );
  }

  verficationStatusMessage = (
    <p className="text text-valid">
      <span>Email: </span>
      <span className="text-highlight">
        {result.data.payload.email as string}
      </span>
      <span>, has been verified and can be used to sign in.</span>
    </p>
  );

  return (
    <VerifyEmailCard>
      {verficationStatusMessage}
      <Link href={routes.all.signIn} className="btn">
        Sign In
      </Link>
    </VerifyEmailCard>
  );
}

function InvalidLink() {
  return (
    <VerifyEmailCard>
      <p className="text text-invalid">
        Invalid link. Email verification link can be generated from{" "}
        <a href={routes.all.signIn} className="btn">
          SignIn
        </a>{" "}
        page.
      </p>
    </VerifyEmailCard>
  );
}
