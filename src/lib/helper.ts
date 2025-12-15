export const renderEventText = (events: any[]) => {
  if (!Array.isArray(events) || events.length === 0) return "";

  return events.map((ev) => `Bi ${ev.bi} x${ev.count}`).join(", ");
};
