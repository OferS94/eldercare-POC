import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CaregiverHomeScreen from "../features/caregiver/screens/CaregiverHomeScreen";
import CaregiverMedicationsScreen from "../features/caregiver/screens/CaregiverMedicationsScreen";
import ModeSwitchHeaderButton from "./ModeSwitchHeaderButton";

export type CaregiverStackParamList = {
  CaregiverHome: undefined;
  CaregiverMedications: undefined;
};

const Stack = createNativeStackNavigator<CaregiverStackParamList>();

export default function CaregiverStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerRight: () => <ModeSwitchHeaderButton />,
      }}
    >
      <Stack.Screen name="CaregiverHome" component={CaregiverHomeScreen} options={{ title: "Caregiver" }} />
      <Stack.Screen
        name="CaregiverMedications"
        component={CaregiverMedicationsScreen}
        options={{ title: "Medications" }}
      />
    </Stack.Navigator>
  );
}
