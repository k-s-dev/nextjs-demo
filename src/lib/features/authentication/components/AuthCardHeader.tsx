"use client";

import Link from "next/link";
import { PiShieldCheck } from "react-icons/pi";

import { CardHeader } from "@/lib/components/card";
import { routes } from "@/lib/utils/routeMapper";

export default function AuthCardHeader({
  subTitle = "Create an account",
}: {
  subTitle?: React.ReactNode;
}) {
  return (
    <CardHeader>
      <h1>
        <Link href={routes.all.home}>
          <PiShieldCheck /> Auth
        </Link>
      </h1>
      <h5>{subTitle}</h5>
    </CardHeader>
  );
}
