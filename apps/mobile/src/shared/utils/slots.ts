import { ScheduleSlot } from "../types/domain";

export function getCurrentSlot(date: Date = new Date()): ScheduleSlot {
  const h = date.getHours();

  // Morning: 06:00–11:59
  if (h >= 6 && h <= 11) return "morning";

  // Noon: 12:00–16:59
  if (h >= 12 && h <= 16) return "noon";

  // Evening: 17:00–21:59
  if (h >= 17 && h <= 21) return "evening";

  // Night: 22:00–05:59
  return "night";
}

export function getLocalDateISO(date: Date = new Date()): string {
  // YYYY-MM-DD in local time
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function slotLabel(slot: ScheduleSlot): string {
  switch (slot) {
    case "morning":
      return "Morning";
    case "noon":
      return "Noon";
    case "evening":
      return "Evening";
    case "night":
      return "Night";
  }
}
