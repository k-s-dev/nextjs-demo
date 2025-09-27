"use client";

import { signOut, useSession } from "next-auth/react";
import {
  Menu,
  MenuDropdown,
  MenuItem,
  MenuTarget,
  Skeleton,
} from "@mantine/core";
import Link from "next/link";

import "./Navbar.scss";

import SignInLinkBtn from "@/lib/features/authentication/features/signIn/SignInLinkBtn";
import SignUpLinkBtn from "@/lib/features/authentication/features/signUp/SignUpLinkBtn";
import SignOutButton from "@/lib/features/authentication/features/signOut/SignOutButton";
import UserAvatar from "@/lib/features/authentication/components/UserAvatar";
import { routes } from "@/lib/utils/routeMapper";
import { TUserPublic } from "@/lib/dataModels/auth/user/definitions";
import { useEffect } from "react";
import { getUser } from "@/lib/dataModels/auth/user/dataAccess";

export default function NavUser() {
  const { data: session, status } = useSession();

  useEffect(() => {
    const checkDbUser = async () => {
      if (session?.user) {
        const dbUser = await getUser({ id: session?.user.id }, "server");
        if (!dbUser) signOut();
      }
    };
    checkDbUser();
  }, [session?.user]);

  const user = session?.user as TUserPublic;

  if (status === "loading") {
    return <Skeleton circle height={20} />;
  }

  if (status === "unauthenticated") {
    return (
      <>
        <SignInLinkBtn />
        <SignUpLinkBtn />
      </>
    );
  }

  return (
    <>
      <Menu trigger="click-hover">
        <MenuTarget>
          <div>
            <UserAvatar src={user?.image} userName={user?.name} />
          </div>
        </MenuTarget>
        <MenuDropdown>
          <MenuItem className="nav-user-name">
            {user.name || user.email}
          </MenuItem>
          <MenuItem component="div">
            <Link
              href={routes.authentication.resetPassword} // TODO: change url when available
              className="nav-link"
            >
              Profile
            </Link>
          </MenuItem>
          <SignOutButton />
        </MenuDropdown>
      </Menu>
    </>
  );
}
