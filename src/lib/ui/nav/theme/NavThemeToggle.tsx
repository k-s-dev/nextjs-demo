"use server";

import { cookies } from "next/headers";
import { TThemes } from "./NavThemeToggleButton";
import { NavThemeToggleButton } from "../NoSsrComponents";

export default async function NavThemeToggle() {
  const cookieStore = await cookies();

  /**
   * type casting depends on cookie being set on initial page load through
   * `public/js/setThemeScript.js`
   */
  const themeName = cookieStore.get("theme")?.value as TThemes;

  return <NavThemeToggleButton themeName={themeName} />;
}
