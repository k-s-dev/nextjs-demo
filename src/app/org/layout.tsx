import Navbar from "@/lib/features/org/components/nav/Navbar";
import AppShell from "@/lib/ui/layout/01/AppShell";

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell nav={<Navbar />}>{children}</AppShell>;
}
