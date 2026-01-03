"use client";

import { INavLink, INavLinkClassNames } from "@/lib/types/navLinks";
import clsx from "clsx";
import Link from "next/link";
import {
  Menu,
  MenuDropdown,
  MenuItem,
  MenuTarget,
  NavLink,
  Text,
} from "@mantine/core";

export function renderNavLinks({
  link,
  classNames,
  pathname,
  screen = "phone-up",
  root = true,
  closeAction,
}: TRenderNavLinksProps) {
  const key = `${link.title}-${screen}`;
  const className = clsx(
    classNames.base,
    pathname === link.href && classNames.active,
  );

  if (!link.links) {
    if (screen === "phone-up" && !root) {
      return (
        <NavLinkLeafMenuItem key={key} link={link} className={className} />
      );
    } else {
      return (
        <NavLinkLeaf
          key={key}
          link={link}
          className={className}
          close={closeAction}
        />
      );
    }
  } else {
    if (root) {
      return (
        <NavLinkBaseRoot
          key={key}
          link={link}
          classNames={classNames}
          pathname={pathname}
          screen={screen}
          closeAction={closeAction}
        />
      );
    } else {
      return (
        <NavLinkBase
          key={key}
          link={link}
          classNames={classNames}
          pathname={pathname}
          screen={screen}
          closeAction={closeAction}
        />
      );
    }
  }
}

export function NavLinkLeafMenuItem({ link, className }: TNavLinkProps) {
  return (
    <MenuItem>
      <NavLink
        component={Link}
        href={link.href || "/"}
        label={
          <Text component="div" fz="h3">
            {link.title}
          </Text>
        }
        className={className}
      />
    </MenuItem>
  );
}

export function NavLinkLeaf({
  link,
  className,
}: { close?: () => void } & TNavLinkProps) {
  return (
    <NavLink
      component={Link}
      href={link.href}
      className={className}
      label={
        <Text component="div" fz="h3">
          {link.title}
        </Text>
      }
      onClick={close}
    />
  );
}

export function NavLinkBaseRoot({
  link,
  classNames,
  pathname,
  screen = "phone-up",
  closeAction: close,
}: TRenderNavLinksProps) {
  const className = clsx(
    classNames.base,
    pathname === link.href && classNames.active,
  );
  const classNameRoot = clsx(
    classNames.base,
    pathname.includes(link.href) && classNames.active,
  );

  return (
    <Menu trigger="hover">
      <MenuTarget>
        <Text component="div" fz="h3" className={classNameRoot}>
          {link.title}
        </Text>
      </MenuTarget>
      <MenuDropdown>
        <MenuItem>
          <NavLink
            component={Link}
            href={link.href}
            label={
              <Text component="div" fz="h3">
                {link.title}
              </Text>
            }
            className={className}
          />
        </MenuItem>
        {link.links &&
          link.links.map((subLink) => {
            return renderNavLinks({
              link: subLink,
              classNames,
              pathname,
              screen,
              root: false,
              closeAction: close,
            });
          })}
      </MenuDropdown>
    </Menu>
  );
}

export function NavLinkBase({
  link,
  classNames,
  pathname,
  screen = "phone-up",
  closeAction: close,
}: TRenderNavLinksProps) {
  const className = clsx(
    classNames.base,
    pathname === link.href && classNames.active,
  );
  const classNameRoot = clsx(
    classNames.base,
    pathname.includes(link.href) && classNames.active,
  );

  return (
    <NavLink
      href=""
      label={
        <Text component="div" fz="h3">
          {link.title}
        </Text>
      }
      className={classNameRoot}
    >
      <NavLink
        href={link.href}
        label={
          <Text component="div" fz="h3">
            {link.title}
          </Text>
        }
        onClick={close}
        className={className}
      />
      {link.links &&
        link.links.map((subLink) => {
          return renderNavLinks({
            link: subLink,
            classNames,
            pathname,
            screen,
            root: false,
            closeAction: close,
          });
        })}
    </NavLink>
  );
}

export type TNavLinkProps = {
  link: INavLink;
  className: string;
};

export type TRenderNavLinksProps = {
  link: INavLink;
  classNames: INavLinkClassNames;
  pathname: string;
  screen: "phone" | "phone-up";
  root?: boolean;
  closeAction?: () => void;
};
