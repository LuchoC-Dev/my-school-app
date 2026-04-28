import { View, ScrollView, TouchableOpacity, Text, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { AppHeader } from "@/components/navigation/AppHeader";
import { ThemedText, Separator } from "@/components/ui";
import { useSettingsStore } from "@/stores/settingsStore";
import { useCourseStore } from "@/stores/courseStore";
import { useProjectStore } from "@/stores/projectStore";
import { useActivityStore } from "@/stores/activityStore";
import { useTaskStore } from "@/stores/taskStore";

function SectionLabel({ label }: { label: string }) {
  const tokens = useTheme();
  return (
    <ThemedText
      variant="metadata"
      style={{
        color: tokens.textSecondary,
        paddingHorizontal: 16,
        paddingTop: 14,
        paddingBottom: 4,
        textTransform: "uppercase",
        letterSpacing: 0.5,
        fontSize: 10,
      }}
    >
      {label}
    </ThemedText>
  );
}

function SettingsRow({
  icon,
  iconBg,
  label,
  labelColor,
  chevronColor,
  onPress,
}: {
  icon: string;
  iconBg: string;
  label: string;
  labelColor?: string;
  chevronColor?: string;
  onPress: () => void;
}) {
  const tokens = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
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
      <View
        style={{
          width: 28,
          height: 28,
          borderRadius: 7,
          backgroundColor: iconBg,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ fontSize: 15 }}>{icon}</Text>
      </View>
      <ThemedText
        variant="body"
        style={{ flex: 1, color: labelColor ?? tokens.textPrimary, fontWeight: "600" }}
      >
        {label}
      </ThemedText>
      <ThemedText style={{ color: chevronColor ?? tokens.textSecondary, fontSize: 16 }}>›</ThemedText>
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const tokens = useTheme();
  const router = useRouter();
  const { userName, userAvatar } = useSettingsStore();

  function handleClearData() {
    Alert.alert(
      "Borrar todos los datos",
      "Esta acción es irreversible. Se eliminarán todas las materias, proyectos, actividades y tasks.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Borrar todo",
          style: "destructive",
          onPress: () => {
            useCourseStore.setState({ courses: [] });
            useProjectStore.setState({ projects: [] });
            useActivityStore.setState({ activities: [] });
            useTaskStore.setState({ tasks: [] });
          },
        },
      ]
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: tokens.background }}>
      <AppHeader title="⚙️ Settings" />

      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        {/* CUENTA */}
        <SectionLabel label="Cuenta" />
        <TouchableOpacity
          onPress={() => router.push("/settings/account")}
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
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              borderWidth: 2,
              borderColor: tokens.textPrimary,
              backgroundColor: tokens.surfaceAlt,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 22 }}>{userAvatar}</Text>
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <ThemedText variant="body" style={{ fontWeight: "700" }}>{userName}</ThemedText>
            <ThemedText variant="metadata" style={{ color: tokens.textSecondary }}>Perfil local</ThemedText>
          </View>
          <ThemedText style={{ color: tokens.textSecondary, fontSize: 16 }}>›</ThemedText>
        </TouchableOpacity>

        {/* GENERAL */}
        <SectionLabel label="General" />
        <SettingsRow
          icon="📅"
          iconBg="#EDF4FC"
          label="Calendario"
          onPress={() => router.push("/settings/general")}
        />

        {/* NOTIFICACIONES */}
        <SectionLabel label="Notificaciones" />
        <SettingsRow
          icon="🔔"
          iconBg="#FDF0E6"
          label="Notificaciones"
          onPress={() => router.push("/settings/notifications")}
        />

        {/* APARIENCIA */}
        <SectionLabel label="Apariencia" />
        <SettingsRow
          icon="🎨"
          iconBg="#F3F1FB"
          label="Apariencia"
          onPress={() => router.push("/settings/appearance")}
        />

        {/* DATOS */}
        <SectionLabel label="Datos" />
        <SettingsRow
          icon="📤"
          iconBg="#EDF7F0"
          label="Exportar datos"
          onPress={() =>
            Alert.alert("Próximamente", "La exportación de datos estará disponible en una próxima versión.")
          }
        />
        <TouchableOpacity
          onPress={handleClearData}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            paddingVertical: 9,
            paddingHorizontal: 16,
          }}
        >
          <View
            style={{
              width: 28,
              height: 28,
              borderRadius: 7,
              backgroundColor: "#FEF0F0",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 15 }}>🗑️</Text>
          </View>
          <ThemedText variant="body" style={{ flex: 1, color: tokens.destructive, fontWeight: "600" }}>
            Borrar todos los datos
          </ThemedText>
          <ThemedText style={{ color: tokens.destructive, fontSize: 16 }}>›</ThemedText>
        </TouchableOpacity>

        <Separator />

        <ThemedText
          variant="metadata"
          style={{
            color: tokens.textSecondary,
            textAlign: "center",
            paddingVertical: 12,
          }}
        >
          My School v0.1.0 — MVP
        </ThemedText>
      </ScrollView>
    </View>
  );
}
