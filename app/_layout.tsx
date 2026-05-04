import "../global.css";

import {
  Caveat_400Regular,
  Caveat_700Bold,
  useFonts,
} from "@expo-google-fonts/caveat";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { ThemeProvider } from "@/theme/ThemeContext";
import { useTheme } from "@/hooks/useTheme";

function RootNavigator() {
  const tokens = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: tokens.background }}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "transparent" },
        }}
      />
    </View>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    Caveat_400Regular,
    Caveat_700Bold,
  });

  if (!loaded) return null;

  return (
    <ThemeProvider>
      <StatusBar style="auto" />
      <RootNavigator />
    </ThemeProvider>
  );
}
