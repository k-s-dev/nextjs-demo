import { Flex, Text, Title } from "@mantine/core";
import { CountersProvider } from "@/lib/features/org/counter/CountersContext";
import AddCounter from "@/lib/features/org/counter/AddCounter";
import LoadedCounters from "@/lib/features/org/counter/LoadedCounters";
import Layout03 from "@/lib/ui/layout/01/03/Layout03";

export default function page() {
  return (
    <Layout03>
      <CountersProvider>
        <main>
          <Flex direction="column" gap={"md"} px={"xs"} pb={"xl"} mb={"xl"}>
            <header>
              <h1>Counter</h1>
              <Text mb={"lg"} fz={"h2"} c={"gray"}>
                A simple counter to keep track of [ anything ]
              </Text>
            </header>
            <Title order={2}>Add Counter</Title>
            <AddCounter />
            <Title order={2}>Loaded Counters</Title>
            <LoadedCounters />
          </Flex>
        </main>
      </CountersProvider>
    </Layout03>
  );
}
