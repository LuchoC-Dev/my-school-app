export type ColorTokens = {
  background: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  borderLight: string;
  textPrimary: string;
  textSecondary: string;
  textBody: string;
  textInverse: string;
  destructive: string;
  warning: string;
  warningLight: string;
  accent: string;
  accentLight: string;
};

export const lightTheme: ColorTokens = {
  background: "#F5F0E8",
  surface: "#FFFFFF",
  surfaceAlt: "#EDE8DF",
  border: "#C8BFB0",
  borderLight: "#E0D9CE",
  textPrimary: "#2A2016",
  textSecondary: "#7A6F62",
  textBody: "#4A4035",
  textInverse: "#FFFFFF",
  destructive: "#D94040",
  warning: "#B45309",
  warningLight: "#FEF3C7",
  accent: "#D97B3A",
  accentLight: "#F5E0CC",
};

export const darkTheme: ColorTokens = {
  background: "#1A1510",
  surface: "#2A2016",
  surfaceAlt: "#332A1E",
  border: "#4A3F32",
  borderLight: "#3D3228",
  textPrimary: "#F5F0E8",
  textSecondary: "#A89880",
  textBody: "#C8BBAA",
  textInverse: "#2A2016",
  destructive: "#F07070",
  warning: "#FBBF24",
  warningLight: "#3D2E00",
  accent: "#F0975A",
  accentLight: "#3D2A1A",
};

export type CourseColorKey = "orange" | "blue" | "violet" | "green";

export const courseColors: Record<
  CourseColorKey,
  { accent: string; accentLight: string }
> = {
  orange: { accent: "#D97B3A", accentLight: "#F5E0CC" },
  blue: { accent: "#3A7BD9", accentLight: "#CCE0F5" },
  violet: { accent: "#7B3AD9", accentLight: "#E0CCF5" },
  green: { accent: "#3AD97B", accentLight: "#CCF5E0" },
};
