import styles from "./Navbar.module.scss";
import { Suspense } from "react";
import { Skeleton } from "@mantine/core";
import { NavLinks, NavLinksPhone } from "./NoSsrComponents";
import NavUser from "@/lib/ui/nav/NavUser";
import NavThemeToggle from "@/lib/ui/nav/theme/NavThemeToggle";
import { auth } from "@/lib/features/authentication/auth";
import { headers } from "next/headers";
import { SessionProvider } from "@/lib/ui/providers/SessionProvider";

export default async function Navbar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <>
      <SessionProvider sessionData={session}>
        <nav className={styles.nav}>
          <NavPhoneUp />
          <NavPhone />
        </nav>
      </SessionProvider>
    </>
  );
}

export function NavPhoneUp() {
  return (
    <section className="media-phone-up">
      <div className={styles.wrapper}>
        <div className={styles.left}>
          <NavLinks />
        </div>
        <div className={styles.center}>
          <section></section>
        </div>
        <div className={styles.right}>
          <NavRightSection />
        </div>
      </div>
    </section>
  );
}

export function NavPhone() {
  return (
    <>
      <section className="media-phone">
        <div className={styles.wrapper}>
          <NavLinksPhone />
          <NavRightSection />
        </div>
      </section>
    </>
  );
}

export function NavPhoneSearch() {
  return (
    <section className="media-phone">
      <div className={styles.phoneSearch}>
        <section></section>
      </div>
    </section>
  );
}

function NavRightSection() {
  return (
    <>
      <Suspense fallback={<Skeleton circle height={20} />}>
        <NavThemeToggle />
      </Suspense>
      <Suspense fallback={<Skeleton circle height={20} />}>
        <NavUser />
      </Suspense>
    </>
  );
}
