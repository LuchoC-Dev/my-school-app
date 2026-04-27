import { View, Text } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { AppHeader } from "@/components/navigation/AppHeader";
import { EmptyState } from "@/components/ui";

export default function CalendarScreen() {
  const tokens = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: tokens.background }}>
      <AppHeader title="Calendario" />
      <EmptyState
        icon={<Text style={{ fontSize: 40 }}>📅</Text>}
        title="Sin eventos"
        description="Las fechas de entrega y exámenes aparecerán en el calendario."
        ctaLabel="Ver materias"
        onCta={() => {}}
      />
    </View>
  );
}
