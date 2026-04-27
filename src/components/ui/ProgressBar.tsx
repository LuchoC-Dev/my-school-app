import React from "react";
import { View, ViewStyle } from "react-native";
import { useTheme } from "@/hooks/useTheme";

interface ProgressBarProps {
  progress: number; // 0–1
  style?: ViewStyle;
  accentColor?: string;
}

export function ProgressBar({ progress, style, accentColor }: ProgressBarProps) {
  const tokens = useTheme();
  const clampedProgress = Math.min(1, Math.max(0, progress));

  return (
    <View
      style={[
        {
          height: 3,
          backgroundColor: tokens.borderLight,
          borderRadius: 999,
          overflow: "hidden",
        },
        style,
      ]}
    >
      <View
        style={{
          height: "100%",
          width: `${clampedProgress * 100}%`,
          backgroundColor: accentColor ?? tokens.accent,
          borderRadius: 999,
        }}
      />
    </View>
  );
}
