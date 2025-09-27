"use server";

import { cookies } from "next/headers";
import NavThemeToggleButton, {
  TThemes,
} from "./NavThemeToggleButton";

export default async function NavThemeToggleWrapper() {
  const cookieStore = await cookies();

  /**
   * type casting depends on cookie being set on initial page load through
   * `public/js/setThemeScript.js`
   */
  const themeName = cookieStore.get("theme")?.value as TThemes;

  return <NavThemeToggleButton themeName={themeName} />;
}
