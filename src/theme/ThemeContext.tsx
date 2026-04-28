import React, { createContext, useContext, ReactNode } from "react";
import { useColorScheme } from "react-native";
import { ColorTokens, lightTheme, darkTheme } from "./tokens";
import { useThemeStore } from "@/stores/themeStore";
import { useSettingsStore, AccentColor } from "@/stores/settingsStore";

// Precomputed accentLight for each accent option (lightened/pastel version)
const accentLightMap: Record<AccentColor, string> = {
  "#2A2016": "#C8BFA8",
  "#4A7FB5": "#CCE0F5",
  "#7060D0": "#E0CCF5",
  "#D4753A": "#F5E0CC",
  "#5A9E6A": "#CCF5E0",
  "#C94A3A": "#F5CCCC",
  "#C47FB0": "#F5CCE8",
};

const ThemeContext = createContext<ColorTokens | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const mode = useThemeStore((s) => s.mode);
  const systemScheme = useColorScheme();
  const accentColor = useSettingsStore((s) => s.accentColor);

  const base: ColorTokens =
    mode === "system"
      ? systemScheme === "dark"
        ? darkTheme
        : lightTheme
      : mode === "dark"
        ? darkTheme
        : lightTheme;

  const resolved: ColorTokens = {
    ...base,
    accent: accentColor,
    accentLight: accentLightMap[accentColor] ?? base.accentLight,
  };

  return (
    <ThemeContext.Provider value={resolved}>{children}</ThemeContext.Provider>
  );
}

export function useThemeTokens(): ColorTokens {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useThemeTokens must be used within ThemeProvider");
  return ctx;
}
