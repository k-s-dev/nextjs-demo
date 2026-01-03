"use client";

import { vercelBlobSrc } from "@/lib/constants/vercelBlob";
import { Chip, Flex, Select, Title } from "@mantine/core";
import { TAudioSrc, useTimersContext } from "./TimersContext";

const alerts = vercelBlobSrc.sounds.alerts;

export default function TimerConfig() {
  const timersCtx = useTimersContext();

  return (
    <>
      <Title order={2} mb={"md"}>Configuration</Title>
      <Flex
        justify={"space-between"}
        align={"center"}
        wrap={"wrap"}
        gap={"md"}
        mb={"md"}
      >
        <Flex align="flex-end" justify="flex-start" gap={"xs"}>
          <Chip
            onChange={(checked) =>
              timersCtx.dispatch({ type: "showDetails", value: checked })
            }
          >
            Details
          </Chip>
          <Chip
            onChange={(checked) =>
              timersCtx.dispatch({ type: "showInfo", value: checked })
            }
          >
            Info
          </Chip>
          <Chip
            onChange={(checked) => {
              timersCtx.dispatch({ type: "showMs", value: checked });
            }}
          >
            Ms
          </Chip>
        </Flex>
        <Select
          clearable
          searchable
          placeholder="Alert tone"
          label="Alert tone"
          data={Object.keys(alerts).map((v) => {
            return { value: v, label: v.toUpperCase().replace("0", " 0") };
          })}
          value={timersCtx.state.audioSrc}
          onChange={(value) => {
            if (value) {
              timersCtx.dispatch({
                type: "addAudioSrc",
                value: value as TAudioSrc,
              });
            }
          }}
        />
      </Flex>
    </>
  );
}
