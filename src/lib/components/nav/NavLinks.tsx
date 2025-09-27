"use client";

import "./Navbar.scss";
import Link from "next/link";
import { PiYinYang } from "react-icons/pi";
import { usePathname } from "next/navigation";
import { routes } from "@/lib/utils/routeMapper";

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <section className="nav-links">
      <PiYinYang />
      {Object.entries(navLinks).map(([k, v]) => {
        const className =
          pathname === v.href ? "nav-link nav-link-active" : "nav-link";

        return (
          <Link
            key={`${k}-phone-up`}
            href={v.href || "/"}
            className={className}
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

export interface INavLinks {
  [k: string]: {
    title: string;
    href?: string;
    links?: INavLinks;
  };
}
