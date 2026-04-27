import { View, ScrollView, TouchableOpacity, Text } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";
import { ThemedText, SectionLabel, Separator, EmptyState, ProgressBar } from "@/components/ui";
import { useActivityStore } from "@/stores/activityStore";
import { useTaskStore } from "@/stores/taskStore";
import { useCourseStore } from "@/stores/courseStore";
import { courseColors } from "@/theme/tokens";
import { formatDate } from "@/utils/dateUtils";

export default function ActivityViewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const tokens = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const activity = useActivityStore((s) => s.activities.find((a) => a.id === id));
  const removeActivity = useActivityStore((s) => s.remove);
  const tasks = useTaskStore((s) => s.getByActivityId(id));
  const updateTask = useTaskStore((s) => s.update);
  const course = useCourseStore((s) => s.courses.find((c) => c.id === activity?.courseId));

  if (!activity) {
    return (
      <View style={{ flex: 1, backgroundColor: tokens.background, alignItems: "center", justifyContent: "center" }}>
        <ThemedText variant="body" style={{ color: tokens.textSecondary }}>Actividad no encontrada</ThemedText>
      </View>
    );
  }

  const colors = course ? courseColors[course.color] : null;
  const pendingTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

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
        <TouchableOpacity onPress={() => {}}>
          <ThemedText variant="body">✏️</ThemedText>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 80 }}>
        {/* Header info */}
        <View style={{ gap: 4 }}>
          <ThemedText variant="title">{activity.name}</ThemedText>
          {course && (
            <TouchableOpacity onPress={() => router.push(`/courses/${course.id}`)}>
              <ThemedText variant="metadata" style={{ color: colors?.accent ?? tokens.accent }}>
                🏫 {course.name} ›
              </ThemedText>
            </TouchableOpacity>
          )}
          {activity.dueDate && (
            <ThemedText variant="metadata" style={{ color: tokens.textSecondary }}>
              🗓 Vence {formatDate(activity.dueDate)}
            </ThemedText>
          )}
        </View>

        {/* Progress */}
        {tasks.length > 0 && (
          <View style={{ gap: 6 }}>
            <ThemedText variant="metadata" style={{ color: tokens.textSecondary }}>
              {completedTasks.length}/{tasks.length} tasks completadas
            </ThemedText>
            <ProgressBar progress={activity.progress} accentColor={colors?.accent} />
          </View>
        )}

        <Separator />

        {/* Tasks */}
        <View style={{ gap: 6 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <SectionLabel>Tasks</SectionLabel>
            <TouchableOpacity onPress={() => router.push({ pathname: "/tasks/create", params: { activityId: id } })}>
              <ThemedText variant="metadata" style={{ color: tokens.accent }}>+ Nueva</ThemedText>
            </TouchableOpacity>
          </View>

          {tasks.length === 0 && (
            <EmptyState
              icon={<Text style={{ fontSize: 28 }}>☑️</Text>}
              title="Sin tasks"
              description="Agregá tasks para llevar el progreso."
              ctaLabel="+ Nueva task"
              onCta={() => router.push({ pathname: "/tasks/create", params: { activityId: id } })}
            />
          )}

          {pendingTasks.map((task) => (
            <TouchableOpacity
              key={task.id}
              onPress={() => router.push(`/tasks/${task.id}`)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                paddingVertical: 8,
                borderBottomWidth: 1,
                borderBottomColor: tokens.borderLight,
              }}
            >
              <TouchableOpacity
                onPress={() => updateTask(task.id, { completed: true })}
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 9,
                  borderWidth: 1.5,
                  borderColor: tokens.border,
                }}
              />
              <ThemedText variant="body" style={{ flex: 1 }}>{task.title}</ThemedText>
              <ThemedText variant="metadata" style={{ color: tokens.borderLight }}>›</ThemedText>
            </TouchableOpacity>
          ))}

          {completedTasks.map((task) => (
            <TouchableOpacity
              key={task.id}
              onPress={() => router.push(`/tasks/${task.id}`)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                paddingVertical: 8,
                borderBottomWidth: 1,
                borderBottomColor: tokens.borderLight,
                opacity: 0.6,
              }}
            >
              <View
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 9,
                  borderWidth: 1.5,
                  borderColor: tokens.accent,
                  backgroundColor: tokens.accent,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ThemedText style={{ color: tokens.textInverse, fontSize: 10 }}>✓</ThemedText>
              </View>
              <ThemedText variant="body" style={{ flex: 1, textDecorationLine: "line-through", color: tokens.textSecondary }}>
                {task.title}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        onPress={() => router.push({ pathname: "/tasks/create", params: { activityId: id } })}
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
          elevation: 4,
        }}
      >
        <ThemedText style={{ color: tokens.textInverse, fontSize: 24 }}>+</ThemedText>
      </TouchableOpacity>
    </View>
  );
}
