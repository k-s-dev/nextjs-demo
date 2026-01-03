"use client";

import { msToHhMmSsMs } from "@/lib/utils/format";
import { ITimerLocalState } from "./Timer";
import { ITimerState } from "./TimersContext";
import { DonutChart } from "@mantine/charts";

export default function TimerProgress({
  state,
  timer,
}: {
  state: ITimerLocalState;
  timer: ITimerState;
}) {
  let elapsed = 0;
  let displayText;
  if (state.now && state.start) {
    elapsed = state.now - state.start + state.elapsed;
  }
  const expiry = state.expiry;
  const remaining = expiry - elapsed + state.elapsed;
  const formattedRemaining = msToHhMmSsMs(remaining);

  displayText = `${formattedRemaining.seconds}`;
  if (remaining > 60 * 1000) {
    displayText = formattedRemaining.minutes + " :" + displayText;
  }
  if (remaining > 60 * 60 * 1000) {
    displayText = formattedRemaining.hours + " :" + displayText;
  }

  return (
    <DonutChart
      withTooltip={false}
      size={100}
      thickness={5}
      w={150}
      h={150}
      startAngle={-270}
      endAngle={90}
      data={[
        {
          name: "Remaining",
          value: remaining / expiry,
          color: timer.status !== "expired" ? "blue" : "orange",
        },
        {
          name: "Elapsed",
          value: elapsed / expiry,
          color: timer.status === "expired" ? "red" : "gray",
        },
      ]}
      chartLabel={displayText}
    />
  );
}
