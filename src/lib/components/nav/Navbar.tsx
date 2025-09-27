import { Suspense } from "react";
import "./Navbar.scss";

import NavLinks from "./NavLinks";
import NavLinksPhone from "./NavLinksPhone";
import NavUser from "./NavUser";
import { Skeleton } from "@mantine/core";
import NavThemeToggle from "./theme/NavThemeToggleWrapper";

export default async function Navbar() {
  return (
    <>
      <nav className="nav">
        <NavPhoneUp />
        <NavPhone />
      </nav>
    </>
  );
}

export function NavPhoneUp() {
  return (
    <section className="media-phone-up">
      <div className="nav-wrapper">
        <div className="nav-left">
          <NavLinks />
        </div>
        <div className="nav-center">
          <section>Search</section>
        </div>
        <div className="nav-right">
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
        <div className="nav-wrapper">
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
      <div className="nav-phone-search-wrapper">
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
