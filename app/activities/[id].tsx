import { View, ScrollView, TouchableOpacity, Text } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useShallow } from "zustand/react/shallow";
import { useTheme } from "@/hooks/useTheme";
import { ThemedText, SectionLabel, Separator, EmptyState, ProgressBar, BottomSheet, MaterialSection } from "@/components/ui";
import { useActivityStore } from "@/stores/activityStore";
import { useTaskStore } from "@/stores/taskStore";
import { useCourseStore } from "@/stores/courseStore";
import { useProjectStore } from "@/stores/projectStore";
import { courseColors } from "@/theme/tokens";
import { formatDate } from "@/utils/dateUtils";
import { MaterialLink } from "@/types/entities";
import { useState } from "react";

const TYPE_LABELS: Record<string, string> = {
  assignment: "Trabajo práctico",
  exam: "Examen",
  project: "Proyecto",
  reading: "Lectura",
  other: "Otro",
};

export default function ActivityViewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const tokens = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [projectSheetVisible, setProjectSheetVisible] = useState(false);

  const activity = useActivityStore((s) => s.activities.find((a) => a.id === id));
  const updateActivity = useActivityStore((s) => s.update);
  const removeActivity = useActivityStore((s) => s.remove);
  const tasks = useTaskStore(useShallow((s) => s.tasks.filter((t) => t.activityId === id)));
  const updateTask = useTaskStore((s) => s.update);
  const course = useCourseStore((s) => s.courses.find((c) => c.id === activity?.courseId));
  const courseId = activity?.courseId ?? "";
  const projects = useProjectStore(useShallow((s) => s.projects.filter((p) => p.courseId === courseId)));
  const currentProject = useProjectStore((s) => s.projects.find((p) => p.id === activity?.projectId));

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
  const isCompleted = activity.status === "completed";
  const links: MaterialLink[] = activity.links ?? [];

  async function handleToggleComplete() {
    await updateActivity(id, { status: isCompleted ? "pending" : "completed" });
  }

  async function handleDelete() {
    await removeActivity(id);
    router.back();
  }

  async function handleAddLink(link: MaterialLink) {
    await updateActivity(id, { links: [...links, link] });
  }

  async function handleRemoveLink(index: number) {
    await updateActivity(id, { links: links.filter((_, i) => i !== index) });
  }

  async function handleMoveToProject(projectId: string | null) {
    await updateActivity(id, { projectId: projectId ?? undefined });
    setProjectSheetVisible(false);
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
          <TouchableOpacity onPress={() => router.push({ pathname: "/activities/create", params: { editId: id } })}>
            <ThemedText variant="body">✏️</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete}>
            <ThemedText variant="body" style={{ color: tokens.destructive }}>Eliminar</ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 80 }}>
        {/* Title + meta */}
        <View style={{ gap: 6 }}>
          <ThemedText variant="title" style={{ textDecorationLine: isCompleted ? "line-through" : "none" }}>
            {activity.name}
          </ThemedText>

          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
            {course && (
              <TouchableOpacity onPress={() => router.push(`/courses/${course.id}`)}>
                <ThemedText variant="metadata" style={{ color: colors?.accent ?? tokens.accent }}>
                  🏫 {course.name} ›
                </ThemedText>
              </TouchableOpacity>
            )}
            <View style={{ borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2, backgroundColor: tokens.surfaceAlt }}>
              <ThemedText variant="metadata" style={{ color: tokens.textSecondary }}>
                {TYPE_LABELS[activity.type] ?? activity.type}
              </ThemedText>
            </View>
          </View>

          {/* Project badge — tappable to move */}
          <TouchableOpacity onPress={() => setProjectSheetVisible(true)} style={{ flexDirection: "row", alignItems: "center", gap: 4, alignSelf: "flex-start" }}>
            <ThemedText variant="metadata" style={{
              color: currentProject ? tokens.accent : tokens.textSecondary,
              borderWidth: 1,
              borderColor: currentProject ? tokens.accent : tokens.border,
              borderRadius: 999,
              paddingHorizontal: 8,
              paddingVertical: 2,
              borderStyle: currentProject ? "solid" : "dashed",
            }}>
              {currentProject ? `📁 ${currentProject.name} ›` : "📁 Asignar a proyecto..."}
            </ThemedText>
          </TouchableOpacity>

          {activity.dueDate && (
            <ThemedText variant="metadata" style={{ color: tokens.textSecondary }}>
              🗓 Vence {formatDate(activity.dueDate)}
            </ThemedText>
          )}
        </View>

        {/* Completar button */}
        <TouchableOpacity
          onPress={handleToggleComplete}
          style={{
            borderRadius: 8, paddingVertical: 10, paddingHorizontal: 16,
            backgroundColor: isCompleted ? tokens.surfaceAlt : tokens.accent,
            alignItems: "center",
          }}
        >
          <ThemedText variant="body" style={{ color: isCompleted ? tokens.textSecondary : tokens.textInverse }}>
            {isCompleted ? "↩ Marcar como pendiente" : "✓ Marcar como completada"}
          </ThemedText>
        </TouchableOpacity>

        <Separator />

        {/* Progress */}
        {tasks.length > 0 && (
          <View style={{ gap: 6 }}>
            <ThemedText variant="metadata" style={{ color: tokens.textSecondary }}>
              {completedTasks.length}/{tasks.length} tasks completadas
            </ThemedText>
            <ProgressBar progress={activity.progress} accentColor={colors?.accent} />
          </View>
        )}

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
                flexDirection: "row", alignItems: "center", gap: 10,
                paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: tokens.borderLight,
              }}
            >
              <TouchableOpacity
                onPress={() => updateTask(task.id, { completed: true })}
                style={{ width: 18, height: 18, borderRadius: 9, borderWidth: 1.5, borderColor: tokens.border }}
              />
              <ThemedText variant="body" style={{ flex: 1 }}>{task.title}</ThemedText>
              <ThemedText variant="metadata" style={{ color: tokens.textSecondary }}>›</ThemedText>
            </TouchableOpacity>
          ))}

          {completedTasks.map((task) => (
            <TouchableOpacity
              key={task.id}
              onPress={() => router.push(`/tasks/${task.id}`)}
              style={{
                flexDirection: "row", alignItems: "center", gap: 10,
                paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: tokens.borderLight, opacity: 0.6,
              }}
            >
              <View style={{
                width: 18, height: 18, borderRadius: 9,
                borderWidth: 1.5, borderColor: tokens.accent, backgroundColor: tokens.accent,
                alignItems: "center", justifyContent: "center",
              }}>
                <ThemedText style={{ color: tokens.textInverse, fontSize: 10 }}>✓</ThemedText>
              </View>
              <ThemedText variant="body" style={{ flex: 1, textDecorationLine: "line-through", color: tokens.textSecondary }}>
                {task.title}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        <Separator />

        {/* Material */}
        <MaterialSection
          links={links}
          onAdd={handleAddLink}
          onRemove={handleRemoveLink}
        />

        <Separator />

        <ThemedText variant="metadata" style={{ color: tokens.borderLight }}>
          Creada {formatDate(activity.createdAt)}
        </ThemedText>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        onPress={() => router.push({ pathname: "/tasks/create", params: { activityId: id } })}
        style={{
          position: "absolute", bottom: insets.bottom + 16, right: 16,
          width: 48, height: 48, borderRadius: 24,
          backgroundColor: tokens.textPrimary,
          alignItems: "center", justifyContent: "center", elevation: 4,
        }}
      >
        <ThemedText style={{ color: tokens.textInverse, fontSize: 24 }}>+</ThemedText>
      </TouchableOpacity>

      {/* Project picker */}
      <BottomSheet visible={projectSheetVisible} onClose={() => setProjectSheetVisible(false)}>
        <ThemedText variant="card" style={{ marginBottom: 8 }}>Mover a proyecto</ThemedText>
        {currentProject && (
          <TouchableOpacity
            onPress={() => handleMoveToProject(null)}
            style={{ paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: tokens.borderLight }}
          >
            <ThemedText variant="body" style={{ color: tokens.destructive }}>✕ Sin proyecto</ThemedText>
          </TouchableOpacity>
        )}
        {projects.length === 0 && (
          <ThemedText variant="body" style={{ color: tokens.textSecondary }}>
            No hay proyectos para esta materia.
          </ThemedText>
        )}
        {projects.map((p) => (
          <TouchableOpacity
            key={p.id}
            onPress={() => handleMoveToProject(p.id)}
            style={{ paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: tokens.borderLight }}
          >
            <ThemedText variant="body" style={{ color: activity.projectId === p.id ? tokens.accent : tokens.textPrimary }}>
              📁 {p.name}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </BottomSheet>
    </View>
  );
}
