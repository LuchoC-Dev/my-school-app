export const FontFamily = {
  caveatRegular: "Caveat_400Regular",
  caveatBold: "Caveat_700Bold",
  georgia: "Georgia",
  system: undefined, // uses device default
} as const;

export const FontSize = {
  title: 26,
  card: 20,
  body: 17,
  metadata: 14,
  sectionLabel: 12,
} as const;

export const FontWeight = {
  regular: "400",
  semibold: "600",
  bold: "700",
} as const;

export type FontFamilyKey = keyof typeof FontFamily;
export type FontSizeKey = keyof typeof FontSize;
export type FontWeightKey = keyof typeof FontWeight;
