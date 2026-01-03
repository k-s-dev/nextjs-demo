"use client";

import { Box, Flex, Title } from "@mantine/core";
import SavedTimers from "./SavedTimers";
import AddTimer from "./AddTimer";
import TimerConfig from "./TimerConfig";
import LoadedTimers from "./LoadedTimers";

export default function Timers() {
  return (
    <Box>
      <TimerConfig />
      <Flex direction={"column"}>
        <LoadedTimers />
        <Title order={2}>Add Timer</Title>
        <Title order={3}>Preconfigured</Title>
        <SavedTimers />
        <Title order={3}>Custom</Title>
        <AddTimer />
      </Flex>
    </Box>
  );
}
