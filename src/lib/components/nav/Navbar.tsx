import styles from "./Navbar.module.scss";
import { Suspense } from "react";
import NavLinks from "./NavLinks";
import NavUser from "./NavUser";
import { Skeleton } from "@mantine/core";
import NavThemeToggle from "./theme/NavThemeToggleWrapper";
import { NavLinksPhone } from "./NoSsrComponents";

export default async function Navbar() {
  return (
    <>
      <nav className={styles.nav}>
        <NavPhoneUp />
        <NavPhone />
      </nav>
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
        <section>Search</section>
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
