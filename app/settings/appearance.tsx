import { View, ScrollView, TouchableOpacity, Text } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";
import { useSmartBack } from "@/hooks/useSmartBack";
import { ThemedText, Separator } from "@/components/ui";
import { useThemeStore, ThemeMode } from "@/stores/themeStore";
import { useSettingsStore, AccentColor, AppFontFamily } from "@/stores/settingsStore";
import { lightTheme, darkTheme } from "@/theme/tokens";
import { resolveFontTokens } from "@/theme/fontTokens";

const THEME_OPTIONS: { value: ThemeMode; label: string; preview: string }[] = [
  { value: "light", label: "Claro", preview: "#F5F0E8" },
  { value: "dark", label: "Oscuro", preview: "#1C1710" },
  { value: "system", label: "Sistema", preview: "system" },
];

const ACCENT_OPTIONS: AccentColor[] = [
  "#2A2016",
  "#4A7FB5",
  "#7060D0",
  "#D4753A",
  "#5A9E6A",
  "#C94A3A",
  "#C47FB0",
];

const FONT_OPTIONS: { value: AppFontFamily; label: string; sub: string }[] = [
  { value: "caveat", label: "Caveat", sub: "Manuscrita · títulos expresivos" },
  { value: "georgia", label: "Georgia", sub: "Serif · elegante y clásica" },
  { value: "system", label: "Sistema", sub: "Sans-serif · máxima legibilidad" },
];

export default function AppearanceScreen() {
  const tokens = useTheme();
  const router = useRouter();
  const goBack = useSmartBack("/(tabs)/settings");
  const insets = useSafeAreaInsets();
  const { mode, setMode } = useThemeStore();
  const { accentColor, setAccentColor, fontScale, setFontScale, fontFamily, setFontFamily } = useSettingsStore();

  return (
    <View style={{ flex: 1, backgroundColor: tokens.background }}>
      {/* Header */}
      <View style={{
        paddingTop: insets.top + 8,
        paddingBottom: 10,
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        borderBottomWidth: 1,
        borderBottomColor: tokens.borderLight,
      }}>
        <TouchableOpacity onPress={() => goBack()}>
          <ThemedText variant="body" style={{ color: tokens.accent }}>‹</ThemedText>
        </TouchableOpacity>
        <ThemedText variant="card" style={{ flex: 1 }}>🎨 Apariencia</ThemedText>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        {/* TEMA */}
        <ThemedText
          variant="metadata"
          style={{ color: tokens.textSecondary, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}
        >
          Tema
        </ThemedText>
        <View style={{ flexDirection: "row", gap: 6, paddingHorizontal: 14, paddingBottom: 10 }}>
          {THEME_OPTIONS.map((opt) => {
            const active = mode === opt.value;
            return (
              <TouchableOpacity
                key={opt.value}
                onPress={() => setMode(opt.value)}
                style={{
                  flex: 1,
                  borderWidth: active ? 2 : 1.5,
                  borderColor: active ? tokens.textPrimary : tokens.borderLight,
                  borderRadius: 8,
                  padding: 6,
                  alignItems: "center",
                  gap: 4,
                }}
              >
                {opt.preview === "system" ? (
                  <View style={{
                    width: "100%",
                    height: 34,
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: tokens.borderLight,
                    overflow: "hidden",
                    flexDirection: "row",
                  }}>
                    <View style={{ flex: 1, backgroundColor: lightTheme.background }} />
                    <View style={{ flex: 1, backgroundColor: darkTheme.background }} />
                  </View>
                ) : (
                  <View style={{
                    width: "100%",
                    height: 34,
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: tokens.borderLight,
                    backgroundColor: opt.preview,
                  }} />
                )}
                <ThemedText
                  variant="metadata"
                  style={{ color: active ? tokens.textPrimary : tokens.textSecondary, fontWeight: active ? "700" : "400" }}
                >
                  {opt.label}
                </ThemedText>
              </TouchableOpacity>
            );
          })}
        </View>

        <Separator />

        {/* COLOR DE ACENTO */}
        <ThemedText
          variant="metadata"
          style={{ color: tokens.textSecondary, paddingHorizontal: 16, paddingTop: 10, paddingBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}
        >
          Color de acento
        </ThemedText>
        <View style={{ flexDirection: "row", gap: 12, paddingHorizontal: 16, paddingBottom: 12, alignItems: "center" }}>
          {ACCENT_OPTIONS.map((color) => {
            const active = accentColor === color;
            return (
              <TouchableOpacity
                key={color}
                onPress={() => setAccentColor(color)}
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 11,
                  backgroundColor: color,
                  borderWidth: 1.5,
                  borderColor: "rgba(0,0,0,0.1)",
                  ...(active ? {
                    shadowColor: tokens.textPrimary,
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 1,
                    shadowRadius: 0,
                    elevation: 0,
                    outlineWidth: 2,
                    outlineColor: tokens.textPrimary,
                    outlineOffset: 2,
                  } as any : {}),
                }}
              >
                {active && (
                  <View style={{
                    position: "absolute",
                    inset: -4,
                    borderRadius: 15,
                    borderWidth: 2,
                    borderColor: tokens.textPrimary,
                  }} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <Separator />

        {/* TIPOGRAFÍA */}
        <ThemedText
          variant="metadata"
          style={{ color: tokens.textSecondary, paddingHorizontal: 16, paddingTop: 10, paddingBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}
        >
          Tipografía
        </ThemedText>
        <View style={{ gap: 6, paddingHorizontal: 14, paddingBottom: 10 }}>
          {FONT_OPTIONS.map((opt) => {
            const active = fontFamily === opt.value;
            return (
              <TouchableOpacity
                key={opt.value}
                onPress={() => setFontFamily(opt.value)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  borderRadius: 8,
                  borderWidth: active ? 2 : 1.5,
                  borderColor: active ? tokens.textPrimary : tokens.borderLight,
                  padding: 10,
                  backgroundColor: active ? tokens.surfaceAlt : "transparent",
                  gap: 8,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontSize: 15,
                    fontWeight: "700",
                    color: tokens.textPrimary,
                    fontFamily: resolveFontTokens(opt.value).heading,
                  }}>
                    {opt.label}
                  </Text>
                  <ThemedText variant="metadata" style={{ color: tokens.textSecondary }}>{opt.sub}</ThemedText>
                </View>
                {active && <ThemedText variant="metadata">✓</ThemedText>}
              </TouchableOpacity>
            );
          })}
        </View>

        <Separator />

        {/* TAMAÑO DE TEXTO */}
        <ThemedText
          variant="metadata"
          style={{ color: tokens.textSecondary, paddingHorizontal: 16, paddingTop: 10, paddingBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}
        >
          Tamaño de texto
        </ThemedText>
        <View style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingVertical: 10,
          gap: 8,
        }}>
          <ThemedText variant="metadata" style={{ color: tokens.textSecondary }}>A pequeño</ThemedText>
          <View style={{ flex: 1, position: "relative", height: 14, justifyContent: "center", marginHorizontal: 8 }}>
            <View style={{ height: 3, backgroundColor: tokens.borderLight, borderRadius: 999 }} />
            <View style={{
              position: "absolute",
              left: 0,
              top: "50%",
              height: 3,
              width: `${((fontScale - 0.85) / (1.2 - 0.85)) * 100}%`,
              backgroundColor: tokens.textPrimary,
              borderRadius: 999,
              transform: [{ translateY: -1.5 }],
            }} />
            {/* Decrease / Increase buttons instead of gesture slider */}
            <View style={{
              position: "absolute",
              left: `${((fontScale - 0.85) / (1.2 - 0.85)) * 100}%` ,
              top: "50%",
              transform: [{ translateX: -7 }, { translateY: -7 }],
              width: 14,
              height: 14,
              borderRadius: 7,
              backgroundColor: tokens.textPrimary,
              borderWidth: 2,
              borderColor: tokens.background,
            }} />
          </View>
          <ThemedText style={{ fontSize: 18, fontWeight: "700", color: tokens.textSecondary }}>A grande</ThemedText>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "center", gap: 16, paddingBottom: 10 }}>
          <TouchableOpacity
            onPress={() => setFontScale(Math.max(0.85, Math.round((fontScale - 0.05) * 100) / 100))}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 5,
              borderRadius: 8,
              borderWidth: 1.5,
              borderColor: tokens.borderLight,
            }}
          >
            <ThemedText variant="metadata">− Reducir</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setFontScale(Math.min(1.2, Math.round((fontScale + 0.05) * 100) / 100))}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 5,
              borderRadius: 8,
              borderWidth: 1.5,
              borderColor: tokens.borderLight,
            }}
          >
            <ThemedText variant="metadata">+ Aumentar</ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
