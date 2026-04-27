import React, { ReactNode } from "react";
import { Text, TextStyle, StyleProp } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { FontFamily, FontSize, FontWeight } from "@/theme/typography";

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

export function ThemedText({ variant = "body", children, style }: ThemedTextProps) {
  const tokens = useTheme();
  return (
    <Text style={[{ color: tokens.textPrimary }, variantStyles[variant], style]}>
      {children}
    </Text>
  );
}
