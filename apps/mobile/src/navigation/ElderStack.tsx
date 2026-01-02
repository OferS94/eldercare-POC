import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ElderHomeScreen from "../features/elder/screens/ElderHomeScreen";
import ElderTodayScreen from "../features/elder/screens/ElderTodayScreen";
import ElderVoiceScreen from "../features/elder/screens/ElderVoiceScreen";
import ElderEmergencyScreen from "../features/elder/screens/ElderEmergencyScreen";
import ModeSwitchHeaderButton from "./ModeSwitchHeaderButton";

export type ElderStackParamList = {
  ElderHome: undefined;
  ElderToday: undefined;
  ElderVoice: undefined;
  ElderEmergency: undefined;
};

const Stack = createNativeStackNavigator<ElderStackParamList>();

export default function ElderStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerRight: () => <ModeSwitchHeaderButton />,
      }}
    >
      <Stack.Screen
        name="ElderHome"
        component={ElderHomeScreen}
        options={{ title: "Home" }}
      />
      <Stack.Screen
        name="ElderToday"
        component={ElderTodayScreen}
        options={{ title: "Today" }}
      />
      <Stack.Screen
        name="ElderVoice"
        component={ElderVoiceScreen}
        options={{ title: "Voice" }}
      />
      <Stack.Screen
        name="ElderEmergency"
        component={ElderEmergencyScreen}
        options={{ title: "Emergency" }}
      />
    </Stack.Navigator>
  );
}
