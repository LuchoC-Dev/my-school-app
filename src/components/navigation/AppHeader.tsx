import React from "react";
import { View, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";
import { ThemedText } from "@/components/ui";

interface AppHeaderProps {
  title: string;
  rightAction?: {
    label: string;
    onPress: () => void;
  };
}

export function AppHeader({ title, rightAction }: AppHeaderProps) {
  const tokens = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingTop: insets.top + 8,
        paddingBottom: 8,
        paddingHorizontal: 16,
        backgroundColor: tokens.background,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <ThemedText variant="title">{title}</ThemedText>
      {rightAction && (
        <TouchableOpacity onPress={rightAction.onPress}>
          <ThemedText variant="body" style={{ color: tokens.accent }}>
            {rightAction.label}
          </ThemedText>
        </TouchableOpacity>
      )}
    </View>
  );
}
