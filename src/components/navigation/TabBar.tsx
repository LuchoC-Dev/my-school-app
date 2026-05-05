import React from "react";
import { View, TouchableOpacity, Platform } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme, useFontTokens } from "@/hooks/useTheme";
import { ThemedText } from "@/components/ui";

const TABS = [
  { name: "index", label: "Materias", icon: "📚" },
  { name: "activities", label: "Actividades", icon: "✅" },
  { name: "calendar", label: "Calendario", icon: "📅" },
  { name: "settings", label: "Settings", icon: "⚙️" },
];

export function TabBar({ state, navigation }: BottomTabBarProps) {
  const tokens = useTheme();
  const fonts = useFontTokens();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: tokens.surface,
        borderTopWidth: 1,
        borderTopColor: tokens.border,
        paddingBottom: insets.bottom + (Platform.OS === "web" ? 0 : 4),
        paddingTop: 8,
      }}
    >
      {TABS.map((tab, index) => {
        const isFocused = state.index === index;
        return (
          <TouchableOpacity
            key={tab.name}
            style={{ flex: 1, alignItems: "center", gap: 2 }}
            onPress={() => navigation.navigate(tab.name)}
            activeOpacity={0.7}
          >
            <ThemedText
              style={{
                fontSize: 22,
                fontFamily: undefined,
              }}
            >
              {tab.icon}
            </ThemedText>
            <ThemedText
              variant="metadata"
              style={{
                color: isFocused ? tokens.accent : tokens.textSecondary,
                fontFamily: fonts.label,
              }}
            >
              {tab.label}
            </ThemedText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
