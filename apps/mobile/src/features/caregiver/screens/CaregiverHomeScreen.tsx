import React from "react";
import { View, Text, Pressable } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CaregiverStackParamList } from "../../../navigation/CaregiverStack";

type Props = NativeStackScreenProps<CaregiverStackParamList, "CaregiverHome">;

export default function CaregiverHomeScreen({ navigation }: Props) {
  return (
    <View style={{ flex: 1, padding: 24, gap: 16 }}>
      <Text style={{ fontSize: 28, fontWeight: "700" }}>Caregiver Mode</Text>
      <Text style={{ fontSize: 16 }}>
        POC: manage elders + add medications (later).
      </Text>

      <Pressable
        onPress={() => navigation.navigate("CaregiverMedications")}
        style={{
          padding: 16,
          borderRadius: 12,
          borderWidth: 1,
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "600" }}>
          Medications (POC)
        </Text>
      </Pressable>
    </View>
  );
}
