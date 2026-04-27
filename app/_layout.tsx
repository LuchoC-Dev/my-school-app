import "../global.css";

import {
  Caveat_400Regular,
  Caveat_700Bold,
  useFonts,
} from "@expo-google-fonts/caveat";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  const [loaded] = useFonts({
    Caveat_400Regular,
    Caveat_700Bold,
  });

  if (!loaded) return null;

  return (
    <>
      <StatusBar style="auto" />
      <Slot />
    </>
  );
}
