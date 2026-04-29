import { View, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";
import { useSmartBack } from "@/hooks/useSmartBack";
import { ThemedText, Separator } from "@/components/ui";
import { useSettingsStore, CalendarViewDefault, WeekStartDay } from "@/stores/settingsStore";

const WEEK_START_OPTIONS: { value: WeekStartDay; label: string }[] = [
  { value: "sun", label: "Dom" },
  { value: "mon", label: "Lun" },
  { value: "sat", label: "Sáb" },
];

const CALENDAR_VIEW_OPTIONS: { value: CalendarViewDefault; icon: string; label: string }[] = [
  { value: "month", icon: "📅", label: "Mes" },
  { value: "week", icon: "📆", label: "Semana" },
  { value: "day", icon: "☀️", label: "Día" },
];

export default function GeneralScreen() {
  const tokens = useTheme();
  const router = useRouter();
  const goBack = useSmartBack("/(tabs)/settings");
  const insets = useSafeAreaInsets();
  const { weekStart, setWeekStart, calendarViewDefault, setCalendarViewDefault } = useSettingsStore();

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
        <ThemedText variant="card" style={{ flex: 1 }}>⚙️ General</ThemedText>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        {/* CALENDARIO */}
        <ThemedText
          variant="metadata"
          style={{
            color: tokens.textSecondary,
            paddingHorizontal: 16,
            paddingTop: 14,
            paddingBottom: 4,
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          Calendario
        </ThemedText>

        {/* Día de inicio de semana */}
        <View style={{ padding: 14 }}>
          <ThemedText
            variant="metadata"
            style={{ color: tokens.textSecondary, textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 6 }}
          >
            Día de inicio de semana
          </ThemedText>
          <View style={{ flexDirection: "row", gap: 6 }}>
            {WEEK_START_OPTIONS.map((opt) => {
              const active = weekStart === opt.value;
              return (
                <TouchableOpacity
                  key={opt.value}
                  onPress={() => setWeekStart(opt.value)}
                  style={{
                    flex: 1,
                    alignItems: "center",
                    paddingVertical: 7,
                    borderRadius: 8,
                    borderWidth: active ? 2 : 1.5,
                    borderColor: active ? tokens.textPrimary : tokens.borderLight,
                    backgroundColor: active ? tokens.textPrimary : "transparent",
                  }}
                >
                  <ThemedText
                    variant="metadata"
                    style={{
                      color: active ? tokens.textInverse : tokens.textSecondary,
                      fontWeight: active ? "700" : "400",
                    }}
                  >
                    {opt.label}
                  </ThemedText>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <Separator />

        {/* Vista por defecto */}
        <View style={{ padding: 14 }}>
          <ThemedText
            variant="metadata"
            style={{ color: tokens.textSecondary, textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 6 }}
          >
            Vista por defecto al abrir
          </ThemedText>
          <View style={{ gap: 6 }}>
            {CALENDAR_VIEW_OPTIONS.map((opt) => {
              const active = calendarViewDefault === opt.value;
              return (
                <TouchableOpacity
                  key={opt.value}
                  onPress={() => setCalendarViewDefault(opt.value)}
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
                  <ThemedText style={{ fontSize: 16 }}>{opt.icon}</ThemedText>
                  <ThemedText variant="body" style={{ flex: 1, fontWeight: active ? "700" : "400" }}>
                    {opt.label}
                  </ThemedText>
                  {active && <ThemedText variant="metadata">✓</ThemedText>}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
