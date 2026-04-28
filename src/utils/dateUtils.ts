export function formatDate(isoString: string): string {
  // Date-only strings (YYYY-MM-DD) parse as UTC midnight → add noon to avoid off-by-one in negative-offset timezones
  const dateStr = isoString.length === 10 ? isoString + "T12:00:00" : isoString;
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function now(): string {
  return new Date().toISOString();
}

/** Returns local date as YYYY-MM-DD (avoids UTC shift issues) */
export function localDateString(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
