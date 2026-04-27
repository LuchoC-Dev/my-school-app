import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { AppHeader } from "@/components/navigation/AppHeader";
import { FontFamily, FontSize } from "@/theme/typography";
import { TaskListTab } from "@/components/tasks/TaskListTab";
import { ActivityListTab } from "@/components/activities/ActivityListTab";
import { ProjectListTab } from "@/components/projects/ProjectListTab";

const SUB_TABS = ["Tasks", "Activities", "Projects"] as const;
type SubTab = (typeof SUB_TABS)[number];

export default function ActivitiesScreen() {
  const tokens = useTheme();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<SubTab>("Tasks");

  return (
    <View style={{ flex: 1, backgroundColor: tokens.background }}>
      <AppHeader
        title="Actividades"
        rightAction={{
          label: "+ Nueva",
          onPress: () => {
            if (activeTab === "Tasks") router.push("/tasks/create");
            else if (activeTab === "Activities") router.push("/activities/create");
            else router.push("/projects/create");
          },
        }}
      />

      {/* Sub-tabs */}
      <View style={{ flexDirection: "row", paddingHorizontal: 16, paddingBottom: 8, gap: 8 }}>
        {SUB_TABS.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
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
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Content */}
      {activeTab === "Tasks" && <TaskListTab />}
      {activeTab === "Activities" && <ActivityListTab />}
      {activeTab === "Projects" && <ProjectListTab />}
    </View>
  );
}
