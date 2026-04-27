import { View, ScrollView, TouchableOpacity, Text } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";
import { ThemedText, SectionLabel, Separator, EmptyState } from "@/components/ui";
import { useProjectStore } from "@/stores/projectStore";
import { useActivityStore } from "@/stores/activityStore";
import { useCourseStore } from "@/stores/courseStore";
import { ActivityCard } from "@/components/activities/ActivityCard";
import { courseColors } from "@/theme/tokens";
import { formatDate } from "@/utils/dateUtils";

export default function ProjectViewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const tokens = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const project = useProjectStore((s) => s.getById(id));
  const activities = useActivityStore((s) => s.getByProjectId(id));
  const course = useCourseStore((s) => s.courses.find((c) => c.id === project?.courseId));

  if (!project) {
    return (
      <View style={{ flex: 1, backgroundColor: tokens.background, alignItems: "center", justifyContent: "center" }}>
        <ThemedText variant="body" style={{ color: tokens.textSecondary }}>Proyecto no encontrado</ThemedText>
      </View>
    );
  }

  const colors = course ? courseColors[course.color] : null;
  const pending = activities.filter((a) => a.status !== "completed");
  const completed = activities.filter((a) => a.status === "completed");

  return (
    <View style={{ flex: 1, backgroundColor: tokens.background }}>
      <View
        style={{
          paddingTop: insets.top + 8,
          paddingBottom: 8,
          paddingHorizontal: 16,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottomWidth: 1,
          borderBottomColor: tokens.borderLight,
        }}
      >
        <TouchableOpacity onPress={() => router.back()} style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <ThemedText variant="body" style={{ color: tokens.textSecondary }}>‹ Volver</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity><ThemedText variant="body">✏️</ThemedText></TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 80 }}>
        <View style={{ gap: 4 }}>
          <ThemedText variant="title">📁 {project.name}</ThemedText>
          {course && (
            <TouchableOpacity onPress={() => router.push(`/courses/${course.id}`)}>
              <ThemedText variant="metadata" style={{ color: colors?.accent ?? tokens.accent }}>
                🏫 {course.name} ›
              </ThemedText>
            </TouchableOpacity>
          )}
          {project.description && (
            <ThemedText variant="body" style={{ color: tokens.textBody }}>{project.description}</ThemedText>
          )}
          {project.dueDate && (
            <ThemedText variant="metadata" style={{ color: tokens.textSecondary }}>
              🗓 Vence {formatDate(project.dueDate)}
            </ThemedText>
          )}
        </View>

        <Separator />

        {pending.length > 0 && (
          <View style={{ gap: 8 }}>
            <SectionLabel>Pendientes · {pending.length}</SectionLabel>
            {pending.map((a) => (
              <ActivityCard key={a.id} activity={a} course={course} onPress={() => router.push(`/activities/${a.id}`)} />
            ))}
          </View>
        )}

        {completed.length > 0 && (
          <View style={{ gap: 8 }}>
            <SectionLabel>Completadas · {completed.length}</SectionLabel>
            {completed.map((a) => (
              <ActivityCard key={a.id} activity={a} course={course} onPress={() => router.push(`/activities/${a.id}`)} />
            ))}
          </View>
        )}

        {activities.length === 0 && (
          <EmptyState
            icon={<Text style={{ fontSize: 32 }}>📋</Text>}
            title="Sin actividades"
            description="Este proyecto todavía no tiene actividades."
            ctaLabel="+ Nueva actividad"
            onCta={() => router.push("/activities/create")}
          />
        )}
      </ScrollView>

      <TouchableOpacity
        onPress={() => router.push("/activities/create")}
        style={{
          position: "absolute", bottom: insets.bottom + 16, right: 16,
          width: 48, height: 48, borderRadius: 24,
          backgroundColor: tokens.textPrimary,
          alignItems: "center", justifyContent: "center", elevation: 4,
        }}
      >
        <ThemedText style={{ color: tokens.textInverse, fontSize: 24 }}>+</ThemedText>
      </TouchableOpacity>
    </View>
  );
}
