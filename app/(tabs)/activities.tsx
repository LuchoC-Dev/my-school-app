import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/hooks/useTheme";
import { AppHeader } from "@/components/navigation/AppHeader";
import { FontFamily, FontSize } from "@/theme/typography";
import { TaskListTab } from "@/components/tasks/TaskListTab";
import { ActivityListTab } from "@/components/activities/ActivityListTab";
import { ProjectListTab } from "@/components/projects/ProjectListTab";

type SubTab = "tasks" | "activities" | "projects";

export default function ActivitiesScreen() {
  const { t } = useTranslation();
  const tokens = useTheme();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<SubTab>("tasks");

  const SUB_TABS: { key: SubTab; label: string }[] = [
    { key: "tasks", label: t("tasks.tabLabel") },
    { key: "activities", label: t("activities.tabLabel") },
    { key: "projects", label: t("projects.tabLabel") },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: tokens.background }}>
      <AppHeader
        title={t("activities.title")}
        rightAction={{
          label: t("activities.new"),
          onPress: () => {
            if (activeTab === "tasks") router.push("/tasks/create");
            else if (activeTab === "activities") router.push("/activities/create");
            else router.push("/projects/create");
          },
        }}
      />

      {/* Sub-tabs */}
      <View style={{ flexDirection: "row", paddingHorizontal: 16, paddingBottom: 8, gap: 8 }}>
        {SUB_TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 5,
                borderRadius: 999,
                borderWidth: 1.5,
                borderColor: isActive ? tokens.accent : tokens.border,
                backgroundColor: isActive ? tokens.accentLight : tokens.surface,
              }}
            >
              <Text
                style={{
                  fontFamily: isActive ? FontFamily.caveatBold : FontFamily.caveatRegular,
                  fontSize: FontSize.body,
                  color: isActive ? tokens.accent : tokens.textSecondary,
                }}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Content */}
      {activeTab === "tasks" && <TaskListTab />}
      {activeTab === "activities" && <ActivityListTab />}
      {activeTab === "projects" && <ProjectListTab />}
    </View>
  );
}
