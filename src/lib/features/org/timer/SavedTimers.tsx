"use client";

import { Button, SimpleGrid } from "@mantine/core";
import { useTimersContext } from "./TimersContext";

const preSavedTimerExpiries = [
  { title: "30 s", expiry: 1000 * 30 },
  { title: "1 m", expiry: 1000 * 60 * 1 },
  { title: "2 m", expiry: 1000 * 60 * 2 },
  { title: "3 m", expiry: 1000 * 60 * 3 },
  { title: "4 m", expiry: 1000 * 60 * 4 },
  { title: "5 m", expiry: 1000 * 60 * 5 },
  { title: "10 m", expiry: 1000 * 60 * 10 },
  { title: "15 m", expiry: 1000 * 60 * 15 },
  { title: "20 m", expiry: 1000 * 60 * 20 },
  { title: "25 m", expiry: 1000 * 60 * 25 },
  { title: "30 m", expiry: 1000 * 60 * 30 },
  { title: "40 m", expiry: 1000 * 60 * 40 },
  { title: "50 m", expiry: 1000 * 60 * 50 },
  { title: "1 h", expiry: 1000 * 60 * 60 },
  { title: "1 h 30 m", expiry: 1000 * 60 * 90 },
];

export default function SavedTimers() {
  const timersCtx = useTimersContext();

  function handleAddTimer(expiry: number, title: string) {
    timersCtx.dispatch({
      type: "addTimer",
      timer: {
        id: String(timersCtx.state.timers.length + 1),
        initialExpiry: expiry,
        audioSrc: timersCtx.state.audioSrc,
        status: "running",
        title: title,
        showDetails: timersCtx.state.showDetails,
        showInfo: timersCtx.state.showInfo,
        showMs: timersCtx.state.showMs,
      },
    });
  }

  return (
    <SimpleGrid cols={{ base: 3, md: 5 }} my={"md"}>
      {preSavedTimerExpiries.map((val, idx) => {
        return (
          <Button
            key={idx}
            onClick={() => handleAddTimer(val.expiry, val.title)}
            variant="outline"
            color="blue.8"
            fz={"lg"}
          >
            {val.title}
          </Button>
        );
      })}
    </SimpleGrid>
  );
}
