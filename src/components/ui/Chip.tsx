import React from "react";
import { TouchableOpacity, Text, ViewStyle } from "react-native";
import { useTheme, useFontTokens } from "@/hooks/useTheme";
import { FontSize } from "@/theme/typography";

interface ChipProps {
  label: string;
  active?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

export function Chip({ label, active = false, onPress, style }: ChipProps) {
  const tokens = useTheme();
  const fonts = useFontTokens();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          paddingHorizontal: 12,
          paddingVertical: 5,
          borderRadius: 999,
          borderWidth: 1.5,
          borderColor: active ? tokens.textPrimary : tokens.border,
          backgroundColor: active ? tokens.textPrimary : "transparent",
        },
        style,
      ]}
    >
      <Text
        style={{
          fontSize: FontSize.body,
          fontFamily: fonts.label,
          color: active ? tokens.textInverse : tokens.textBody,
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
