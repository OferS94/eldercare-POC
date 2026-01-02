import React, { useMemo } from "react";
import { View, Text, Pressable } from "react-native";
import { usePocStore } from "../../../app/PocStore";
import { getCurrentSlot, getLocalDateISO, slotLabel } from "../../../shared/utils/slots";

export default function ElderTodayScreen() {
  const { selectedElderId, elders, getDueDosesForSlot, markDoseTaken } = usePocStore();

  const elderName = useMemo(() => elders.find((e) => e.id === selectedElderId)?.name ?? "Elder", [elders, selectedElderId]);

  const dateISO = getLocalDateISO(new Date());
  const slot = getCurrentSlot(new Date());

  const due = getDueDosesForSlot(selectedElderId, dateISO, slot);

  return (
    <View style={{ flex: 1, padding: 24, gap: 12 }}>
      <Text style={{ fontSize: 28, fontWeight: "700" }}>Today</Text>
      <Text style={{ fontSize: 16 }}>
        {elderName} • Slot: {slotLabel(slot)} • {dateISO}
      </Text>

      {due.length === 0 ? (
        <Text style={{ fontSize: 16, marginTop: 12 }}>
          No medications due in this slot.
        </Text>
      ) : (
        <View style={{ gap: 12, marginTop: 12 }}>
          {due.map((d) => (
            <View
              key={d.id}
              style={{
                padding: 16,
                borderRadius: 12,
                borderWidth: 1,
                gap: 10,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "700" }}>{d.medicationName}</Text>
              <Pressable
                onPress={() => markDoseTaken(d.id, new Date())}
                style={{
                  padding: 12,
                  borderRadius: 12,
                  borderWidth: 1,
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: "700" }}>Mark as taken</Text>
              </Pressable>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
