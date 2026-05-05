import React from "react";
import { View, TextInput, TouchableOpacity, Text } from "react-native";
import { useTheme, useFontTokens } from "@/hooks/useTheme";
import { FontSize } from "@/theme/typography";

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
  const fonts = useFontTokens();
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 14 }}>
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
          fontFamily: fonts.body,
          fontSize: FontSize.body,
        }}
      />
      {onGlobalSearch && (
        <TouchableOpacity onPress={onGlobalSearch}>
          <Text
            style={{
              color: tokens.accent,
              fontFamily: fonts.body,
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
