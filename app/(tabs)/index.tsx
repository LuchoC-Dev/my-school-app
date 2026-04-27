import { View, Text } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { AppHeader } from "@/components/navigation/AppHeader";
import { EmptyState } from "@/components/ui";

export default function CoursesScreen() {
  const tokens = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: tokens.background }}>
      <AppHeader
        title="Materias"
        rightAction={{ label: "+ Nueva", onPress: () => {} }}
      />
      <EmptyState
        icon={<Text style={{ fontSize: 40 }}>📚</Text>}
        title="Sin materias"
        description="Agregá tu primera materia para empezar a organizar tus actividades."
        ctaLabel="+ Agregar materia"
        onCta={() => {}}
      />
    </View>
  );
}
