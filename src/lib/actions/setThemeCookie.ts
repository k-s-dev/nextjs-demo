"use server";

import { cookies } from "next/headers";
import { TThemes } from "../components/nav/theme/NavThemeToggleButton";

export async function setThemeCookieAction(
  themeName: TThemes,
  overwrite: boolean = false,
) {
  const cookieStore = await cookies();
  const exists = cookieStore.has("theme");

  const setThemeCookie = () => {
    cookieStore.set("theme", themeName, { maxAge: 60 * 60 * 24 * 30 });
  };

  if (!exists) {
    setThemeCookie();
    return null;
  }

  if (exists && overwrite) {
    cookieStore.delete("theme");
    setThemeCookie();
    return null;
  }

  return null;
}
