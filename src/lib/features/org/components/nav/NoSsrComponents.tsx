"use client";

import dynamic from "next/dynamic";

export const NavLinksPhone = dynamic(() => import("./NavLinksPhone"), {
  ssr: false,
});

export const NavLinks = dynamic(() => import("./NavLinks"), {
  ssr: false,
});

