import React, { useMemo } from "react";
import { View, Text, Pressable } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CaregiverStackParamList } from "../../../navigation/CaregiverStack";
import { usePocStore } from "../../../app/PocStore";

type Props = NativeStackScreenProps<CaregiverStackParamList, "CaregiverHome">;

function ElderCard(props: {
  name: string;
  selected: boolean;
  onPress: () => void;
}) {
  const { name, selected, onPress } = props;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Select elder ${name}`}
      style={({ pressed }) => ({
        minHeight: 72,
        borderRadius: 16,
        borderWidth: 1,
        paddingHorizontal: 16,
        paddingVertical: 14,
        justifyContent: "center",
        opacity: pressed ? 0.7 : 1,
        backgroundColor: selected ? "rgba(0,0,0,0.08)" : "transparent",
      })}
    >
      <Text style={{ fontSize: 18, fontWeight: "900" }}>{name}</Text>
      <Text style={{ fontSize: 13, opacity: 0.75, marginTop: 4 }}>
        {selected ? "Selected" : "Tap to select"}
      </Text>
    </Pressable>
  );
}

export default function CaregiverHomeScreen({ navigation }: Props) {
  const { elders, selectedElderId, selectElder } = usePocStore();

  const selectedName = useMemo(
    () => elders.find((e) => e.id === selectedElderId)?.name ?? "None",
    [elders, selectedElderId]
  );

  return (
    <View style={{ flex: 1, padding: 24, gap: 16 }}>
      <View style={{ gap: 6 }}>
        <Text style={{ fontSize: 28, fontWeight: "900" }}>Caregiver</Text>
        <Text style={{ fontSize: 16, opacity: 0.8 }}>
          Selected elder: <Text style={{ fontWeight: "900" }}>{selectedName}</Text>
        </Text>
      </View>

      <View style={{ gap: 12, marginTop: 8 }}>
        <Text style={{ fontSize: 14, fontWeight: "800", opacity: 0.8 }}>
          Elders
        </Text>

        {elders.map((e) => (
          <ElderCard
            key={e.id}
            name={e.name}
            selected={e.id === selectedElderId}
            onPress={() => selectElder(e.id)}
          />
        ))}
      </View>

      <View style={{ marginTop: 10, gap: 12 }}>
        <Pressable
          onPress={() => navigation.navigate("CaregiverMedications")}
          accessibilityRole="button"
          accessibilityLabel="Open medications for selected elder"
          style={({ pressed }) => ({
            minHeight: 72,
            borderRadius: 16,
            borderWidth: 1,
            paddingHorizontal: 16,
            paddingVertical: 14,
            justifyContent: "center",
            alignItems: "center",
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <Text style={{ fontSize: 18, fontWeight: "900" }}>
            Manage Medications
          </Text>
          <Text style={{ fontSize: 13, opacity: 0.75, marginTop: 4 }}>
            For: {selectedName}
          </Text>
        </Pressable>
      </View>

      <Text style={{ fontSize: 12, opacity: 0.65, marginTop: 6 }}>
        POC: elder list is seeded locally. Later: fetched from backend per caregiver.
      </Text>
    </View>
  );
}
