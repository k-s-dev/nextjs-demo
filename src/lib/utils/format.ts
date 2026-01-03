export const dateFormat1 = new Intl.DateTimeFormat("en-UK", {
  year: "numeric",
  month: "short",
  day: "2-digit",
});

export function formatTimeDuration(duration: number, padding: number = 2) {
  const sign = duration < 0 ? "-" : "";
  if (sign === "-") {
    const result = sign + String(Math.abs(duration)).padStart(padding, "0");
    return result.padStart(4, " ")
  }
  return String(duration).padStart(padding, "0").padStart(4, " ");
}

export function msToHhMmSsMs(
  duration: number,
  roundSeconds: boolean = true,
  format: boolean = true,
) {
  function rounding(amount: number) {
    if (amount < 0) return Math.ceil(amount);
    return Math.floor(amount);
  }

  const hours = rounding(duration / (1000 * 60 * 60));
  const msAfterHours = duration % (1000 * 60 * 60);
  const minutes = rounding(msAfterHours / (1000 * 60));
  const msAfterMinutes = msAfterHours % (1000 * 60);
  const seconds = roundSeconds
    ? Math.round(msAfterMinutes / 1000)
    : rounding(msAfterMinutes / 1000);
  const msAfterSeconds = msAfterMinutes % 1000;

  if (format) {
    return {
      hours: formatTimeDuration(hours),
      minutes: formatTimeDuration(minutes),
      seconds: formatTimeDuration(seconds),
      milliseconds: formatTimeDuration(msAfterSeconds, 3),
    };
  }

  return {
    hours: String(hours),
    minutes: String(minutes),
    seconds: String(seconds),
    milliseconds: String(msAfterSeconds),
  };
}
