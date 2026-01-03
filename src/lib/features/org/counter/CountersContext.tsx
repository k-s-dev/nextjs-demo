"use client";

import { Updater, useImmer } from "use-immer";
import { ICounterState } from "./Counter";
import { createContext, useContext } from "react";

const initialCounters = {
  counters: [],
  amount: 1,
};

const CountersCtx = createContext<ICountersCtx | null>(null);

export function useCountersCtx() {
  const ctx = useContext(CountersCtx);
  if (!ctx) {
    throw new Error("Counters context is null.");
  }
  return ctx;
}

export function CountersProvider({ children }: { children: React.ReactNode }) {
  const [countersState, setCountersState] =
    useImmer<ICountersState>(initialCounters);

  return (
    <CountersCtx.Provider value={{ countersState, setCountersState }}>
      {children}
    </CountersCtx.Provider>
  );
}

export interface ICountersState {
  counters: ICounterState[];
  amount: number;
}

export interface ICountersCtx {
  countersState: ICountersState;
  setCountersState: Updater<ICountersState>;
}
