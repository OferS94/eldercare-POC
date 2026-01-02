import React from "react";
import { Pressable, Text } from "react-native";
import { useMode } from "../app/ModeContext";

export default function ModeSwitchHeaderButton() {
  const { mode, toggleMode } = useMode();

  return (
    <Pressable
      onPress={toggleMode}
      style={{
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 10,
        borderWidth: 1,
      }}
    >
      <Text style={{ fontSize: 12, fontWeight: "600" }}>
        Switch to {mode === "elder" ? "Caregiver" : "Elder"}
      </Text>
    </Pressable>
  );
}
