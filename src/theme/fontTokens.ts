import { AppFontFamily } from "@/stores/settingsStore";

export type FontTokens = {
  heading: string | undefined;  // títulos principales
  body: string | undefined;     // texto de contenido
  label: string | undefined;    // etiquetas, botones, navegación
  caption: string | undefined;  // texto secundario pequeño
  mono: string | undefined;     // código, fechas, números
};

const fontThemes: Record<AppFontFamily, FontTokens> = {
  // Manuscrita: toda la jerarquía en Caveat
  caveat: {
    heading: "Caveat_700Bold",
    body: "Caveat_400Regular",
    label: "Caveat_400Regular",
    caption: "Caveat_400Regular",
    mono: undefined,
  },
  // Serif clásica: headings y body en Georgia, UI en sistema
  georgia: {
    heading: "Georgia",
    body: "Georgia",
    label: undefined,
    caption: "Georgia",
    mono: undefined,
  },
  // Todo sistema — máxima legibilidad y compatibilidad
  system: {
    heading: undefined,
    body: undefined,
    label: undefined,
    caption: undefined,
    mono: undefined,
  },
};

export function resolveFontTokens(fontFamily: AppFontFamily): FontTokens {
  return fontThemes[fontFamily] ?? fontThemes.system;
}
