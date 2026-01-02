import React from "react";
import { View, Text } from "react-native";

export default function ElderVoiceScreen() {
  return (
    <View style={{ flex: 1, padding: 24, gap: 12 }}>
      <Text style={{ fontSize: 28, fontWeight: "800" }}>Voice</Text>
      <Text style={{ fontSize: 16 }}>
        Placeholder. Next: integrate voice provider (Vapi or internal) and map to
        mark-dose-taken flow.
      </Text>
    </View>
  );
}
