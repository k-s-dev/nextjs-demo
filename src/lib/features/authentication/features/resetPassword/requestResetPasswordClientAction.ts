"use client";

import { notifications } from "@mantine/notifications";
import { authClient } from "../../auth-client";
import { routes } from "@/lib/utils/routeMapper";

export async function requestResetPasswordClientAction() {
  const { data: session, error } = await authClient.getSession();

  if (error) {
    notifications.show({
      message: error.message,
      color: "red",
    });
  }

  if (session?.user.email) {
    const { data, error } = await authClient.requestPasswordReset({
      email: session.user.email,
      redirectTo: routes.authentication.resetPassword,
    });
    if (data?.status) {
      notifications.show({
        message: data.message,
      });
    }
    if (error) {
      notifications.show({
        message: error.message,
        color: "red",
      });
    }
  } else {
    notifications.show({
      message: "Session not valid. SignIn again.",
      color: "red",
    });
  }
}
