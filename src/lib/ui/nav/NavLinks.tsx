"use client";

import styles from "./NavLinks.module.scss";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { routes } from "@/lib/utils/routeMapper";
import { Title } from "@mantine/core";
import { theme } from "@/lib/ui/theme";
import { INavLink } from "@/lib/types/navLinks";
import { renderNavLinks } from "@/lib/utils/render/navLinks";

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      <NavLinksTitle />
      {navLinks.map((link) => {
        return renderNavLinks({
          link,
          classNames: { base: styles.link, active: styles.active },
          pathname,
          screen: "phone-up",
        });
      })}
    </>
  );
}

export function NavLinksTitle() {
  return (
    <Title order={6} size="h1">
      <Link href={routes.generic.home}>Next</Link>
      <Link href={routes.generic.home} style={{ color: theme.colors.green[5] }}>
        Demo
      </Link>
    </Title>
  );
}

export const navLinks: INavLink[] = [
  {
    title: "Admin",
    href: routes.admin.root,
  },
  {
    title: "Org",
    href: routes.org.root,
    links: [
      {
        title: "Tasks",
        href: routes.org.tasks.root,
        links: [{ title: "Settings", href: routes.org.tasks.settings.root }],
      },
      { title: "Timer", href: routes.org.timer.root },
      { title: "Counter", href: routes.org.counter.root },
    ],
  },
  {
    title: "Products",
    href: "/product",
    links: [
      {
        title: "All Products",
        href: "/product/list",
      },
    ],
  },
];
