import { useState } from "react";
import { View, ScrollView, TouchableOpacity, Text } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";
import { useSmartBack } from "@/hooks/useSmartBack";
import { ThemedText, SectionLabel, Separator, EmptyState, Checkbox } from "@/components/ui";
import { useShallow } from "zustand/react/shallow";
import { useCourseStore } from "@/stores/courseStore";
import { useActivityStore } from "@/stores/activityStore";
import { useTaskStore } from "@/stores/taskStore";
import { Activity } from "@/types/entities";
import { courseColors, ColorTokens } from "@/theme/tokens";
import { FontFamily, FontSize } from "@/theme/typography";

function ExpandableActivityCard({
  activity,
  accentColor,
  tokens,
  onNavigate,
}: {
  activity: Activity;
  accentColor: string;
  tokens: ColorTokens;
  onNavigate: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const tasks = useTaskStore(useShallow((s) => s.tasks.filter((t) => t.activityId === activity.id)));
  const updateTask = useTaskStore((s) => s.update);

  return (
    <View
      style={{
        backgroundColor: tokens.surface,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: tokens.borderLight,
        overflow: "hidden",
      }}
    >
      <View style={{ flexDirection: "row" }}>
        {/* Cuerpo → expande/colapsa */}
        <TouchableOpacity
          onPress={() => setExpanded((v) => !v)}
          activeOpacity={0.7}
          style={{ flex: 1, padding: 12, gap: 4 }}
        >
          <ThemedText variant="body">{activity.name}</ThemedText>
          {activity.dueDate && (
            <ThemedText variant="metadata" style={{ color: tokens.textSecondary }}>
              vence {new Date(activity.dueDate).toLocaleDateString("es-AR", { day: "numeric", month: "short" })}
            </ThemedText>
          )}
          {/* Barra de progreso */}
          {activity.progress > 0 && (
            <View style={{ height: 3, backgroundColor: tokens.borderLight, borderRadius: 2, marginTop: 4 }}>
              <View
                style={{
                  height: 3,
                  width: `${activity.progress * 100}%`,
                  backgroundColor: accentColor,
                  borderRadius: 2,
                }}
              />
            </View>
          )}
          {/* Chevron expandir */}
          <View style={{ alignItems: "flex-start", marginTop: 2 }}>
            <ThemedText style={{ marginLeft: 5, color: tokens.textSecondary, fontSize: 11 }}>
              {expanded ? "∧" : "∨"}
            </ThemedText>
          </View>
        </TouchableOpacity>

        {/* Flecha derecha → navega a actividad */}
        <TouchableOpacity
          onPress={onNavigate}
          style={{
            paddingHorizontal: 12,
            justifyContent: "center",
            borderLeftWidth: 1,
            borderLeftColor: tokens.borderLight,
          }}
        >
          <ThemedText style={{ color: tokens.textSecondary, fontSize: 18 }}>›</ThemedText>
        </TouchableOpacity>
      </View>

      {/* Tasks expandidas */}
      {expanded && tasks.length > 0 && (
        <View style={{ borderTopWidth: 1, borderTopColor: tokens.borderLight }}>
          {tasks.map((task) => (
            <TouchableOpacity
              key={task.id}
              onPress={() => updateTask(task.id, { completed: !task.completed })}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderBottomWidth: 1,
                borderBottomColor: tokens.borderLight,
              }}
            >
              <Checkbox checked={task.completed} onToggle={() => updateTask(task.id, { completed: !task.completed })} />
              <ThemedText
                variant="metadata"
                style={{
                  flex: 1,
                  color: task.completed ? tokens.textSecondary : tokens.textBody,
                  textDecorationLine: task.completed ? "line-through" : "none",
                }}
              >
                {task.title}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      )}
      {expanded && tasks.length === 0 && (
        <View style={{ padding: 10, borderTopWidth: 1, borderTopColor: tokens.borderLight }}>
          <ThemedText variant="metadata" style={{ color: tokens.textSecondary, fontStyle: "italic" }}>
            Sin tasks
          </ThemedText>
        </View>
      )}
    </View>
  );
}

export default function CourseViewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const tokens = useTheme();
  const router = useRouter();
  const goBack = useSmartBack("/(tabs)/");
  const insets = useSafeAreaInsets();

  const course = useCourseStore((s) => s.getById(id));
  const activities = useActivityStore(useShallow((s) => s.activities.filter((a) => a.courseId === id)));
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
        <TouchableOpacity onPress={goBack} style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <ThemedText variant="body" style={{ color: tokens.textSecondary }}>
            ‹ Volver
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push(`/courses/edit/${id}`)}>
          <ThemedText variant="body">✏️</ThemedText>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 80 }}>
        {/* Course info */}
        <View style={{ gap: 4 }}>
          <ThemedText variant="title">
            {course.emoji ? `${course.emoji} ` : ""}
            {course.name}
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
              <ExpandableActivityCard
                key={activity.id}
                activity={activity}
                accentColor={colors.accent}
                tokens={tokens}
                onNavigate={() => router.push(`/activities/${activity.id}`)}
              />
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
                <ThemedText variant="metadata" style={{ color: colors.accent }}>
                  ✓
                </ThemedText>
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
            onCta={() => router.push({ pathname: "/activities/create", params: { courseId: id } })}
          />
        )}
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        onPress={() => router.push({ pathname: "/activities/create", params: { courseId: id } })}
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
