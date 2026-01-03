import Timers from "@/lib/features/org/timer/Timers";
import { TimersProvider } from "@/lib/features/org/timer/TimersContext";
import { Flex } from "@mantine/core";
import Layout03 from "@/lib/ui/layout/01/03/Layout03";

export default function page() {
  return (
    <TimersProvider>
      <Layout03>
        <main>
          <Flex direction="column" px={"xs"}>
            <h1>Timer</h1>
            <Timers />
          </Flex>
        </main>
      </Layout03>
    </TimersProvider>
  );
}
