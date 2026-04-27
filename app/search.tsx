import { View, Text } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { AppHeader } from "@/components/navigation/AppHeader";
import { EmptyState } from "@/components/ui";
import { useRouter } from "expo-router";

export default function SearchScreen() {
  const tokens = useTheme();
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: tokens.background }}>
      <AppHeader title="Buscar" rightAction={{ label: "Cancelar", onPress: () => router.back() }} />
      <EmptyState
        icon={<Text style={{ fontSize: 40 }}>🔍</Text>}
        title="Buscar en todo"
        description="Buscá materias, actividades, proyectos y tasks desde aquí."
        ctaLabel="Volver"
        onCta={() => router.back()}
      />
    </View>
  );
}
