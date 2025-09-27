import Link from "next/link";

import "./SignIn.scss"

import { routes } from "@/lib/utils/routeMapper";

export default function SignInLinkBtn({ title = "Sign In" }: IProps) {
  return (
    <Link href={routes.all.signIn} className="signIn-link-btn">
      {title}
    </Link>
  );
}

interface IProps {
  title?: string;
}
