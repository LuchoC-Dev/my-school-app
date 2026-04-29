import { View, ScrollView, TouchableOpacity, Text } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useShallow } from "zustand/react/shallow";
import { useTheme } from "@/hooks/useTheme";
import { useSmartBack } from "@/hooks/useSmartBack";
import { ThemedText, SectionLabel, Separator, EmptyState, MaterialSection } from "@/components/ui";
import { useProjectStore } from "@/stores/projectStore";
import { useActivityStore } from "@/stores/activityStore";
import { useCourseStore } from "@/stores/courseStore";
import { ActivityCard } from "@/components/activities/ActivityCard";
import { courseColors } from "@/theme/tokens";
import { formatDate } from "@/utils/dateUtils";
import { MaterialLink } from "@/types/entities";

export default function ProjectViewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const tokens = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const project = useProjectStore((s) => s.getById(id));
  const updateProject = useProjectStore((s) => s.update);
  const removeProject = useProjectStore((s) => s.remove);
  const activities = useActivityStore(useShallow((s) => s.activities.filter((a) => a.projectId === id)));
  const course = useCourseStore((s) => s.courses.find((c) => c.id === project?.courseId));
  const goBack = useSmartBack(project?.courseId ? `/courses/${project.courseId}` : "/(tabs)/");

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
  const links: MaterialLink[] = project.links ?? [];

  async function handleDelete() {
    await removeProject(id);
    goBack();
  }

  async function handleAddLink(link: MaterialLink) {
    await updateProject(id, { links: [...links, link] });
  }

  async function handleRemoveLink(index: number) {
    await updateProject(id, { links: links.filter((_, i) => i !== index) });
  }

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
        <TouchableOpacity onPress={() => goBack()}>
          <ThemedText variant="body" style={{ color: tokens.textSecondary }}>‹ Volver</ThemedText>
        </TouchableOpacity>
        <View style={{ flexDirection: "row", gap: 16, alignItems: "center" }}>
          <TouchableOpacity onPress={() => router.push({ pathname: "/projects/create", params: { editId: id } })}>
            <ThemedText variant="body">✏️</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete}>
            <ThemedText variant="body" style={{ color: tokens.destructive }}>Eliminar</ThemedText>
          </TouchableOpacity>
        </View>
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

        <Separator />

        <MaterialSection
          links={links}
          onAdd={handleAddLink}
          onRemove={handleRemoveLink}
        />

        <Separator />

        <ThemedText variant="metadata" style={{ color: tokens.borderLight }}>
          Creado {formatDate(project.createdAt)}
        </ThemedText>
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
