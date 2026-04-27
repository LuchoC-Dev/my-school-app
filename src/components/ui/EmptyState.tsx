import React, { ReactNode } from "react";
import { View } from "react-native";
import { ThemedText } from "./ThemedText";
import { Button } from "./Button";
import { useTheme } from "@/hooks/useTheme";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  ctaLabel: string;
  onCta: () => void;
  ctaVariant?: "primary" | "secondary";
}

export function EmptyState({
  icon,
  title,
  description,
  ctaLabel,
  onCta,
  ctaVariant = "primary",
}: EmptyStateProps) {
  const tokens = useTheme();
  return (
    <View className="flex-1 items-center justify-center px-8 gap-4">
      <View className="items-center mb-2">{icon}</View>
      <ThemedText variant="card" style={{ textAlign: "center" }}>
        {title}
      </ThemedText>
      <ThemedText
        variant="body"
        style={{ textAlign: "center", color: tokens.textSecondary }}
      >
        {description}
      </ThemedText>
      <Button label={ctaLabel} variant={ctaVariant} onPress={onCta} />
    </View>
  );
}
