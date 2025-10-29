import { routes } from "@/lib/utils/routeMapper";
import LinkButton from "@/lib/components/LinkButton";
import { ButtonProps } from "@mantine/core";

export default function SignUpLinkButton({
  title = "Sign Up",
  ...restProps
}: TProps) {
  return (
    <LinkButton
      href={routes.authentication.signUp}
      color="blue.1"
      {...restProps}
    >
      {title}
    </LinkButton>
  );
}

type TProps = {
  title?: string;
} & ButtonProps;
