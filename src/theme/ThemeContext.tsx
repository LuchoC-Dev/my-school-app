import React, { createContext, useContext, ReactNode } from "react";
import { useColorScheme } from "react-native";
import { ColorTokens, lightTheme, darkTheme } from "./tokens";
import { useThemeStore } from "@/stores/themeStore";

const ThemeContext = createContext<ColorTokens | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const mode = useThemeStore((s) => s.mode);
  const systemScheme = useColorScheme();

  const resolved: ColorTokens =
    mode === "system"
      ? systemScheme === "dark"
        ? darkTheme
        : lightTheme
      : mode === "dark"
        ? darkTheme
        : lightTheme;

  return (
    <ThemeContext.Provider value={resolved}>{children}</ThemeContext.Provider>
  );
}

export function useThemeTokens(): ColorTokens {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useThemeTokens must be used within ThemeProvider");
  return ctx;
}
