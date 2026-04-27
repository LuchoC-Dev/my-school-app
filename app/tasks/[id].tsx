import { View, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";
import { ThemedText, Separator } from "@/components/ui";
import { useTaskStore } from "@/stores/taskStore";
import { useActivityStore } from "@/stores/activityStore";
import { useCourseStore } from "@/stores/courseStore";
import { courseColors } from "@/theme/tokens";
import { formatDate } from "@/utils/dateUtils";

export default function TaskViewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const tokens = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const task = useTaskStore((s) => s.getById(id));
  const updateTask = useTaskStore((s) => s.update);
  const removeTask = useTaskStore((s) => s.remove);
  const activities = useActivityStore((s) => s.activities);
  const courses = useCourseStore((s) => s.courses);

  if (!task) {
    return (
      <View style={{ flex: 1, backgroundColor: tokens.background, alignItems: "center", justifyContent: "center" }}>
        <ThemedText variant="body" style={{ color: tokens.textSecondary }}>Task no encontrada</ThemedText>
      </View>
    );
  }

  const activity = activities.find((a) => a.id === task.activityId);
  const course = courses.find((c) => c.id === activity?.courseId);
  const colors = course ? courseColors[course.color] : null;

  async function handleDelete() {
    await removeTask(task!.id);
    router.back();
  }

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
          borderBottomWidth: 1,
          borderBottomColor: tokens.borderLight,
        }}
      >
        <TouchableOpacity onPress={() => router.back()} style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <ThemedText variant="body" style={{ color: tokens.textSecondary }}>‹ Volver</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDelete}>
          <ThemedText variant="body" style={{ color: tokens.destructive }}>Eliminar</ThemedText>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 40 }}>
        {/* Toggle + title */}
        <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12 }}>
          <TouchableOpacity
            onPress={() => updateTask(task.id, { completed: !task.completed })}
            style={{
              width: 22,
              height: 22,
              borderRadius: 11,
              borderWidth: 1.5,
              borderColor: task.completed ? tokens.accent : tokens.border,
              backgroundColor: task.completed ? tokens.accent : "transparent",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 2,
            }}
          >
            {task.completed && (
              <ThemedText style={{ color: tokens.textInverse, fontSize: 12 }}>✓</ThemedText>
            )}
          </TouchableOpacity>
          <ThemedText
            variant="title"
            style={{
              flex: 1,
              textDecorationLine: task.completed ? "line-through" : "none",
              color: task.completed ? tokens.textSecondary : tokens.textPrimary,
            }}
          >
            {task.title}
          </ThemedText>
        </View>

        <Separator />

        {/* Metadata */}
        {activity && (
          <View style={{ gap: 6 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <ThemedText variant="metadata" style={{ color: tokens.textSecondary }}>📋 Actividad</ThemedText>
              <TouchableOpacity onPress={() => router.push(`/activities/${activity.id}`)}>
                <ThemedText variant="body" style={{ color: tokens.accent }}>{activity.name} ›</ThemedText>
              </TouchableOpacity>
            </View>
            {course && (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <ThemedText variant="metadata" style={{ color: tokens.textSecondary }}>🏫 Materia</ThemedText>
                <TouchableOpacity onPress={() => router.push(`/courses/${course.id}`)}>
                  <ThemedText
                    variant="body"
                    style={{ color: colors?.accent ?? tokens.accent }}
                  >
                    {course.name} ›
                  </ThemedText>
                </TouchableOpacity>
              </View>
            )}
            {activity.dueDate && (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <ThemedText variant="metadata" style={{ color: tokens.textSecondary }}>🗓 Vence</ThemedText>
                <ThemedText variant="body">{formatDate(activity.dueDate)}</ThemedText>
              </View>
            )}
          </View>
        )}

        <ThemedText variant="metadata" style={{ color: tokens.borderLight }}>
          Creada {formatDate(task.createdAt)}
        </ThemedText>
      </ScrollView>
    </View>
  );
}
