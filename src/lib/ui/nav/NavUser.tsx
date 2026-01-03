"use client";

import { Menu, MenuDropdown, MenuItem, MenuTarget } from "@mantine/core";
import UserAvatar from "@/lib/features/authentication/components/UserAvatar";
import SignOut from "@/lib/features/authentication/features/signOut/SignOut";
import SignUpLinkButton from "@/lib/features/authentication/features/signUp/SignUpLinkButton";
import SignInLinkButton from "@/lib/features/authentication/features/signIn/SignInLinkButton";
import { Session } from "@/lib/features/authentication/auth-client";
import { requestResetPasswordClientAction } from "@/lib/features/authentication/features/resetPassword/requestResetPasswordClientAction";
import { useSessionContext } from "../providers/SessionProvider";

export default function NavUser() {
  const sessionCtx = useSessionContext();

  if (!sessionCtx.data) {
    return (
      <>
        <SignInLinkButton />
        <SignUpLinkButton />
      </>
    );
  }

  return <NavUserAvatar session={sessionCtx.data} />;
}

export function NavUserAvatar({ session }: { session: Session }) {
  const user = session?.user;

  return (
    <>
      <Menu trigger="click-hover" shadow="md">
        <MenuTarget>
          {/* div needed for click/hover trigger to work */}
          <div data-test-cy="nav-user-avatar">
            <UserAvatar src={user?.image || undefined} userName={user?.name} />
          </div>
        </MenuTarget>
        <MenuDropdown mx="md">
          <MenuItem
            onClick={async () => {
              await requestResetPasswordClientAction();
            }}
            fz="lg"
          >
            Reset Password
          </MenuItem>
          <MenuItem fz="lg" color="red">
            <SignOut>Sign Out</SignOut>
          </MenuItem>
        </MenuDropdown>
      </Menu>
    </>
  );
}
