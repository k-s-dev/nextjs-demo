"use client";

import { msToHhMmSsMs } from "@/lib/utils/format";
import {
  Button,
  ButtonProps,
  Flex,
  SimpleGrid,
  Text,
  TextProps,
  Title,
} from "@mantine/core";

export default function TimeDuration({
  duration,
  title,
  showLabels = false,
  showMs = false,
  showTitle = false,
  labelPostion = "top",
  ...rest
}: TDurationProps) {
  const formattedDuration = msToHhMmSsMs(duration, !showMs);

  return (
    <>
      {showTitle && title && (
        <Title order={6} c={"gray"}>
          {title}
        </Title>
      )}
      <Flex align={"flex-end"} justify={"center"} gap={"xs"}>
        <Flex direction={"column"} gap={0}>
          {showLabels && labelPostion === "top" && <Labels showMs={showMs} />}
          <SimpleGrid
            cols={showMs ? 4 : 3}
            spacing={"xs"}
            verticalSpacing={"xs"}
          >
            <NumberDisplay {...rest}>{formattedDuration.hours}</NumberDisplay>
            <NumberDisplay {...rest}>{formattedDuration.minutes}</NumberDisplay>
            <NumberDisplay {...rest}>{formattedDuration.seconds}</NumberDisplay>
            {showMs && (
              <NumberDisplay {...rest}>
                {formattedDuration.milliseconds}
              </NumberDisplay>
            )}
          </SimpleGrid>
          {showLabels && labelPostion === "bottom" && (
            <Labels showMs={showMs} />
          )}
        </Flex>
      </Flex>
    </>
  );
}

function NumberDisplay({
  children,
  ...rest
}: { children: React.ReactNode } & ButtonProps) {
  return (
    <Button
      size="compact-xs"
      fz={"xl"}
      style={{ justifySelf: "center" }}
      {...rest}
    >
      {children}
    </Button>
  );
}

function Labels({ showMs = false }: { showMs: boolean }) {
  return (
    <SimpleGrid cols={showMs ? 4 : 3}>
      <LabelText label="hh" />
      <LabelText label="mm" />
      <LabelText label="ss" />
      {showMs && <LabelText label="ms" />}
    </SimpleGrid>
  );
}

function LabelText({ label, ...rest }: { label: string } & TextProps) {
  return (
    <Text component="div" ta={"center"} m={0} p={0} c={"gray"} {...rest}>
      {label}
    </Text>
  );
}

export type TDurationProps = {
  duration: number;
  title?: string;
  showLabels?: boolean;
  showMs?: boolean;
  showTitle?: boolean;
  labelPostion?: "top" | "bottom";
} & ButtonProps;
