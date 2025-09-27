"use client";

import { signOut } from "next-auth/react";

import "./SignOut.scss";

import { signOutAction } from "./action";
import { useRouter } from "next/navigation";
import { routes } from "@/lib/utils/routeMapper";

export default function SignOutButton({
  className = "signOut-btn",
}: {
  className?: string;
}) {
  const router = useRouter();

  return (
    <button
      className={className}
      type="button"
      onClick={async () => {
        await signOut({ redirect: false });
        await signOutAction();
        router.replace(routes.generic.home);
      }}
    >
      Sign Out
    </button>
  );
}
