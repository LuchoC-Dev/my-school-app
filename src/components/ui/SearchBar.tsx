import React from "react";
import { View, TextInput, TouchableOpacity, Text } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { FontFamily, FontSize } from "@/theme/typography";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onGlobalSearch?: () => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChangeText,
  onGlobalSearch,
  placeholder = "Buscar...",
}: SearchBarProps) {
  const tokens = useTheme();
  return (
    <View className="flex-row items-center gap-2 px-3.5">
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={tokens.textSecondary}
        style={{
          flex: 1,
          height: 36,
          paddingHorizontal: 12,
          borderRadius: 999,
          borderWidth: 1.5,
          borderColor: tokens.border,
          backgroundColor: tokens.surface,
          color: tokens.textPrimary,
          fontFamily: FontFamily.caveatRegular,
          fontSize: FontSize.body,
        }}
      />
      {onGlobalSearch && (
        <TouchableOpacity onPress={onGlobalSearch}>
          <Text
            style={{
              color: tokens.accent,
              fontFamily: FontFamily.caveatRegular,
              fontSize: FontSize.body,
            }}
          >
            Buscar en todo →
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
