"use client";

import { useWithSound } from "@/lib/ui/hooks/useSound";
import {
  Tooltip,
  Button,
  Flex,
  Stack,
  Chip,
  Title,
  Center,
  Card,
} from "@mantine/core";
import { useRef, useEffect, useCallback } from "react";
import { FaPlay, FaSquare, FaPause, FaVolumeXmark, FaX } from "react-icons/fa6";
import { ITimerState, useTimersContext } from "./TimersContext";
import { useImmer } from "use-immer";
import TimeDuration from "./TimeDuration";
import { vercelBlobSrc } from "@/lib/constants/vercelBlob";
import { msToHhMmSsMs } from "@/lib/utils/format";
import TimerProgress from "./TimerProgress";
import { TTimeout } from "@/lib/types/generic";

export const updateInterval = 100;

/**
 * Returns a timer component.
 *
 * @param expiry - expiry time in seconds
 * @param audioSrc - audio source href
 * @returns Timer JSX.Element
 *
 * @example
 * ```
 * Write me later.
 * ```
 */

export default function Timer({ timer }: { timer: ITimerState }) {
  const { state: timersState, dispatch } = useTimersContext();

  const initialState = {
    expiry: timer.initialExpiry,
    elapsed: 0,
    showMs: false,
    showDetails: false,
    showInfo: false,
  };

  const [state, setState] = useImmer<ITimerLocalState>(initialState);

  const intervalRef = useRef<TTimeout | null>(null);
  const { playSound, stopSound } = useWithSound(
    vercelBlobSrc.sounds.alerts[timer.audioSrc].href,
  );

  let elapsed = state.elapsed || 0;

  if (state.now && state.start) {
    elapsed = elapsed + state.now - state.start;
  }

  const handleStart = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setState((draft) => {
      draft.start = Date.now();
      draft.now = Date.now();
    });
    dispatch({ type: "startTimer", id: timer.id });
    intervalRef.current = setInterval(() => {
      const newNow = Date.now();
      setState((draft) => {
        draft.now = newNow;
      });
    }, updateInterval);
  }, [dispatch, setState, timer]);

  function handlePause() {
    dispatch({ type: "pauseTimer", id: timer.id });
    if (timer.status === "running") {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setState((draft) => {
        draft.expiry = draft.expiry - elapsed;
        draft.elapsed = elapsed;
        draft.start = Date.now();
        draft.now = Date.now();
      });
    }
  }

  function handleStop() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    stopSound();
    setState((draft) => {
      draft.start = undefined;
      draft.now = undefined;
      draft.expiry = timer.initialExpiry;
      draft.elapsed = 0;
    });
    dispatch({ type: "resetTimer", id: timer.id });
  }

  function handleToggleDetails() {
    dispatch({
      type: "showDetailsTimer",
      id: timer.id,
      value: !timer.showDetails,
    });
  }

  function handleToggleInfo() {
    dispatch({ type: "showInfoTimer", id: timer.id, value: !timer.showInfo });
  }

  function handleToggleMs() {
    dispatch({ type: "showMsTimer", id: timer.id, value: !timer.showMs });
  }

  useEffect(() => {
    if (!state.start && !state.now && timer.status === "running") {
      handleStart();
    }

    if (state.now && state.start && timer.status !== "expired") {
      if (state.now - state.start >= state.expiry) {
        playSound();
        setState((draft) => {
          draft.expiry = timer.initialExpiry;
        });
        dispatch({ type: "expireTimer", id: timer.id });
      }
    }
  }, [dispatch, handleStart, playSound, setState, state, timer]);

  return (
    <Card withBorder shadow="md" px="lg" m={"xs"} maw={"100%"} miw={250}>
      <Stack gap={"xs"}>
        <TimerTitle timer={timer} />

        <Center>
          <TimerProgress state={state} timer={timer} />
        </Center>

        {(timersState.showDetails || timer.showDetails) && (
          <Flex
            direction={"column"}
            gap={"xs"}
            mb={"xs"}
            align={"space-around"}
          >
            <InitialExpiry timer={timer} />
            <Elapsed state={state} timer={timer} />
            <Target state={state} timer={timer} />
            <Remaining state={state} timer={timer} />
          </Flex>
        )}

        <Flex justify="space-around">
          {timer.status === "running" ? (
            <Tooltip label="Pause">
              <Button size="compact-xs" color="yellow.1" onClick={handlePause}>
                <FaPause />
              </Button>
            </Tooltip>
          ) : (
            <Tooltip label="Play">
              <Button size="compact-xs" color="green.1" onClick={handleStart}>
                <FaPlay />
              </Button>
            </Tooltip>
          )}

          <Tooltip label="Stop/Reset">
            <Button size="compact-xs" color="red.1" onClick={handleStop}>
              <FaSquare />
            </Button>
          </Tooltip>

          <Tooltip label="Mute">
            <Button size="compact-xs" onClick={() => stopSound()}>
              <FaVolumeXmark />
            </Button>
          </Tooltip>

          <Tooltip label="Clear">
            <Button
              color="red"
              size="compact-xs"
              onClick={() => {
                stopSound();
                dispatch({ type: "clearTimer", id: timer.id });
              }}
            >
              <FaX />
            </Button>
          </Tooltip>
        </Flex>

        <Flex gap={"xs"}>
          <Chip
            checked={timersState.showDetails || timer.showDetails}
            onClick={handleToggleDetails}
            size="xs"
          >
            Details
          </Chip>
          <Chip
            checked={timersState.showInfo || timer.showInfo}
            onClick={handleToggleInfo}
            size="xs"
          >
            Info
          </Chip>
          <Chip
            checked={timersState.showMs || timer.showMs}
            onClick={handleToggleMs}
            size="xs"
          >
            Ms
          </Chip>
        </Flex>
      </Stack>
    </Card>
  );
}

function Elapsed({
  state,
  timer,
}: {
  state: ITimerLocalState;
  timer: ITimerState;
}) {
  const { state: timersState } = useTimersContext();

  return (
    <TimeDuration
      duration={(state.now || 0) - (state.start || 0)}
      title="Elapsed"
      color="blue.1"
      showMs={timersState.showMs || timer.showMs}
      showLabels
      showTitle={timersState.showInfo || timer.showInfo}
    />
  );
}

function Remaining({
  timer,
  state,
}: {
  timer: ITimerState;
  state: ITimerLocalState;
}) {
  const { state: timersState } = useTimersContext();
  return (
    <TimeDuration
      duration={state.expiry - ((state.now || 0) - (state.start || 0))}
      title="Remaining"
      color="yellow.1"
      showMs={timersState.showMs || timer.showMs}
      showTitle={timersState.showInfo || timer.showInfo}
    />
  );
}

function Target({
  state,
  timer,
}: {
  state: ITimerLocalState;
  timer: ITimerState;
}) {
  const { state: timersState } = useTimersContext();
  return (
    <>
      <TimeDuration
        duration={state.expiry}
        title="Expiry"
        color="green.1"
        showMs={timersState.showMs || timer.showMs}
        showTitle={timersState.showInfo || timer.showInfo}
      />
    </>
  );
}

function InitialExpiry({ timer }: { timer: ITimerState }) {
  const { state: timersState } = useTimersContext();

  return (
    <TimeDuration
      duration={timer.initialExpiry}
      title="Expiry (initial)"
      color="gray.1"
      showMs={timersState.showMs || timer.showMs}
      showTitle={timersState.showInfo || timer.showInfo}
    />
  );
}

function TimerTitle({ timer }: { timer: ITimerState }) {
  // fe: formatted expiry (initial)
  const fe = msToHhMmSsMs(timer.initialExpiry, true, false);
  let title;

  if (timer.title) {
    title = timer.title;
  } else {
    title = `${fe.seconds}s`;
    if (timer.initialExpiry > 1000 * 60) title = `${fe.minutes}m` + title;
    if (timer.initialExpiry > 1000 * 60 * 60) title = `${fe.hours}h` + title;
  }

  return (
    <Title ta={"center"} order={5}>
      {title}
    </Title>
  );
}

export interface ITimerLocalState {
  expiry: number;
  elapsed: number;
  start?: number;
  now?: number;
}
