"use client";

import { SimpleGrid } from "@mantine/core";
import { useCountersCtx } from "./CountersContext";
import Counter from "./Counter";

export default function LoadedCounters() {
  const { countersState } = useCountersCtx();

  return (
    <SimpleGrid cols={{ base: 1, md: 4, sm: 2 }}>
      {countersState.counters.map((counter, idx) => {
        return <Counter key={idx} initialState={counter} idx={idx} />;
      })}
    </SimpleGrid>
  );
}
