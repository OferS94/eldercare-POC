import React, { useMemo, useState,useEffect } from "react";
import { View, Text, Pressable, Alert } from "react-native";
import { usePocStore } from "../../../app/PocStore";
import {
  getCurrentSlot,
  getLocalDateISO,
  slotLabel,
} from "../../../shared/utils/slots";
import { ScheduleSlot } from "../../../shared/types/domain";


const ALL_SLOTS: ScheduleSlot[] = ["morning", "noon", "evening", "night"];

function SlotChip(props: {
  slot: ScheduleSlot;
  selected: boolean;
  onPress: () => void;
}) {
  const { slot, selected, onPress } = props;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Select ${slotLabel(slot)} slot`}
      style={({ pressed }) => ({
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 999,
        borderWidth: 1,
        opacity: pressed ? 0.7 : 1,
        backgroundColor: selected ? "rgba(0,0,0,0.08)" : "transparent",
      })}
    >
      <Text style={{ fontSize: 14, fontWeight: selected ? "800" : "600" }}>
        {slotLabel(slot)}
      </Text>
    </Pressable>
  );
}

export default function ElderTodayScreen() {
  const { 
    selectedElderId,
    elders,
    getDosesForSlot,
    markDoseTakenOptimistic,
    markDoseTakenFinalize,
  } = usePocStore();

  const elderName = useMemo(
    () => elders.find((e) => e.id === selectedElderId)?.name ?? "Elder",
    [elders, selectedElderId]
  );

  const dateISO = getLocalDateISO(new Date());
  const defaultSlot = getCurrentSlot(new Date());

  // 🔹 STATE

  const [slot, setSlot] = useState<ScheduleSlot>(defaultSlot);
  const [rollbackByDoseId, setRollbackByDoseId] = useState<Record<string, () => void>>({});
  
  useEffect(() => {
    // reset rollback state when slot changes
    setRollbackByDoseId({});
  }, [slot]);

  // 🔹 DERIVED STATE

  const doses = getDosesForSlot(selectedElderId, dateISO, slot);

  const pendingCount = doses.filter((d) => d.status === "pending").length;
  const takenCount = doses.filter((d) => d.status === "taken").length;

  return (
    <View style={{ flex: 1, padding: 24, gap: 14 }}>
      <View style={{ gap: 6 }}>
        <Text style={{ fontSize: 28, fontWeight: "900" }}>Today</Text>
        <Text style={{ fontSize: 16, opacity: 0.8 }}>
          {elderName} • {dateISO}
        </Text>
        <Text style={{ fontSize: 16, fontWeight: "700" }}>
          Slot: {slotLabel(slot)} • Pending {pendingCount} • Taken {takenCount}
        </Text>
      </View>

      {/* Slot Switcher */}
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
        {ALL_SLOTS.map((s) => (
          <SlotChip
            key={s}
            slot={s}
            selected={s === slot}
            onPress={() => setSlot(s)}
          />
        ))}
      </View>

      {/* Dose List */}
      {doses.length === 0 ? (
        <View style={{ marginTop: 18, gap: 6 }}>
          <Text style={{ fontSize: 18, fontWeight: "800" }}>
            No medications in this slot.
          </Text>
          <Text style={{ fontSize: 14, opacity: 0.75 }}>
            If needed, switch to another slot above.
          </Text>
        </View>
      ) : (
        <View style={{ gap: 12, marginTop: 10 }}>
          {doses.map((d) => {
            const takenAt = d.takenAtISO
              ? new Date(d.takenAtISO).toLocaleString()
              : null;

            return (
              <View
                key={d.id}
                style={{
                  padding: 16,
                  borderRadius: 14,
                  borderWidth: 1,
                  gap: 10,
                  opacity: d.status === "taken" ? 0.75 : 1,
                }}
              >
                <Text style={{ fontSize: 18, fontWeight: "900" }}>
                  {d.medicationName}
                </Text>

                <Text style={{ fontSize: 14 }}>
                  Status:{" "}
                  <Text style={{ fontWeight: "800" }}>
                    {d.status.toUpperCase()}
                  </Text>
                </Text>

                {takenAt && (
                  <Text style={{ fontSize: 12, opacity: 0.8 }}>
                    Taken at: {takenAt}
                  </Text>
                )}

                {d.status === "pending" ? (
                  <Pressable
                    onPress={() => {
                      const takenAt = new Date();
                      const { rollback } = markDoseTakenOptimistic(d.id, takenAt);
            
                      // store rollback so the UI can show an inline Undo
                      setRollbackByDoseId((prev) => ({ ...prev, [d.id]: rollback }));
            
                      // POC finalize is no-op; future: API call
                      try {
                        markDoseTakenFinalize(d.id);
                      } catch {
                        // if finalize fails (future), rollback immediately
                        rollback();
                        setRollbackByDoseId((prev) => {
                          const copy = { ...prev };
                          delete copy[d.id];
                          return copy;
                        });
                        Alert.alert("Error", "Could not update dose. Please try again.");
                      }
                    }}
                    accessibilityRole="button"
                    accessibilityLabel={`Mark ${d.medicationName} as taken`}
                    style={({ pressed }) => ({
                      minHeight: 56,
                      borderRadius: 14,
                      borderWidth: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      opacity: pressed ? 0.7 : 1,
                    })}
                  >
                    <Text style={{ fontSize: 16, fontWeight: "900" }}>
                      Mark as taken
                    </Text>
                  </Pressable>
                ) : (
                  <View style={{ gap: 10 }}>
                    <Text style={{ fontSize: 14, opacity: 0.8 }}>
                      Marked as taken.
                    </Text>
                
                    <Pressable
                      onPress={() => {
                        const rollback = rollbackByDoseId[d.id];
                        if (rollback) {
                          rollback();
                          setRollbackByDoseId((prev) => {
                            const copy = { ...prev };
                            delete copy[d.id];
                            return copy;
                          });
                        } else {
                          // In case rollback isn't available (e.g., app reload). For POC, just do nothing.
                          Alert.alert("Undo unavailable", "This action can no longer be undone.");
                        }
                      }}
                      accessibilityRole="button"
                      accessibilityLabel={`Undo mark taken for ${d.medicationName}`}
                      style={({ pressed }) => ({
                        minHeight: 48,
                        borderRadius: 14,
                        borderWidth: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        opacity: pressed ? 0.7 : 1,
                      })}
                    >
                      <Text style={{ fontSize: 15, fontWeight: "900" }}>Undo</Text>
                    </Pressable>
                  </View>
                )}
                
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}
