"use client";

import { redirect } from "next/navigation";
import { routes } from "@/lib/utils/routeMapper";
import { authClient } from "../../auth-client";

export default function SignOut({ children }: { children: React.ReactNode }) {
  return (
    <div
      onClick={async () => {
        await authClient.signOut();
        redirect(routes.DEFAULT_LOGIN_REDIRECT);
      }}
    >
      {children}
    </div>
  );
}
