"use client";

import "./Navbar.scss";
import Link from "next/link";
import { Menu, MenuDropdown, MenuItem, MenuTarget } from "@mantine/core";
import { PiYinYang } from "react-icons/pi";
import { navLinks } from "./NavLinks";
import { usePathname } from "next/navigation";

export default function NavLinksPhone() {
  const pathname = usePathname();

  return (
    <Menu>
      <MenuTarget>
        <PiYinYang />
      </MenuTarget>
      <MenuDropdown>
        {Object.entries(navLinks).map(([k, v]) => {
          const className =
            pathname === v.href ? "nav-link nav-link-active" : "nav-link";

          return (
            <MenuItem key={`${k}-phone`}>
              <Link href={v.href || "/"} className={className}>
                {v.title}
              </Link>
            </MenuItem>
          );
        })}
      </MenuDropdown>
    </Menu>
  );
}
