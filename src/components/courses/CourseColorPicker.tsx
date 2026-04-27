import React from "react";
import { View, TouchableOpacity } from "react-native";
import { CourseColor } from "@/types/entities";
import { courseColors } from "@/theme/tokens";
import { useTheme } from "@/hooks/useTheme";

interface CourseColorPickerProps {
  value: CourseColor;
  onChange: (color: CourseColor) => void;
}

const COLORS: CourseColor[] = ["orange", "blue", "violet", "green"];

export function CourseColorPicker({ value, onChange }: CourseColorPickerProps) {
  const tokens = useTheme();

  return (
    <View style={{ flexDirection: "row", gap: 12 }}>
      {COLORS.map((color) => {
        const isSelected = value === color;
        return (
          <TouchableOpacity
            key={color}
            onPress={() => onChange(color)}
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: courseColors[color].accent,
              borderWidth: isSelected ? 3 : 0,
              borderColor: tokens.textPrimary,
            }}
          />
        );
      })}
    </View>
  );
}
