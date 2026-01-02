import React from "react";
import { View, Text, Pressable, Linking, Alert } from "react-native";

export default function ElderEmergencyScreen() {
  const primaryPhone = "+972500000000"; // POC placeholder; later from backend/emergency plan

  const onCall = async () => {
    const url = `tel:${primaryPhone}`;

    // Confirm to reduce accidental taps
    Alert.alert(
      "Call emergency contact?",
      `This will call: ${primaryPhone}`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Call",
          style: "destructive",
          onPress: async () => {
            const can = await Linking.canOpenURL(url);
            if (!can) {
              Alert.alert("Cannot place call", "This device cannot open the dialer.");
              return;
            }
            Linking.openURL(url);
          },
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1, padding: 24, gap: 12 }}>
      <Text style={{ fontSize: 28, fontWeight: "800" }}>Emergency</Text>
      <Text style={{ fontSize: 16 }}>
        POC: one-tap (with confirmation) to call primary contact.
      </Text>

      <Pressable
        onPress={onCall}
        accessibilityRole="button"
        accessibilityLabel="Call emergency contact"
        accessibilityHint="Opens the phone dialer"
        style={({ pressed }) => ({
          marginTop: 18,
          minHeight: 84,
          borderRadius: 18,
          borderWidth: 1,
          paddingHorizontal: 18,
          paddingVertical: 18,
          justifyContent: "center",
          opacity: pressed ? 0.7 : 1,
        })}
      >
        <Text style={{ fontSize: 22, fontWeight: "900" }}>Call Primary Contact</Text>
        <Text style={{ fontSize: 14, opacity: 0.75, marginTop: 6 }}>
          {primaryPhone}
        </Text>
      </Pressable>
    </View>
  );
}
