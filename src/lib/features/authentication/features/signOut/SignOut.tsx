"use client";

import { useRouter } from "next/navigation";
import { routes } from "@/lib/utils/routeMapper";
import { authClient } from "../../auth-client";
import { useSessionContext } from "@/lib/ui/providers/SessionProvider";

export default function SignOut({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const sessionCtx = useSessionContext();

  return (
    <div
      onClick={async () => {
        await authClient.signOut();
        sessionCtx.setSession(null);
        router.push(routes.DEFAULT_LOGIN_REDIRECT);
      }}
    >
      {children}
    </div>
  );
}
