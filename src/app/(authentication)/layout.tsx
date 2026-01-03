import styles from "./layout.module.scss";
import Navbar from "@/lib/ui/nav/Navbar";
import { auth } from "@/lib/features/authentication/auth";
import { redirect } from "next/navigation";
import { routes } from "@/lib/utils/routeMapper";
import { headers } from "next/headers";
import AppShell from "@/lib/ui/layout/01/AppShell";

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerList = await headers();
  const currentPath = headerList.get("x-current-path") || "/";
  const session = await auth.api.getSession({ headers: headerList });

  if (!!session) {
    if (
      currentPath === routes.authentication.signIn ||
      currentPath === routes.authentication.signUp
    ) {
      return redirect(routes.DEFAULT_LOGIN_REDIRECT);
    }
  }

  return (
    <AppShell nav={<Navbar />}>
      <aside></aside>
      <main className={styles.main}>{children}</main>
    </AppShell>
  );
}
