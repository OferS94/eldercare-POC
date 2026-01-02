import React, { useMemo, useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { usePocStore } from "../../../app/PocStore";

function SmallButton(props: {
  label: string;
  onPress: () => void;
  destructive?: boolean;
}) {
  const { label, onPress, destructive } = props;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => ({
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <Text
        style={{
          fontSize: 13,
          fontWeight: "900",
          opacity: destructive ? 0.9 : 1,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export default function CaregiverMedicationsScreen() {
  const {
    selectedElderId,
    elders,
    medications,
    doses,
    addMedication,
    updateMedication,
    setMedicationActive,
  } = usePocStore();

  const elderName = useMemo(
    () => elders.find((e) => e.id === selectedElderId)?.name ?? "Elder",
    [elders, selectedElderId]
  );

  // Add form
  const [name, setName] = useState("");
  const [instructions, setInstructions] = useState("");

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editInstructions, setEditInstructions] = useState("");

  const medsForElder = useMemo(() => {
    return medications
      .filter((m) => m.elderId === selectedElderId)
      .sort((a, b) => Number(b.active) - Number(a.active)); // active first
  }, [medications, selectedElderId]);

  const recentTaken = useMemo(() => {
    return doses
      .filter(
        (d) =>
          d.elderId === selectedElderId &&
          d.status === "taken" &&
          !!d.takenAtISO
      )
      .sort((a, b) => (b.takenAtISO! > a.takenAtISO! ? 1 : -1))
      .slice(0, 5);
  }, [doses, selectedElderId]);

  const startEdit = (medId: string) => {
    const med = medsForElder.find((m) => m.id === medId);
    if (!med) return;
    setEditingId(medId);
    setEditName(med.name);
    setEditInstructions(med.instructions ?? "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditInstructions("");
  };

  const saveEdit = () => {
    if (!editingId) return;
    if (!editName.trim()) return;
    updateMedication(editingId, { name: editName, instructions: editInstructions });
    cancelEdit();
  };

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ padding: 24, gap: 12, paddingBottom: 40 }}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={{ fontSize: 28, fontWeight: "900" }}>Medications</Text>
      <Text style={{ fontSize: 16, opacity: 0.8 }}>{elderName}</Text>

      {/* Add medication */}
      <View style={{ marginTop: 8, gap: 8 }}>
        <Text style={{ fontSize: 14, fontWeight: "800", opacity: 0.8 }}>
          Add medication (POC)
        </Text>

        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Name (e.g., Amlodipine)"
          style={{ borderWidth: 1, borderRadius: 12, padding: 12 }}
        />
        <TextInput
          value={instructions}
          onChangeText={setInstructions}
          placeholder="Instructions (optional)"
          style={{ borderWidth: 1, borderRadius: 12, padding: 12 }}
        />

        <Pressable
          onPress={() => {
            if (!name.trim()) return;
            addMedication({ name, instructions });
            setName("");
            setInstructions("");
          }}
          accessibilityRole="button"
          style={({ pressed }) => ({
            minHeight: 56,
            borderRadius: 14,
            borderWidth: 1,
            alignItems: "center",
            justifyContent: "center",
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <Text style={{ fontSize: 16, fontWeight: "900" }}>Add</Text>
        </Pressable>
      </View>

      {/* Recent activity */}
      <View style={{ marginTop: 12, gap: 8 }}>
        <Text style={{ fontSize: 14, fontWeight: "800", opacity: 0.8 }}>
          Recent activity
        </Text>

        {recentTaken.length === 0 ? (
          <Text style={{ fontSize: 13, opacity: 0.7 }}>
            No doses marked as taken yet.
          </Text>
        ) : (
          <View style={{ gap: 8 }}>
            {recentTaken.map((d) => (
              <View
                key={d.id}
                style={{
                  borderWidth: 1,
                  borderRadius: 12,
                  padding: 12,
                  gap: 4,
                }}
              >
                <Text style={{ fontSize: 14, fontWeight: "900" }}>
                  {d.medicationName}
                </Text>
                <Text style={{ fontSize: 12, opacity: 0.75 }}>
                  Taken: {new Date(d.takenAtISO!).toLocaleString()}
                </Text>
                <Text style={{ fontSize: 12, opacity: 0.75 }}>
                  Slot: {d.slot} • Date: {d.dateISO}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Med list */}
      <View style={{ marginTop: 16, gap: 10 }}>
        {medsForElder.map((m) => {
          // Get latest relevant dose for this medication + elder
          const related = doses
            .filter((d) => d.elderId === selectedElderId && d.medicationId === m.id)
            .sort((a, b) => {
              // Prefer takenAtISO for ordering when present; otherwise keep stable
              const aKey = a.takenAtISO ?? "";
              const bKey = b.takenAtISO ?? "";
              return bKey.localeCompare(aKey);
            });

          const lastDose = related[0];
          const lastStatus = lastDose?.status ?? "—";
          const lastTakenAt = lastDose?.takenAtISO
            ? new Date(lastDose.takenAtISO).toLocaleString()
            : null;

          const isEditing = editingId === m.id;

          return (
            <View
              key={m.id}
              style={{
                padding: 16,
                borderRadius: 14,
                borderWidth: 1,
                gap: 8,
                opacity: m.active ? 1 : 0.55,
              }}
            >
              {!isEditing ? (
                <>
                  <View style={{ gap: 4 }}>
                    <Text style={{ fontSize: 18, fontWeight: "900" }}>{m.name}</Text>

                    {!!m.instructions && (
                      <Text style={{ fontSize: 14, opacity: 0.85 }}>{m.instructions}</Text>
                    )}

                    <Text style={{ fontSize: 13, opacity: 0.75 }}>
                      Last status: {String(lastStatus).toUpperCase()}
                    </Text>

                    {lastTakenAt ? (
                      <Text style={{ fontSize: 12, opacity: 0.75 }}>
                        Last taken: {lastTakenAt}
                      </Text>
                    ) : lastDose ? (
                      <Text style={{ fontSize: 12, opacity: 0.75 }}>
                        Slot: {lastDose.slot} • Date: {lastDose.dateISO}
                      </Text>
                    ) : null}

                    <Text style={{ fontSize: 13, fontWeight: "800" }}>
                      {m.active ? "Active" : "Inactive"}
                    </Text>
                  </View>

                  <View style={{ flexDirection: "row", gap: 10, flexWrap: "wrap" }}>
                    <SmallButton label="Edit" onPress={() => startEdit(m.id)} />
                    {m.active ? (
                      <SmallButton
                        label="Deactivate"
                        destructive
                        onPress={() => setMedicationActive(m.id, false)}
                      />
                    ) : (
                      <SmallButton
                        label="Reactivate"
                        onPress={() => setMedicationActive(m.id, true)}
                      />
                    )}
                  </View>
                </>
              ) : (
                <>
                  <Text style={{ fontSize: 14, fontWeight: "800", opacity: 0.8 }}>
                    Edit medication
                  </Text>

                  <TextInput
                    value={editName}
                    onChangeText={setEditName}
                    placeholder="Name"
                    style={{ borderWidth: 1, borderRadius: 12, padding: 12 }}
                  />
                  <TextInput
                    value={editInstructions}
                    onChangeText={setEditInstructions}
                    placeholder="Instructions (optional)"
                    style={{ borderWidth: 1, borderRadius: 12, padding: 12 }}
                  />

                  <View style={{ flexDirection: "row", gap: 10, flexWrap: "wrap" }}>
                    <SmallButton label="Save" onPress={saveEdit} />
                    <SmallButton label="Cancel" onPress={cancelEdit} />
                  </View>
                </>
              )}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}
