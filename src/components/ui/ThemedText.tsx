import React, { ReactNode } from "react";
import { Text, TextStyle, StyleProp } from "react-native";
import { useTheme, useFontTokens } from "@/hooks/useTheme";
import { FontSize, FontWeight } from "@/theme/typography";
import { useSettingsStore } from "@/stores/settingsStore";

export type TextVariant = "title" | "card" | "body" | "metadata" | "section-label";

const variantStyles: Record<TextVariant, TextStyle> = {
  title: { fontSize: FontSize.title, fontWeight: FontWeight.bold },
  card: { fontSize: FontSize.card, fontWeight: FontWeight.bold },
  body: { fontSize: FontSize.body, fontWeight: FontWeight.regular },
  metadata: { fontSize: FontSize.metadata, fontWeight: FontWeight.regular },
  "section-label": {
    fontSize: FontSize.sectionLabel,
    fontWeight: FontWeight.bold,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
};

const HEADING_VARIANTS: TextVariant[] = ["title", "card", "section-label"];

interface ThemedTextProps {
  variant?: TextVariant;
  children: ReactNode;
  style?: StyleProp<TextStyle>;
}

export function ThemedText({ variant = "body", children, style }: ThemedTextProps) {
  const tokens = useTheme();
  const fonts = useFontTokens();
  const fontScale = useSettingsStore((s) => s.fontScale);
  const base = variantStyles[variant];

  const isHeading = HEADING_VARIANTS.includes(variant);
  const resolvedFont = isHeading ? fonts.heading : fonts.body;

  const scaledSize = base.fontSize != null ? base.fontSize * fontScale : undefined;

  return (
    <Text
      style={[
        { color: tokens.textPrimary },
        base,
        scaledSize != null ? { fontSize: scaledSize } : undefined,
        { fontFamily: resolvedFont },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
