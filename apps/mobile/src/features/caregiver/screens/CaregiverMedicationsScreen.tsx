import React, { useMemo, useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { usePocStore } from "../../../app/PocStore";

export default function CaregiverMedicationsScreen() {
  const { selectedElderId, elders, medications, doses, addMedication } = usePocStore();
  const [name, setName] = useState("");
  const [instructions, setInstructions] = useState("");

  const elderName = useMemo(
    () => elders.find((e) => e.id === selectedElderId)?.name ?? "Elder",
    [elders, selectedElderId]
  );

  const medsForElder = medications.filter((m) => m.elderId === selectedElderId);

  return (
    <View style={{ flex: 1, padding: 24, gap: 12 }}>
      <Text style={{ fontSize: 28, fontWeight: "700" }}>Medications</Text>
      <Text style={{ fontSize: 16 }}>{elderName}</Text>

      <View style={{ marginTop: 8, gap: 8 }}>
        <Text style={{ fontSize: 14, fontWeight: "600" }}>Add medication (POC)</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Name (e.g., Amlodipine)"
          style={{ borderWidth: 1, borderRadius: 10, padding: 12 }}
        />
        <TextInput
          value={instructions}
          onChangeText={setInstructions}
          placeholder="Instructions (optional)"
          style={{ borderWidth: 1, borderRadius: 10, padding: 12 }}
        />

        <Pressable
          onPress={() => {
            if (!name.trim()) return;
            addMedication({ name, instructions });
            setName("");
            setInstructions("");
          }}
          style={{
            padding: 12,
            borderRadius: 12,
            borderWidth: 1,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "700" }}>Add</Text>
        </Pressable>
      </View>

      <View style={{ marginTop: 16, gap: 10 }}>
        {medsForElder.map((m) => {
          const related = doses.filter((d) => d.medicationId === m.id).slice(0, 1)[0];
          const status = related?.status ?? "—";
          const takenAt = related?.takenAtISO ? new Date(related.takenAtISO).toLocaleString() : "";

          return (
            <View
              key={m.id}
              style={{
                padding: 16,
                borderRadius: 12,
                borderWidth: 1,
                gap: 6,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "700" }}>{m.name}</Text>
              {!!m.instructions && <Text style={{ fontSize: 14 }}>{m.instructions}</Text>}
              <Text style={{ fontSize: 14 }}>Latest dose status: {status}</Text>
              {!!takenAt && <Text style={{ fontSize: 12, opacity: 0.8 }}>Taken at: {takenAt}</Text>}
            </View>
          );
        })}
      </View>
    </View>
  );
}
