export const formatHhMm = (rawDate?: Date | string) =>  {
  if (!rawDate) return;
  const date = rawDate instanceof Date ? rawDate : new Date(rawDate);
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
};
