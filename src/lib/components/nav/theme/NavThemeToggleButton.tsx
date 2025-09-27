"use client";

import "../Navbar.scss";

import { PiMoonFill, PiSun } from "react-icons/pi";
import {
  Menu,
  MenuDropdown,
  MenuItem,
  MenuTarget,
  useMantineColorScheme,
} from "@mantine/core";
import { setThemeCookieAction } from "@/lib/actions/setThemeCookie";
import { useEffect } from "react";

export default function NavThemeToggleButton({
  themeName,
}: {
  themeName: TThemes;
}) {
  const { setColorScheme } = useMantineColorScheme();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", themeName);
    setColorScheme(themeName);
  }, [setColorScheme, themeName]);

  async function handleClick(themeName: TThemes) {
    document.documentElement.setAttribute("data-theme", themeName);
    setColorScheme(themeName);
    await setThemeCookieAction(themeName, true);
  }

  const theme = themes.find((t) => t.name === themeName) || themes[0];

  return (
    <section className="nav-toggle_theme">
      <Menu trigger="click-hover">
        <MenuTarget>
          <div className="nav-toggle_theme-icon-selected">{theme.icon}</div>
        </MenuTarget>
        <MenuDropdown>
          {themes.map((value) => {
            return (
              <MenuItem
                key={value.name}
                leftSection={value.icon}
                onClick={() => handleClick(value.name)}
              >
                <span className="nav-theme-name">{value.name}</span>
              </MenuItem>
            );
          })}
        </MenuDropdown>
      </Menu>
    </section>
  );
}

const themes: IThemeToggle[] = [
  {
    name: "light",
    icon: <PiSun />,
  },
  {
    name: "dark",
    icon: <PiMoonFill />,
  },
];

export const THEMES = ["light", "dark"] as const;
export type TThemes = (typeof THEMES)[number];
export interface IThemeToggle {
  name: TThemes;
  icon: React.ReactNode;
}
