"use client";

import dynamic from "next/dynamic";

export const NavLinksPhone = dynamic(() => import("./NavLinksPhone"), {
  ssr: false,
});

export const NavThemeToggleButton = dynamic(
  () => import("./theme/NavThemeToggleButton"),
  {
    ssr: false,
  },
);
