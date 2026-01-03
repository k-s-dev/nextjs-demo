"use client";

import {
  Button,
  Card,
  CloseButton,
  Flex,
  NumberInput,
  Text,
  Title,
} from "@mantine/core";
import { FaArrowsRotate, FaMinus, FaPlus } from "react-icons/fa6";
import { useImmer } from "use-immer";
import { useCountersCtx } from "./CountersContext";
import styles from "./Counter.module.scss";

export default function Counter({
  initialState,
  idx,
}: {
  initialState: ICounterState;
  idx: number;
}) {
  const [state, setState] = useImmer(initialState);
  const { setCountersState } = useCountersCtx();

  function handleIncrement() {
    setState((draft) => {
      draft.count += draft.amount;
    });
  }

  function handleDecrement() {
    setState((draft) => {
      draft.count -= draft.amount;
    });
  }

  function handleBaseChange(value: number | string) {
    setState((draft) => {
      draft.base = Number(value);
    });
  }

  function handleAmountChange(value: number | string) {
    setState((draft) => {
      draft.amount = Number(value);
    });
  }

  function handleRemove(idx: number) {
    setCountersState((draft) => {
      draft.counters.splice(idx, 1);
    });
  }

  function handleReset() {
    setState((draft) => {
      draft.count = draft.base || 0;
    });
  }

  return (
    <Card withBorder shadow="xl" className={styles.container}>
      <CloseButton
        className={styles.closeButton}
        onClick={() => handleRemove(idx)}
      />
      <Flex direction={"column"} align={"space-between"} gap={"md"}>
        <Flex direction={"column"} align={"center"}>
          {state.title && <Title order={3}>{state.title}</Title>}
          <Text fz={"h1"}>{state.count}</Text>
        </Flex>
        <Flex justify={"center"} gap={"xs"}>
          <Button onClick={handleDecrement} variant="outline" color="blue">
            <FaMinus />
          </Button>
          <Button onClick={handleIncrement} variant="outline" color="blue">
            <FaPlus />
          </Button>
        </Flex>
        <NumberInput
          label="Amount"
          value={state.amount}
          onChange={handleAmountChange}
          allowNegative
        />
        <NumberInput
          label="Base"
          value={state.base}
          onChange={handleBaseChange}
          allowNegative
        />
        <Button onClick={handleReset} variant="outline" color="orange">
          <FaArrowsRotate />
        </Button>
      </Flex>
    </Card>
  );
}

export interface ICounterState {
  count: number;
  amount: number;
  base?: number;
  title?: string;
}
