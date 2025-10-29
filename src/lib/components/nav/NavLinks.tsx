"use client";

import styles from "./NavLinks.module.scss";
import { clsx } from "clsx";
import Link from "next/link";
import { PiYinYang } from "react-icons/pi";
import { usePathname } from "next/navigation";
import { routes } from "@/lib/utils/routeMapper";

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <section className={styles.container}>
      <PiYinYang />
      {Object.entries(navLinks).map(([k, v]) => {
        return (
          <Link
            key={`${k}-phone-up`}
            href={v.href || "/"}
            className={clsx(
              styles.link,
              v.href && matchPathHref(pathname, v.href) && styles.active,
            )}
          >
            {v.title}
          </Link>
        );
      })}
    </section>
  );
}

export const navLinks: INavLinks = {
  home: {
    title: "Home",
    href: routes.generic.home,
  },
  admin: {
    title: "Admin",
    href: routes.admin.root,
  },
  products: {
    title: "Products",
    href: "/product",
    links: {
      list: {
        title: "All Products",
        href: "/product/list",
      },
    },
  },
};

export function matchPathHref(pathname: string, href: string) {
  if (pathname.length <= 1) return pathname === href;
  return pathname.split("/")[1] === href.split("/")[1];
}

export interface INavLinks {
  [k: string]: {
    title: string;
    href?: string;
    links?: INavLinks;
  };
}
