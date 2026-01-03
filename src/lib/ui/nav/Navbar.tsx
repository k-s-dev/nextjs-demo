import styles from "./Navbar.module.scss";
import { Suspense } from "react";
import NavUser from "./NavUser";
import { Skeleton } from "@mantine/core";
import { NavLinks, NavLinksPhone } from "./NoSsrComponents";
import NavThemeToggle from "./theme/NavThemeToggle";
import { auth } from "@/lib/features/authentication/auth";
import { SessionProvider } from "../providers/SessionProvider";
import { headers } from "next/headers";

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
          <section>Search</section>
        </div>
        <div className={styles.right}>
          <NavRight />
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
          <NavRight />
        </div>
      </section>
    </>
  );
}

export function NavPhoneSearch() {
  return (
    <section className="media-phone">
      <div className={styles.phoneSearch}>
        <section>Search</section>
      </div>
    </section>
  );
}

function NavRight() {
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
