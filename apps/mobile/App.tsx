import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { enableScreens } from "react-native-screens";
import ElderStack from "./src/navigation/ElderStack";
import CaregiverStack from "./src/navigation/CaregiverStack";
import { ModeProvider, useMode } from "./src/app/ModeContext";
import { PocStoreProvider } from "./src/app/PocStore";

enableScreens();

function RootNavigator() {
  const { mode } = useMode();
  return mode === "elder" ? <ElderStack /> : <CaregiverStack />;
}

export default function App() {
  return (
    <ModeProvider>
      <PocStoreProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </PocStoreProvider>
    </ModeProvider>
  );
}
