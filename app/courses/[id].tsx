import { View, ScrollView, TouchableOpacity, Text } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";
import { ThemedText, SectionLabel, Separator, EmptyState, Checkbox } from "@/components/ui";
import { useCourseStore } from "@/stores/courseStore";
import { useActivityStore } from "@/stores/activityStore";
import { useTaskStore } from "@/stores/taskStore";
import { courseColors } from "@/theme/tokens";
import { FontFamily, FontSize } from "@/theme/typography";

export default function CourseViewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const tokens = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const course = useCourseStore((s) => s.getById(id));
  const activities = useActivityStore((s) => s.getByCourseId(id));
  const toggleTask = useTaskStore((s) => s.update);

  if (!course) {
    return (
      <View style={{ flex: 1, backgroundColor: tokens.background, alignItems: "center", justifyContent: "center" }}>
        <ThemedText variant="body" style={{ color: tokens.textSecondary }}>
          Materia no encontrada
        </ThemedText>
      </View>
    );
  }

  const colors = courseColors[course.color];
  const pending = activities.filter((a) => a.status !== "completed");
  const completed = activities.filter((a) => a.status === "completed");

  return (
    <View style={{ flex: 1, backgroundColor: tokens.background }}>
      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 8,
          paddingBottom: 8,
          paddingHorizontal: 16,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: tokens.background,
          borderBottomWidth: 1,
          borderBottomColor: tokens.borderLight,
        }}
      >
        <TouchableOpacity onPress={() => router.back()} style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <ThemedText variant="body" style={{ color: tokens.textSecondary }}>‹</ThemedText>
          <ThemedText variant="body" style={{ color: tokens.textSecondary }}>Materias</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity>
          <ThemedText variant="body">✏️</ThemedText>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 80 }}>
        {/* Course info */}
        <View style={{ gap: 4 }}>
          <ThemedText variant="title">
            {course.emoji ? `${course.emoji} ` : ""}{course.name}
          </ThemedText>
          {course.professor ? (
            <ThemedText variant="metadata" style={{ color: tokens.textSecondary }}>
              👤 {course.professor}
            </ThemedText>
          ) : null}
          {course.description ? (
            <ThemedText variant="body" style={{ color: tokens.textBody, marginTop: 2 }}>
              {course.description}
            </ThemedText>
          ) : null}

          {/* Schedules */}
          {course.schedules.length > 0 && (
            <View style={{ marginTop: 4, gap: 2 }}>
              <SectionLabel>Horarios</SectionLabel>
              {course.schedules.map((s, i) => (
                <ThemedText key={i} variant="metadata" style={{ color: tokens.textSecondary }}>
                  {s.day} {s.from}–{s.to}
                </ThemedText>
              ))}
            </View>
          )}
        </View>

        <Separator />

        {/* Pending activities */}
        {pending.length > 0 && (
          <View style={{ gap: 8 }}>
            <SectionLabel>⏳ Pendientes · {pending.length}</SectionLabel>
            {pending.map((activity) => (
              <TouchableOpacity
                key={activity.id}
                onPress={() => router.push(`/activities/${activity.id}`)}
                style={{
                  backgroundColor: tokens.surface,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: tokens.borderLight,
                  padding: 12,
                  gap: 4,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <ThemedText variant="body" style={{ flex: 1 }}>{activity.name}</ThemedText>
                  <ThemedText variant="metadata" style={{ color: tokens.textSecondary }}>›</ThemedText>
                </View>
                {activity.dueDate && (
                  <ThemedText variant="metadata" style={{ color: tokens.textSecondary }}>
                    vence {new Date(activity.dueDate).toLocaleDateString("es-AR", { day: "numeric", month: "short" })}
                  </ThemedText>
                )}
                {/* Progress bar inline */}
                {activity.progress > 0 && (
                  <View
                    style={{
                      height: 3,
                      backgroundColor: tokens.borderLight,
                      borderRadius: 2,
                      marginTop: 4,
                    }}
                  >
                    <View
                      style={{
                        height: 3,
                        width: `${activity.progress * 100}%`,
                        backgroundColor: colors.accent,
                        borderRadius: 2,
                      }}
                    />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Completed activities */}
        {completed.length > 0 && (
          <View style={{ gap: 8 }}>
            <SectionLabel>✅ Completadas · {completed.length}</SectionLabel>
            {completed.map((activity) => (
              <TouchableOpacity
                key={activity.id}
                onPress={() => router.push(`/activities/${activity.id}`)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  paddingVertical: 8,
                  paddingHorizontal: 4,
                  borderBottomWidth: 1,
                  borderBottomColor: tokens.borderLight,
                }}
              >
                <ThemedText variant="metadata" style={{ color: colors.accent }}>✓</ThemedText>
                <ThemedText
                  variant="body"
                  style={{ color: tokens.textSecondary, textDecorationLine: "line-through", flex: 1 }}
                >
                  {activity.name}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {activities.length === 0 && (
          <EmptyState
            icon={<Text style={{ fontSize: 32 }}>📋</Text>}
            title="Sin actividades"
            description="Agregá una actividad, tarea o proyecto para esta materia."
            ctaLabel="+ Agregar"
            onCta={() => {}}
          />
        )}
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        onPress={() => {}}
        style={{
          position: "absolute",
          bottom: insets.bottom + 16,
          right: 16,
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: tokens.textPrimary,
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 4,
          elevation: 4,
        }}
      >
        <ThemedText style={{ color: tokens.textInverse, fontSize: 24 }}>+</ThemedText>
      </TouchableOpacity>
    </View>
  );
}
