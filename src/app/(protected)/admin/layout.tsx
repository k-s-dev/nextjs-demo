import AdminSidebarWrapper from "@/lib/features/admin/ui/AdminSidebarWrappper";
import styles from "./layout.module.scss";
import { auth } from "@/lib/features/authentication/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { routes } from "@/lib/utils/routeMapper";
import { Blockquote, Card, Center } from "@mantine/core";
import AppShellHome from "@/lib/components/layout/home/AppShell";
import Navbar from "@/lib/components/nav/Navbar";
import { USER_ROLE } from "@/lib/dataModels/auth/user/definitions";

const allowedRoles: USER_ROLE[] = ["SUPERUSER"];

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirect(routes.authentication.signIn);
  }

  const accessGranted = allowedRoles.includes(session.user.role);

  if (!accessGranted) return <UnAuthorized />;

  return (
    <AppShellHome nav={<Navbar />}>
      <div className={styles.rootLayout}>
        <aside className={styles.leftSidebar}>
          <AdminSidebarWrapper />
        </aside>
        <main className={styles.main}>{children}</main>
      </div>
    </AppShellHome>
  );
}

function UnAuthorized() {
  return (
    <AppShellHome nav={<Navbar />}>
      <Center>
        <Card shadow="lg" radius="lg" w={{ base: "99%", xl: "80%" }} maw={500}>
          <Blockquote color="red.3">Access denied.</Blockquote>
        </Card>
      </Center>
    </AppShellHome>
  );
}
