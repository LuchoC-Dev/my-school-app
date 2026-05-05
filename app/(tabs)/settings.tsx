import { useState } from "react";
import { View, ScrollView, TouchableOpacity, Text } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/hooks/useTheme";
import { AppHeader } from "@/components/navigation/AppHeader";
import { ThemedText, Separator, ConfirmModal } from "@/components/ui";
import { useSettingsStore } from "@/stores/settingsStore";
import { useCourseStore } from "@/stores/courseStore";
import { useProjectStore } from "@/stores/projectStore";
import { useActivityStore } from "@/stores/activityStore";
import { useTaskStore } from "@/stores/taskStore";
import { seedData } from "@/utils/seedData";

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
  const { t } = useTranslation();
  const tokens = useTheme();
  const router = useRouter();
  const { userName, userAvatar } = useSettingsStore();
  const [confirmStep, setConfirmStep] = useState<1 | 2 | "seed" | null>(null);

  function doClearData() {
    useCourseStore.setState({ courses: [] });
    useProjectStore.setState({ projects: [] });
    useActivityStore.setState({ activities: [] });
    useTaskStore.setState({ tasks: [] });
    setConfirmStep(null);
  }

  async function doSeed() {
    setConfirmStep(null);
    await seedData();
  }

  return (
    <View style={{ flex: 1, backgroundColor: tokens.background }}>
      <AppHeader title={t("settings.title")} />

      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        {/* CUENTA */}
        <SectionLabel label={t("settings.account")} />
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
            <ThemedText variant="metadata" style={{ color: tokens.textSecondary }}>{t("settings.localProfile")}</ThemedText>
          </View>
          <ThemedText style={{ color: tokens.textSecondary, fontSize: 16 }}>›</ThemedText>
        </TouchableOpacity>

        {/* GENERAL */}
        <SectionLabel label={t("settings.general")} />
        <SettingsRow
          icon="📅"
          iconBg="#EDF4FC"
          label={t("settings.calendar")}
          onPress={() => router.push("/settings/general")}
        />

        {/* NOTIFICACIONES */}
        <SectionLabel label={t("settings.notifications")} />
        <SettingsRow
          icon="🔔"
          iconBg="#FDF0E6"
          label={t("settings.notifications")}
          onPress={() => router.push("/settings/notifications")}
        />

        {/* APARIENCIA */}
        <SectionLabel label={t("settings.appearance")} />
        <SettingsRow
          icon="🎨"
          iconBg="#F3F1FB"
          label={t("settings.appearance")}
          onPress={() => router.push("/settings/appearance")}
        />

        {/* IDIOMA */}
        <SettingsRow
          icon="🌐"
          iconBg="#EDF4FC"
          label={t("settings.language")}
          onPress={() => router.push("/settings/language")}
        />

        {/* DATOS */}
        <SectionLabel label={t("settings.data")} />
        <SettingsRow
          icon="📤"
          iconBg="#EDF7F0"
          label={t("settings.exportData")}
          onPress={() => {}}
        />
        <SettingsRow
          icon="🧪"
          iconBg="#F0F4FF"
          label={t("settings.loadTestData")}
          onPress={() => setConfirmStep("seed")}
        />
        <TouchableOpacity
          onPress={() => setConfirmStep(1)}
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
            {t("settings.deleteAll")}
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
          {t("settings.version")}
        </ThemedText>
      </ScrollView>

      <ConfirmModal
        visible={confirmStep === "seed"}
        title={t("settings.confirmSeed.title")}
        message={t("settings.confirmSeed.message")}
        confirmLabel={t("settings.confirmSeed.confirm")}
        cancelLabel={t("common.cancel")}
        onCancel={() => setConfirmStep(null)}
        onConfirm={doSeed}
      />

      <ConfirmModal
        visible={confirmStep === 1}
        title={t("settings.confirmDelete1.title")}
        message={t("settings.confirmDelete1.message")}
        confirmLabel={t("settings.confirmDelete1.confirm")}
        cancelLabel={t("common.cancel")}
        destructive
        onCancel={() => setConfirmStep(null)}
        onConfirm={() => setConfirmStep(2)}
      />

      <ConfirmModal
        visible={confirmStep === 2}
        title={t("settings.confirmDelete2.title")}
        message={t("settings.confirmDelete2.message")}
        confirmLabel={t("settings.confirmDelete2.confirm")}
        cancelLabel={t("common.cancel")}
        destructive
        onCancel={() => setConfirmStep(null)}
        onConfirm={doClearData}
      />
    </View>
  );
}
