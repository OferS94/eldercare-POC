export type ScheduleSlot = "morning" | "noon" | "evening" | "night";

export type Medication = {
  id: string;
  elderId: string;
  name: string;
  instructions?: string;
  active: boolean;
};

export type DoseStatus = "pending" | "taken";

export type DoseOccurrence = {
  id: string;
  elderId: string;
  medicationId: string;
  medicationName: string; // denormalized for POC convenience
  dateISO: string; // YYYY-MM-DD (local date)
  slot: ScheduleSlot;
  status: DoseStatus;
  takenAtISO?: string; // ISO string
};
