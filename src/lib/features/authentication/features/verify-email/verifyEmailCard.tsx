import { Card, CardContent } from "@/lib/components/card";
import AuthCardHeader from "../../components/AuthCardHeader";

export default function VerifyEmailCard({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Card>
      <AuthCardHeader subTitle="Verify email" />
      <CardContent>{children}</CardContent>
    </Card>
  );
}
