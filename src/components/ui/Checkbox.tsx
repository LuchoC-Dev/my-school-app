import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { useTheme } from "@/hooks/useTheme";

interface CheckboxProps {
  checked: boolean;
  onToggle: () => void;
}

export function Checkbox({ checked, onToggle }: CheckboxProps) {
  const tokens = useTheme();
  return (
    <TouchableOpacity onPress={onToggle}>
      <View
        style={{
          width: 17,
          height: 17,
          borderRadius: 999,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: checked ? tokens.textPrimary : "transparent",
          borderWidth: checked ? 0 : 1.5,
          borderColor: tokens.border,
        }}
      >
        {checked && (
          <Text style={{ color: tokens.textInverse, fontSize: 10, lineHeight: 12 }}>
            ✓
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}
