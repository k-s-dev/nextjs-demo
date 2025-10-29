"use client";

import styles from "./NavLinks.module.scss";
import Link from "next/link";
import { Menu, MenuDropdown, MenuItem, MenuTarget } from "@mantine/core";
import { PiYinYang } from "react-icons/pi";
import { navLinks } from "./NavLinks";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export default function NavLinksPhone() {
  const pathname = usePathname();

  return (
    <Menu>
      <MenuTarget>
        <PiYinYang />
      </MenuTarget>
      <MenuDropdown>
        {Object.entries(navLinks).map(([k, v]) => {
          return (
            <MenuItem key={`${k}-phone`}>
              <Link
                href={v.href || "/"}
                className={clsx(styles.link, pathname === v.href && styles.active)}
              >
                {v.title}
              </Link>
            </MenuItem>
          );
        })}
      </MenuDropdown>
    </Menu>
  );
}
