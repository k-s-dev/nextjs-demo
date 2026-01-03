"use client";

import styles from "./NavLinks.module.scss";
import { Modal, Title } from "@mantine/core";
import { navLinks } from "./NavLinks";
import { usePathname } from "next/navigation";
import { theme } from "../theme";
import { routes } from "@/lib/utils/routeMapper";
import { useDisclosure } from "@mantine/hooks";
import { INavLink } from "@/lib/types/navLinks";
import { renderNavLinks } from "@/lib/utils/render/navLinks";

export default function NavLinksPhone() {
  const pathname = usePathname();
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal key={pathname} opened={opened} onClose={close} title="Nav">
        {/* Modal content */}
        {navLinksPhone.map((link) => {
          return renderNavLinks({
            link,
            classNames: { base: styles.link, active: styles.active },
            pathname,
            screen: "phone",
            root: false,
            closeAction: close,
          });
        })}
      </Modal>

      <Title order={6} size="h1" onClick={open}>
        Next
        <span style={{ color: theme.colors.green[5] }}>Demo</span>
      </Title>
    </>
  );
}

export const navLinksPhone: INavLink[] = [
  {
    title: "Home",
    href: routes.generic.home,
  },
  ...navLinks,
];
