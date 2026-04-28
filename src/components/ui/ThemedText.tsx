import React, { ReactNode } from "react";
import { Text, TextStyle, StyleProp } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { FontFamily, FontSize, FontWeight } from "@/theme/typography";
import { useSettingsStore } from "@/stores/settingsStore";

export type TextVariant = "title" | "card" | "body" | "metadata" | "section-label";

const variantStyles: Record<TextVariant, TextStyle> = {
  title: { fontSize: FontSize.title, fontWeight: FontWeight.bold, fontFamily: FontFamily.caveatBold },
  card: { fontSize: FontSize.card, fontWeight: FontWeight.bold, fontFamily: FontFamily.caveatBold },
  body: { fontSize: FontSize.body, fontWeight: FontWeight.regular, fontFamily: FontFamily.caveatRegular },
  metadata: { fontSize: FontSize.metadata, fontWeight: FontWeight.regular, fontFamily: FontFamily.caveatRegular },
  "section-label": {
    fontSize: FontSize.sectionLabel,
    fontWeight: FontWeight.bold,
    fontFamily: FontFamily.caveatBold,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
};

interface ThemedTextProps {
  variant?: TextVariant;
  children: ReactNode;
  style?: StyleProp<TextStyle>;
}

// Maps app font setting to actual font family strings
const fontFamilyMap = {
  caveat: { regular: FontFamily.caveatRegular, bold: FontFamily.caveatBold },
  georgia: { regular: "Georgia", bold: "Georgia" },
  system: { regular: undefined, bold: undefined },
} as const;

export function ThemedText({ variant = "body", children, style }: ThemedTextProps) {
  const tokens = useTheme();
  const fontScale = useSettingsStore((s) => s.fontScale);
  const fontFamily = useSettingsStore((s) => s.fontFamily);
  const base = variantStyles[variant];

  const isBoldVariant = variant === "title" || variant === "card" || variant === "section-label";
  const resolvedFont = isBoldVariant
    ? fontFamilyMap[fontFamily].bold
    : fontFamilyMap[fontFamily].regular;

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
