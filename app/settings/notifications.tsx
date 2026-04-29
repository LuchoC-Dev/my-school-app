import { View, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";
import { useSmartBack } from "@/hooks/useSmartBack";
import { ThemedText, Separator } from "@/components/ui";
import { useSettingsStore } from "@/stores/settingsStore";

function Toggle({ value, onToggle, disabled }: { value: boolean; onToggle: () => void; disabled?: boolean }) {
  const tokens = useTheme();
  const isOn = value && !disabled;
  return (
    <TouchableOpacity
      onPress={onToggle}
      disabled={disabled}
      style={{
        width: 36,
        height: 20,
        borderRadius: 999,
        borderWidth: 1.5,
        borderColor: isOn ? tokens.textPrimary : tokens.borderLight,
        backgroundColor: isOn ? tokens.textPrimary : tokens.surfaceAlt,
        justifyContent: "center",
        paddingHorizontal: 3,
        opacity: disabled ? 0.4 : 1,
      }}
    >
      <View style={{
        width: 13,
        height: 13,
        borderRadius: 7,
        backgroundColor: isOn ? tokens.textInverse : tokens.textSecondary,
        alignSelf: isOn ? "flex-end" : "flex-start",
      }} />
    </TouchableOpacity>
  );
}

export default function NotificationsScreen() {
  const tokens = useTheme();
  const router = useRouter();
  const goBack = useSmartBack("/(tabs)/settings");
  const insets = useSafeAreaInsets();
  const { notifications, setNotifications } = useSettingsStore();

  const masterOff = !notifications.master;

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
        <ThemedText variant="card" style={{ flex: 1 }}>🔔 Notificaciones</ThemedText>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        {/* Master toggle */}
        <View style={{
          margin: 12,
          backgroundColor: tokens.surface,
          borderRadius: 10,
          borderWidth: 1.5,
          borderColor: tokens.border,
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          padding: 12,
        }}>
          <View style={{ flex: 1 }}>
            <ThemedText variant="body" style={{ fontWeight: "700" }}>Activar notificaciones</ThemedText>
            <ThemedText variant="metadata" style={{ color: tokens.textSecondary }}>Permite alertas de My School</ThemedText>
          </View>
          <Toggle
            value={notifications.master}
            onToggle={() => setNotifications({ master: !notifications.master })}
          />
        </View>

        {/* POR TIPO */}
        <ThemedText
          variant="metadata"
          style={{ color: tokens.textSecondary, paddingHorizontal: 16, paddingTop: 10, paddingBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}
        >
          Por tipo
        </ThemedText>

        {[
          { key: "tasks" as const, icon: "☑️", iconBg: "#FDF0E6", label: "Vencimiento de tasks", sub: "Antes de la fecha límite" },
          { key: "activities" as const, icon: "○", iconBg: "#EDF4FC", label: "Vencimiento de activities", sub: "Antes de la fecha límite" },
          { key: "projects" as const, icon: "📁", iconBg: "#F3F1FB", label: "Vencimiento de projects", sub: "Antes de la fecha límite" },
          { key: "dailyReminder" as const, icon: "📅", iconBg: "#EDF7F0", label: "Recordatorio diario", sub: "Resumen de pendientes" },
        ].map((item) => (
          <View
            key={item.key}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              paddingVertical: 9,
              paddingHorizontal: 16,
              borderBottomWidth: 1,
              borderBottomColor: tokens.borderLight,
            }}
          >
            <View style={{
              width: 28,
              height: 28,
              borderRadius: 7,
              backgroundColor: item.iconBg,
              alignItems: "center",
              justifyContent: "center",
            }}>
              <ThemedText style={{ fontSize: 15 }}>{item.icon}</ThemedText>
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText variant="body" style={{ fontWeight: "600" }}>{item.label}</ThemedText>
              <ThemedText variant="metadata" style={{ color: tokens.textSecondary }}>{item.sub}</ThemedText>
            </View>
            <Toggle
              value={notifications[item.key]}
              onToggle={() => setNotifications({ [item.key]: !notifications[item.key] })}
              disabled={masterOff}
            />
          </View>
        ))}

        <Separator />

        {/* ANTICIPACIÓN */}
        <ThemedText
          variant="metadata"
          style={{ color: tokens.textSecondary, paddingHorizontal: 16, paddingTop: 10, paddingBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}
        >
          Anticipación
        </ThemedText>
        <ThemedText
          variant="metadata"
          style={{ color: tokens.textSecondary, paddingHorizontal: 16, paddingBottom: 8, lineHeight: 18 }}
        >
          Cuántos días antes del vencimiento recibís la alerta
        </ThemedText>
        <View style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 9,
          paddingHorizontal: 16,
        }}>
          <ThemedText variant="body" style={{ flex: 1, fontWeight: "600" }}>Días de anticipación</ThemedText>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <TouchableOpacity
              onPress={() => setNotifications({ daysAhead: Math.max(0, notifications.daysAhead - 1) })}
              disabled={masterOff}
              style={{
                width: 26,
                height: 26,
                borderRadius: 13,
                borderWidth: 1.5,
                borderColor: tokens.borderLight,
                alignItems: "center",
                justifyContent: "center",
                opacity: masterOff ? 0.4 : 1,
              }}
            >
              <ThemedText variant="body">−</ThemedText>
            </TouchableOpacity>
            <ThemedText variant="body" style={{ fontWeight: "700", minWidth: 20, textAlign: "center" }}>
              {notifications.daysAhead}
            </ThemedText>
            <TouchableOpacity
              onPress={() => setNotifications({ daysAhead: Math.min(14, notifications.daysAhead + 1) })}
              disabled={masterOff}
              style={{
                width: 26,
                height: 26,
                borderRadius: 13,
                borderWidth: 1.5,
                borderColor: tokens.borderLight,
                alignItems: "center",
                justifyContent: "center",
                opacity: masterOff ? 0.4 : 1,
              }}
            >
              <ThemedText variant="body">+</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
