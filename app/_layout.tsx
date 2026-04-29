import "../global.css";

import {
  Caveat_400Regular,
  Caveat_700Bold,
  useFonts,
} from "@expo-google-fonts/caveat";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider } from "@/theme/ThemeContext";

export default function RootLayout() {
  const [loaded] = useFonts({
    Caveat_400Regular,
    Caveat_700Bold,
  });

  if (!loaded) return null;

  return (
    <ThemeProvider>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }} />
    </ThemeProvider>
  );
}
