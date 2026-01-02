import React, { useMemo } from "react";
import { View, Text, Pressable, AccessibilityInfo, Platform } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ElderStackParamList } from "../../../navigation/ElderStack";
import { usePocStore } from "../../../app/PocStore";

type Props = NativeStackScreenProps<ElderStackParamList, "ElderHome">;

function BigActionButton(props: {
  label: string;
  hint: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  const { label, hint, onPress, disabled } = props;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={hint}
      style={({ pressed }) => ({
        minHeight: 72, // large tap target
        borderRadius: 16,
        borderWidth: 1,
        paddingHorizontal: 18,
        paddingVertical: 16,
        justifyContent: "center",
        opacity: disabled ? 0.45 : pressed ? 0.7 : 1,
      })}
    >
      <Text style={{ fontSize: 20, fontWeight: "800" }}>{label}</Text>
    </Pressable>
  );
}

export default function ElderHomeScreen({ navigation }: Props) {
  const { selectedElderId, elders } = usePocStore();

  const elderName = useMemo(
    () => elders.find((e) => e.id === selectedElderId)?.name ?? "Elder",
    [elders, selectedElderId]
  );

  React.useEffect(() => {
    // Optional: announce screen change for screen readers on Android
    if (Platform.OS === "android") {
      AccessibilityInfo.announceForAccessibility?.("Elder home screen");
    }
  }, []);

  return (
    <View style={{ flex: 1, padding: 24, gap: 18 }}>
      <View style={{ gap: 6 }}>
        <Text style={{ fontSize: 30, fontWeight: "900" }}>Home</Text>
        <Text style={{ fontSize: 18, opacity: 0.8 }}>{elderName}</Text>
      </View>

      <View style={{ gap: 14, marginTop: 8 }}>
        <BigActionButton
          label="Today"
          hint="View medications due in the current time slot"
          onPress={() => navigation.navigate("ElderToday")}
        />

        <BigActionButton
          label="Voice"
          hint="Open voice assistant to mark medication taken"
          onPress={() => navigation.navigate("ElderVoice")}
        />

        <BigActionButton
          label="Emergency"
          hint="Open emergency actions and call primary contact"
          onPress={() => navigation.navigate("ElderEmergency")}
        />
      </View>

      <View style={{ marginTop: 18, gap: 8 }}>
        <Text style={{ fontSize: 14, opacity: 0.75 }}>
          POC note: Voice and Emergency are placeholder screens for now.
        </Text>
      </View>
    </View>
  );
}
