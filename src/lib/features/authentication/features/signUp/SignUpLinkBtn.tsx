import Link from "next/link";

import "./SignUp.scss";

import { routes } from "@/lib/utils/routeMapper";

export default function SignUpLinkBtn({ title = "Sign Up" }: IProps) {
  return (
    <Link href={routes.all.signUp} className="signUp-link-btn">
      {title}
    </Link>
  );
}

interface IProps {
  title?: string;
}
