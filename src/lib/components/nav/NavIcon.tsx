"use client";

import Link from "next/link";
import { FaBullseye } from "react-icons/fa6";

import "./Navbar.scss";

import { routes } from "@/lib/utils/routeMapper";

export default function NavIcon() {
  return (
    <Link href={routes.generic.home}>
      <FaBullseye />
    </Link>
  );
}
