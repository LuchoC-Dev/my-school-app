import React from "react";
import { TextStyle } from "react-native";
import { ThemedText } from "./ThemedText";
import { useTheme } from "@/hooks/useTheme";

interface SectionLabelProps {
  children: string;
  style?: TextStyle;
}

export function SectionLabel({ children, style }: SectionLabelProps) {
  const tokens = useTheme();
  return (
    <ThemedText
      variant="section-label"
      style={[{ color: tokens.textSecondary }, style]}
    >
      {children}
    </ThemedText>
  );
}
