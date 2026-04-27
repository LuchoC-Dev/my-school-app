import React from "react";
import { View, ViewStyle } from "react-native";
import { useTheme } from "@/hooks/useTheme";

interface SeparatorProps {
  variant?: "solid" | "dashed";
  style?: ViewStyle;
}

export function Separator({ variant = "solid", style }: SeparatorProps) {
  const tokens = useTheme();
  return (
    <View
      style={[
        {
          height: 1,
          marginHorizontal: 14,
          borderBottomWidth: 1,
          borderStyle: variant === "dashed" ? "dashed" : "solid",
          borderColor: variant === "dashed" ? tokens.border : tokens.borderLight,
        },
        style,
      ]}
    />
  );
}
