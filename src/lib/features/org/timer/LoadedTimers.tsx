import { Title } from "@mantine/core";
import styles from "./LoadedTimers.module.scss";
import Timer from "./Timer";
import { useTimersContext } from "./TimersContext";

export default function LoadedTimers() {
  const timersCtx = useTimersContext();

  return (
    <>
      <Title order={2} mb={"md"}>
        Loaded Timers
      </Title>
      {timersCtx.state.timers.length <= 0 && <p>There are no timers loaded.</p>}
      <section className={styles.activeTimersContainer}>
        {timersCtx.state.timers.map((timer, idx) => {
          return <Timer key={idx} timer={timer} />;
        })}
      </section>
    </>
  );
}
