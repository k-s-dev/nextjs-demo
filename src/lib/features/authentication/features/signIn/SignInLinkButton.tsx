import { routes } from "@/lib/utils/routeMapper";
import LinkButton from "@/lib/ui/LinkButton";
import { ButtonProps } from "@mantine/core";

export default function SignInLinkButton({
  title = "Sign In",
  ...restProps
}: TProps) {
  return (
    <LinkButton
      href={routes.authentication.signIn}
      color="green.1"
      {...restProps}
    >
      {title}
    </LinkButton>
  );
}

type TProps = {
  title?: string;
} & ButtonProps;
