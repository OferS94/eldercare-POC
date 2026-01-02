import React, { createContext, useContext, useMemo, useState } from "react";

export type AppMode = "elder" | "caregiver";

type ModeContextValue = {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  toggleMode: () => void;
};

const ModeContext = createContext<ModeContextValue | null>(null);

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<AppMode>("elder");

  const value = useMemo<ModeContextValue>(
    () => ({
      mode,
      setMode,
      toggleMode: () => setMode((m) => (m === "elder" ? "caregiver" : "elder")),
    }),
    [mode]
  );

  return <ModeContext.Provider value={value}>{children}</ModeContext.Provider>;
}

export function useMode() {
  const ctx = useContext(ModeContext);
  if (!ctx) throw new Error("useMode must be used within ModeProvider");
  return ctx;
}
