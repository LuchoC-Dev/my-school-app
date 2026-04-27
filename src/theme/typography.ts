export const FontFamily = {
  caveatRegular: "Caveat_400Regular",
  caveatBold: "Caveat_700Bold",
  georgia: "Georgia",
  system: undefined, // uses device default
} as const;

export const FontSize = {
  title: 19,
  card: 15,
  body: 13,
  metadata: 11,
  sectionLabel: 10,
} as const;

export const FontWeight = {
  regular: "400",
  semibold: "600",
  bold: "700",
} as const;

export type FontFamilyKey = keyof typeof FontFamily;
export type FontSizeKey = keyof typeof FontSize;
export type FontWeightKey = keyof typeof FontWeight;
