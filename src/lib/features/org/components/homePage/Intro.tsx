import { Text, Title } from "@mantine/core";
import Link from "next/link";

export default function Intro() {
  return (
    <>
      <Title order={1} size="4rem" my={0}>
        Next{" "}
        <Text component="span" c="green.3" fz="inherit" fw="inherit">
          Org
        </Text>
      </Title>
      <Text fz="2rem" c="gray" my={0} py={0}>
        An{" "}
        <Text component="span" fz="inherit" c="blue.3">
          organizer
        </Text>{" "}
        built with{" "}
        <Text component="span" fz="3rem" c="green.3">
          <Link
            href={"https://nextjs.org/"}
            target="_blank"
            referrerPolicy="no-referrer"
          >
            Nextjs
          </Link>
        </Text>
      </Text>
    </>
  );
}
