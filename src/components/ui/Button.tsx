import React from "react";
import { TouchableOpacity, Text, ViewStyle } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { FontFamily, FontSize } from "@/theme/typography";

interface ButtonProps {
  label: string;
  variant?: "primary" | "secondary";
  onPress?: () => void;
  style?: ViewStyle;
  disabled?: boolean;
}

export function Button({ label, variant = "primary", onPress, style, disabled }: ButtonProps) {
  const tokens = useTheme();

  const isPrimary = variant === "primary";

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        {
          paddingVertical: 12,
          paddingHorizontal: 16,
          alignItems: "center",
          justifyContent: "center",
          opacity: disabled ? 0.5 : 1,
          ...(isPrimary
            ? {
                backgroundColor: tokens.textPrimary,
                borderRadius: 10,
                width: "100%",
              }
            : {
                backgroundColor: "transparent",
                borderRadius: 999,
                borderWidth: 1.5,
                borderStyle: "dashed",
                borderColor: tokens.border,
              }),
        },
        style,
      ]}
    >
      <Text
        style={{
          fontSize: FontSize.body,
          fontFamily: FontFamily.caveatBold,
          color: isPrimary ? tokens.textInverse : tokens.textSecondary,
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
