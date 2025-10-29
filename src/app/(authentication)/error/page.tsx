import { routes } from "@/lib/utils/routeMapper";
import Link from "next/link";

export default function Page() {
  return (
    <div>
      <p>Sign in failed.</p>
      <Link href={routes.all.signIn} className="btn">Back to signIn</Link>
    </div>
  )
}
