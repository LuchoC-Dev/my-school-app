import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { AppHeader } from "@/components/navigation/AppHeader";
import { EmptyState } from "@/components/ui";
import { FontFamily, FontSize } from "@/theme/typography";

const SUB_TABS = ["Hoy", "Próximas", "Todas"] as const;
type SubTab = (typeof SUB_TABS)[number];

export default function ActivitiesScreen() {
  const tokens = useTheme();
  const [activeTab, setActiveTab] = useState<SubTab>("Hoy");

  return (
    <View style={{ flex: 1, backgroundColor: tokens.background }}>
      <AppHeader
        title="Actividades"
        rightAction={{ label: "+ Nueva", onPress: () => {} }}
      />
      {/* Sub-tabs */}
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 16,
          paddingBottom: 8,
          gap: 8,
        }}
      >
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
      <EmptyState
        icon={<Text style={{ fontSize: 40 }}>✅</Text>}
        title="Sin actividades"
        description="Las actividades de tus materias aparecerán aquí."
        ctaLabel="+ Agregar actividad"
        onCta={() => {}}
      />
    </View>
  );
}
