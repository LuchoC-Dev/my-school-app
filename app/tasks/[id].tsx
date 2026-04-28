import { View, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { ThemedText, Separator, BottomSheet, MaterialSection } from "@/components/ui";
import { useTaskStore } from "@/stores/taskStore";
import { useActivityStore } from "@/stores/activityStore";
import { useCourseStore } from "@/stores/courseStore";
import { courseColors } from "@/theme/tokens";
import { formatDate } from "@/utils/dateUtils";
import { MaterialLink } from "@/types/entities";

const TYPE_LABELS: Record<string, string> = {
  assignment: "Trabajo práctico",
  exam: "Examen",
  project: "Proyecto",
  reading: "Lectura",
  other: "Otro",
};

export default function TaskViewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const tokens = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activitySheetVisible, setActivitySheetVisible] = useState(false);

  const task = useTaskStore((s) => s.getById(id));
  const updateTask = useTaskStore((s) => s.update);
  const removeTask = useTaskStore((s) => s.remove);
  const activities = useActivityStore((s) => s.activities);
  const activity = useActivityStore((s) => s.activities.find((a) => a.id === task?.activityId));
  const course = useCourseStore((s) => s.courses.find((c) => c.id === activity?.courseId));

  if (!task) {
    return (
      <View style={{ flex: 1, backgroundColor: tokens.background, alignItems: "center", justifyContent: "center" }}>
        <ThemedText variant="body" style={{ color: tokens.textSecondary }}>Task no encontrada</ThemedText>
      </View>
    );
  }

  const colors = course ? courseColors[course.color] : null;
  const inheritedLinks: MaterialLink[] = activity?.links ?? [];
  const ownLinks: MaterialLink[] = task.links ?? [];

  async function handleDelete() {
    await removeTask(task!.id);
    router.back();
  }

  async function handleAddLink(link: MaterialLink) {
    await updateTask(id, { links: [...ownLinks, link] });
  }

  async function handleRemoveLink(index: number) {
    await updateTask(id, { links: ownLinks.filter((_, i) => i !== index) });
  }

  async function handleMoveToActivity(activityId: string) {
    await updateTask(id, { activityId });
    setActivitySheetVisible(false);
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
        <TouchableOpacity onPress={() => router.back()}>
          <ThemedText variant="body" style={{ color: tokens.textSecondary }}>‹ Volver</ThemedText>
        </TouchableOpacity>
        <View style={{ flexDirection: "row", gap: 16, alignItems: "center" }}>
          <TouchableOpacity onPress={() => router.push({ pathname: "/tasks/create", params: { editId: id } })}>
            <ThemedText variant="body">✏️</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete}>
            <ThemedText variant="body" style={{ color: tokens.destructive }}>Eliminar</ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 40 }}>
        {/* Toggle + title */}
        <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12 }}>
          <TouchableOpacity
            onPress={() => updateTask(task.id, { completed: !task.completed })}
            style={{
              width: 22, height: 22, borderRadius: 11,
              borderWidth: 1.5,
              borderColor: task.completed ? tokens.accent : tokens.border,
              backgroundColor: task.completed ? tokens.accent : "transparent",
              alignItems: "center", justifyContent: "center", marginTop: 2,
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

        {/* Parent activity — tappable to move */}
        <View style={{ gap: 6 }}>
          <TouchableOpacity
            onPress={() => setActivitySheetVisible(true)}
            style={{
              flexDirection: "row", alignItems: "center", gap: 8,
              backgroundColor: tokens.surface, borderRadius: 8, padding: 12,
              borderLeftWidth: 3, borderLeftColor: colors?.accent ?? tokens.accent,
            }}
          >
            <View style={{ flex: 1 }}>
              <ThemedText variant="body">{activity ? `📋 ${activity.name}` : "📋 Sin actividad"}</ThemedText>
              <ThemedText variant="metadata" style={{ color: tokens.textSecondary }}>Tocar para mover a otra actividad</ThemedText>
            </View>
            <ThemedText variant="metadata" style={{ color: tokens.textSecondary }}>›</ThemedText>
          </TouchableOpacity>

          {course && (
            <TouchableOpacity onPress={() => router.push(`/courses/${course.id}`)}>
              <ThemedText variant="metadata" style={{ color: colors?.accent ?? tokens.accent, paddingLeft: 4 }}>
                🏫 {course.name} ›
              </ThemedText>
            </TouchableOpacity>
          )}

          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {activity?.dueDate && (
              <ThemedText variant="metadata" style={{ color: tokens.textSecondary }}>
                🗓 Actividad vence {formatDate(activity.dueDate)}
              </ThemedText>
            )}
            {activity?.type && (
              <View style={{ backgroundColor: tokens.surfaceAlt, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 }}>
                <ThemedText variant="metadata" style={{ color: tokens.textSecondary }}>
                  {TYPE_LABELS[activity.type] ?? activity.type}
                </ThemedText>
              </View>
            )}
          </View>
        </View>

        {task.dueDate && (
          <ThemedText variant="metadata" style={{ color: tokens.textSecondary }}>
            🗓 Realizar: {formatDate(task.dueDate)}
          </ThemedText>
        )}

        {task.notes ? (
          <View style={{ backgroundColor: tokens.surfaceAlt, borderRadius: 8, padding: 12 }}>
            <ThemedText variant="metadata" style={{ color: tokens.textSecondary, marginBottom: 4 }}>📓 NOTAS</ThemedText>
            <ThemedText variant="body">{task.notes}</ThemedText>
          </View>
        ) : null}

        <Separator />

        {/* Inherited material from activity (readonly) */}
        {inheritedLinks.length > 0 && (
          <>
            <MaterialSection links={inheritedLinks} readonlyLabel="de la actividad" />
            <Separator />
          </>
        )}

        {/* Task's own material */}
        <MaterialSection
          links={ownLinks}
          onAdd={handleAddLink}
          onRemove={handleRemoveLink}
        />

        <Separator />

        <ThemedText variant="metadata" style={{ color: tokens.borderLight }}>
          Creada {formatDate(task.createdAt)}
        </ThemedText>
      </ScrollView>

      {/* Activity picker */}
      <BottomSheet visible={activitySheetVisible} onClose={() => setActivitySheetVisible(false)}>
        <ThemedText variant="card" style={{ marginBottom: 8 }}>Mover a actividad</ThemedText>
        {activities.length === 0 ? (
          <ThemedText variant="body" style={{ color: tokens.textSecondary }}>No hay actividades.</ThemedText>
        ) : (
          activities.map((a) => {
            const c = course; // current course context
            return (
              <TouchableOpacity
                key={a.id}
                onPress={() => handleMoveToActivity(a.id)}
                style={{ paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: tokens.borderLight, gap: 2 }}
              >
                <ThemedText variant="body" style={{ color: task.activityId === a.id ? tokens.accent : tokens.textPrimary }}>
                  {a.name}
                </ThemedText>
              </TouchableOpacity>
            );
          })
        )}
      </BottomSheet>
    </View>
  );
}
