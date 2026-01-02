import React, { createContext, useContext, useMemo, useState } from "react";
import { DoseOccurrence, Medication, ScheduleSlot } from "../shared/types/domain";
import { getCurrentSlot, getLocalDateISO } from "../shared/utils/slots";

type Elder = { id: string; name: string };

type PocState = {
  elders: Elder[];
  selectedElderId: string;
  medications: Medication[];
  doses: DoseOccurrence[];
};

type PocActions = {
  selectElder: (elderId: string) => void;
  addMedication: (input: { name: string; instructions?: string }) => void;
  markDoseTaken: (doseOccurrenceId: string, takenAt: Date) => void;

  // convenience queries
  getDueDosesForSlot: (elderId: string, dateISO: string, slot: ScheduleSlot) => DoseOccurrence[];
  getDosesForSlot: (elderId: string, dateISO: string, slot: ScheduleSlot) => DoseOccurrence[];
  markDoseTakenOptimistic: (doseOccurrenceId: string, takenAt: Date) => { rollback: () => void };
  markDoseTakenFinalize: (doseOccurrenceId: string) => void;

};

type PocStoreValue = PocState & PocActions;

const PocStoreContext = createContext<PocStoreValue | null>(null);

function makeId(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

function seedInitialState(): PocState {
  const elders: Elder[] = [
    { id: "elder_1", name: "Grandma Lea" },
    { id: "elder_2", name: "Grandpa Moshe" },
  ];

  const selectedElderId = elders[0].id;

  // Seed multiple meds + occurrences for *today* in multiple slots
  const meds: Medication[] = [
    { id: "med_1", elderId: selectedElderId, name: "Amlodipine", instructions: "1 pill after breakfast", active: true },
    { id: "med_2", elderId: selectedElderId, name: "Atorvastatin", instructions: "1 pill in the evening", active: true },
    { id: "med_3", elderId: selectedElderId, name: "Vitamin D", instructions: "With food", active: true },
  ];

  const dateISO = getLocalDateISO(new Date());
  const doses: DoseOccurrence[] = [
    { id: "dose_1", elderId: selectedElderId, medicationId: "med_1", medicationName: "Amlodipine", dateISO, slot: "morning", status: "pending" },
    { id: "dose_2", elderId: selectedElderId, medicationId: "med_2", medicationName: "Atorvastatin", dateISO, slot: "evening", status: "pending" },
    { id: "dose_3", elderId: selectedElderId, medicationId: "med_3", medicationName: "Vitamin D", dateISO, slot: getCurrentSlot(new Date()), status: "pending" },
  ];

  return { elders, selectedElderId, medications: meds, doses };
}

export function PocStoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PocState>(() => seedInitialState());

  const value = useMemo<PocStoreValue>(() => {
    const selectElder = (elderId: string) => {
      setState((s) => ({ ...s, selectedElderId: elderId }));
    };

    const addMedication = (input: { name: string; instructions?: string }) => {
      setState((s) => {
        const elderId = s.selectedElderId;
        const medId = makeId("med");
        const newMed: Medication = {
          id: medId,
          elderId,
          name: input.name.trim(),
          instructions: input.instructions?.trim(),
          active: true,
        };

        // For POC: create a dose occurrence for the *current slot today*
        const dateISO = getLocalDateISO(new Date());
        const slot = getCurrentSlot(new Date());
        const newDose: DoseOccurrence = {
          id: makeId("dose"),
          elderId,
          medicationId: medId,
          medicationName: newMed.name,
          dateISO,
          slot,
          status: "pending",
        };

        return {
          ...s,
          medications: [newMed, ...s.medications],
          doses: [newDose, ...s.doses],
        };
      });
    };

    const markDoseTakenOptimistic = (doseOccurrenceId: string, takenAt: Date) => {
      // Capture previous state for rollback
      const prev = state.doses.find((d) => d.id === doseOccurrenceId);
      if (!prev) {
        return { rollback: () => {} };
      }

      // Apply optimistic update
      setState((s) => ({
        ...s,
        doses: s.doses.map((d) =>
          d.id === doseOccurrenceId
            ? { ...d, status: "taken", takenAtISO: takenAt.toISOString() }
            : d
        ),
      }));

      // Rollback function
      const rollback = () => {
        setState((s) => ({
          ...s,
          doses: s.doses.map((d) =>
            d.id === doseOccurrenceId ? prev : d
          ),
        }));
      };

      return { rollback };
    };

    const markDoseTakenFinalize = (_doseOccurrenceId: string) => {
      // POC: nothing to do.
      // Future: API call + error handling; if API fails, call rollback.
    };


    const getDueDosesForSlot = (elderId: string, dateISO: string, slot: ScheduleSlot) => {
      return state.doses.filter(
        (d) =>
          d.elderId === elderId &&
          d.dateISO === dateISO &&
          d.slot === slot &&
          d.status === "pending"
      );
    };

    const getDosesForSlot = (elderId: string, dateISO: string, slot: ScheduleSlot) => {
      return state.doses
        .filter((d) => d.elderId === elderId && d.dateISO === dateISO && d.slot === slot)
        .sort((a, b) => {
          // pending first, then taken
          if (a.status === b.status) return 0;
          return a.status === "pending" ? -1 : 1;
        });
    };


    return {
      ...state,
      selectElder,
      addMedication,
      getDueDosesForSlot,
      getDosesForSlot,
      markDoseTakenOptimistic,
      markDoseTakenFinalize,
    };


  }, [state]);

  return <PocStoreContext.Provider value={value}>{children}</PocStoreContext.Provider>;
}

export function usePocStore() {
  const ctx = useContext(PocStoreContext);
  if (!ctx) throw new Error("usePocStore must be used within PocStoreProvider");
  return ctx;
}
