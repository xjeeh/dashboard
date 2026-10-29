import dayjs from "dayjs";

/**
 * Chave do "dia hídrico": após o horário de reset (default 6:00),
 * começa um novo dia; antes disso ainda conta como o dia anterior.
 */
export function getWaterDayKey(resetHour = 6, now = dayjs()) {
  const current = dayjs(now);
  const boundary = current.hour(resetHour).minute(0).second(0).millisecond(0);
  if (current.isBefore(boundary)) {
    return current.subtract(1, "day").format("YYYY-MM-DD");
  }
  return current.format("YYYY-MM-DD");
}
