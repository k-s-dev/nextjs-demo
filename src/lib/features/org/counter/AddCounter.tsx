"use client";

import { Button, Flex, NumberInput, TextInput } from "@mantine/core";
import { ICounterState } from "./Counter";
import { useImmer } from "use-immer";
import { useCountersCtx } from "./CountersContext";

export default function AddCounter() {
  const { setCountersState } = useCountersCtx();
  const [counter, setCounter] = useImmer<ICounterState>({
    count: 0,
    amount: 1,
    base: 0,
  });

  function handleAmountChange(value: number | string) {
    setCounter((draft) => {
      draft.amount = Number(value);
    });
  }

  function handleBaseChange(value: number | string) {
    setCounter((draft) => {
      draft.count = Number(value);
      draft.base = Number(value);
    });
  }

  function handleTitleChange(value: string) {
    setCounter((draft) => {
      draft.title = value;
    });
  }

  function handleAddCounter() {
    setCountersState((draft) => {
      draft.counters.push(counter);
    });
  }

  return (
    <Flex gap={"xs"} align={"flex-end"} wrap={"wrap"}>
      <NumberInput
        label="Increment/Decrement Amount"
        value={counter.amount}
        onChange={handleAmountChange}
        allowNegative
        required
      />
      <NumberInput
        label="Base"
        value={counter.base}
        onChange={handleBaseChange}
        allowNegative
      />
      <TextInput
        label="Title (Optional)"
        value={counter?.title}
        onChange={(e) => handleTitleChange(e.target.value)}
      />
      <Button variant="outline" color="blue" onClick={handleAddCounter}>
        Add Counter
      </Button>
    </Flex>
  );
}
