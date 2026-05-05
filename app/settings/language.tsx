import { View, ScrollView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/hooks/useTheme";
import { useSmartBack } from "@/hooks/useSmartBack";
import { ThemedText } from "@/components/ui";
import { useSettingsStore, AppLanguage } from "@/stores/settingsStore";

const LANGUAGE_OPTIONS: { value: AppLanguage; label: string; flag: string }[] = [
  { value: "es", label: "Español", flag: "🇦🇷" },
  { value: "en", label: "English", flag: "🇺🇸" },
];

export default function LanguageScreen() {
  const { t } = useTranslation();
  const tokens = useTheme();
  const goBack = useSmartBack("/(tabs)/settings");
  const insets = useSafeAreaInsets();
  const { language, setLanguage } = useSettingsStore();

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
        <ThemedText variant="card" style={{ flex: 1 }}>🌐 {t("language.title")}</ThemedText>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        <View style={{ gap: 6, padding: 14 }}>
          {LANGUAGE_OPTIONS.map((opt) => {
            const active = language === opt.value;
            return (
              <TouchableOpacity
                key={opt.value}
                onPress={() => setLanguage(opt.value)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  borderRadius: 8,
                  borderWidth: active ? 2 : 1.5,
                  borderColor: active ? tokens.textPrimary : tokens.borderLight,
                  padding: 14,
                  backgroundColor: active ? tokens.surfaceAlt : "transparent",
                  gap: 12,
                }}
              >
                <ThemedText style={{ fontSize: 24 }}>{opt.flag}</ThemedText>
                <ThemedText variant="body" style={{ flex: 1, fontWeight: active ? "700" : "400" }}>
                  {opt.label}
                </ThemedText>
                {active && <ThemedText variant="metadata">✓</ThemedText>}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
