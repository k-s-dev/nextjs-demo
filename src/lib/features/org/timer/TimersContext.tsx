"use client";

import { vercelBlobSrc } from "@/lib/constants/vercelBlob";
import { createContext, Dispatch, useContext } from "react";
import { useImmerReducer } from "use-immer";

const initialState: ITimersState = {
  timers: [],
  showMs: false,
  showDetails: false,
  showInfo: false,
  audioSrc: "soft01",
};

export const TimersContext = createContext<ITimersContext | null>(null);

export function useTimersContext() {
  const timersCtx = useContext(TimersContext);
  if (!timersCtx) {
    throw new Error("Timers context is null.");
  }
  return timersCtx;
}

export function TimersProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useImmerReducer(timersReducer, initialState);

  return (
    <TimersContext.Provider value={{ state, dispatch }}>
      {children}
    </TimersContext.Provider>
  );
}

export function timersReducer(prevState: ITimersState, action: TTimersAction) {
  let timer: ITimerState | undefined;
  let idx;

  switch (action.type) {
    case "addTimer":
      prevState.timers.push(action.timer);
      break;

    case "showInfo":
      prevState.showInfo = action.value;
      break;

    case "showDetails":
      prevState.showDetails = action.value;
      break;

    case "showMs":
      prevState.showMs = action.value;
      break;

    case "addAudioSrc":
      prevState.audioSrc = action.value;
      break;

    case "showInfoTimer":
      timer = prevState.timers.find((timer) => timer.id === action.id);
      if (timer) {
        timer.showInfo = action.value;
      }
      break;

    case "showDetailsTimer":
      timer = prevState.timers.find((timer) => timer.id === action.id);
      if (timer) {
        timer.showDetails = action.value;
      }
      break;

    case "showMsTimer":
      timer = prevState.timers.find((timer) => timer.id === action.id);
      if (timer) {
        timer.showMs = action.value;
      }
      break;

    case "startTimer":
      timer = prevState.timers.find((timer) => timer.id === action.id);
      if (timer) {
        timer.status = "running";
      }
      break;

    case "pauseTimer":
      timer = prevState.timers.find((timer) => timer.id === action.id);
      if (timer) {
        timer.status = "paused";
      }
      break;

    case "resetTimer":
      timer = prevState.timers.find((timer) => timer.id === action.id);
      if (timer) {
        timer.status = "inactive";
      }
      break;

    case "expireTimer":
      timer = prevState.timers.find((timer) => timer.id === action.id);
      if (timer) {
        timer.status = "expired";
      }
      break;

    case "clearTimer":
      idx = prevState.timers.findIndex((timer) => timer.id === action.id);
      prevState.timers.splice(idx, 1);
      break;

    default:
      break;
  }
}

export type TAudioSrc = keyof typeof vercelBlobSrc.sounds.alerts;

export interface ITimerState {
  id: string;
  status: "inactive" | "running" | "expired" | "paused";
  initialExpiry: number;
  audioSrc: TAudioSrc;
  title?: string;
  showMs: boolean;
  showDetails: boolean;
  showInfo: boolean;
}

export interface ITimersState {
  timers: ITimerState[];
  showMs: boolean;
  showDetails: boolean;
  showInfo: boolean;
  audioSrc: TAudioSrc;
}

export type TTimersAction =
  | { type: "addTimer"; timer: ITimerState }
  | { type: "showInfo"; value: boolean }
  | { type: "showDetails"; value: boolean }
  | { type: "showMs"; value: boolean }
  | { type: "addAudioSrc"; value: TAudioSrc }
  | { type: "showInfoTimer"; id: string; value: boolean }
  | { type: "showDetailsTimer"; id: string; value: boolean }
  | { type: "showMsTimer"; id: string; value: boolean }
  | { type: "startTimer"; id: string }
  | { type: "pauseTimer"; id: string }
  | { type: "resetTimer"; id: string }
  | { type: "expireTimer"; id: string }
  | { type: "clearTimer"; id: string };

export interface ITimersContext {
  state: ITimersState;
  dispatch: Dispatch<TTimersAction>;
}
