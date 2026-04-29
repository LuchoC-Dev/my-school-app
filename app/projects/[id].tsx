import { useState } from "react";
import { View, ScrollView, TouchableOpacity, Text, TextInput } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useShallow } from "zustand/react/shallow";
import { useTheme } from "@/hooks/useTheme";
import { useSmartBack } from "@/hooks/useSmartBack";
import { ThemedText, SectionLabel, Separator, EmptyState, MaterialSection, BottomSheet, DatePickerModal } from "@/components/ui";
import { useProjectStore } from "@/stores/projectStore";
import { useActivityStore } from "@/stores/activityStore";
import { useCourseStore } from "@/stores/courseStore";
import { ActivityCard } from "@/components/activities/ActivityCard";
import { courseColors } from "@/theme/tokens";
import { formatDate, dueDateStatus } from "@/utils/dateUtils";
import { MaterialLink } from "@/types/entities";
import { FontFamily, FontSize } from "@/theme/typography";

export default function ProjectViewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const tokens = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [titleSheetVisible, setTitleSheetVisible] = useState(false);
  const [titleEdit, setTitleEdit] = useState("");
  const [descSheetVisible, setDescSheetVisible] = useState(false);
  const [descEdit, setDescEdit] = useState("");
  const [datePickerVisible, setDatePickerVisible] = useState(false);

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

  const dueDateColor = project.dueDate
    ? dueDateStatus(project.dueDate) === "overdue" ? tokens.destructive
    : dueDateStatus(project.dueDate) === "today" ? tokens.warning
    : tokens.textSecondary
    : tokens.textSecondary;

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
        <TouchableOpacity onPress={() => goBack()}>
          <ThemedText variant="body" style={{ color: tokens.textSecondary }}>‹ Volver</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDelete}>
          <ThemedText variant="body" style={{ color: tokens.destructive }}>Eliminar</ThemedText>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 80 }}>
        {/* Title row */}
        <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12 }}>
          <ThemedText variant="title" style={{ flex: 1 }}>📁 {project.name}</ThemedText>
          <TouchableOpacity onPress={() => { setTitleEdit(project.name); setTitleSheetVisible(true); }}>
            <ThemedText variant="body">✏️</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Meta row: course (left) — date (right) */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          {course ? (
            <TouchableOpacity onPress={() => router.push(`/courses/${course.id}`)}>
              <ThemedText variant="metadata" style={{ color: colors?.accent ?? tokens.accent }}>
                🏫 {course.name} ›
              </ThemedText>
            </TouchableOpacity>
          ) : <View />}
          <TouchableOpacity onPress={() => setDatePickerVisible(true)}>
            <ThemedText variant="metadata" style={{ color: project.dueDate ? dueDateColor : tokens.textSecondary }}>
              {project.dueDate ? `🗓 ${formatDate(project.dueDate)}` : "+ Programar entrega"}
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* Description block */}
        <TouchableOpacity
          onPress={() => { setDescEdit(project.description ?? ""); setDescSheetVisible(true); }}
          style={{ backgroundColor: tokens.surfaceAlt, borderRadius: 8, padding: 12, gap: 4 }}
        >
          <ThemedText variant="metadata" style={{ color: tokens.textSecondary }}>📝 DESCRIPCIÓN</ThemedText>
          {project.description ? (
            <ThemedText variant="body">{project.description}</ThemedText>
          ) : (
            <ThemedText variant="body" style={{ color: tokens.textSecondary, fontStyle: "italic" }}>
              Tocar para agregar descripción...
            </ThemedText>
          )}
        </TouchableOpacity>

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
            onCta={() => router.push({ pathname: "/activities/create", params: { courseId: project.courseId } })}
          />
        )}

        <Separator />

        <MaterialSection links={links} onAdd={handleAddLink} onRemove={handleRemoveLink} />

        <Separator />

        <ThemedText variant="metadata" style={{ color: tokens.borderLight }}>
          Creado {formatDate(project.createdAt)}
        </ThemedText>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        onPress={() => router.push({ pathname: "/activities/create", params: { courseId: project.courseId } })}
        style={{
          position: "absolute", bottom: insets.bottom + 16, right: 16,
          width: 48, height: 48, borderRadius: 24,
          backgroundColor: tokens.textPrimary,
          alignItems: "center", justifyContent: "center", elevation: 4,
        }}
      >
        <ThemedText style={{ color: tokens.textInverse, fontSize: 24 }}>+</ThemedText>
      </TouchableOpacity>

      {/* Title editor */}
      <BottomSheet visible={titleSheetVisible} onClose={() => setTitleSheetVisible(false)}>
        <ThemedText variant="card" style={{ marginBottom: 8 }}>Editar nombre</ThemedText>
        <TextInput
          value={titleEdit}
          onChangeText={setTitleEdit}
          autoFocus
          style={{
            backgroundColor: tokens.surfaceAlt,
            borderRadius: 8,
            padding: 12,
            color: tokens.textPrimary,
            fontFamily: FontFamily.caveatBold,
            fontSize: FontSize.title,
          }}
        />
        <TouchableOpacity
          onPress={() => {
            if (titleEdit.trim()) {
              updateProject(id, { name: titleEdit.trim() });
              setTitleSheetVisible(false);
            }
          }}
          style={{ marginTop: 12, backgroundColor: tokens.textPrimary, borderRadius: 8, paddingVertical: 12, alignItems: "center" }}
        >
          <ThemedText variant="body" style={{ color: tokens.textInverse }}>Guardar</ThemedText>
        </TouchableOpacity>
      </BottomSheet>

      {/* Description editor */}
      <BottomSheet visible={descSheetVisible} onClose={() => setDescSheetVisible(false)}>
        <ThemedText variant="card" style={{ marginBottom: 8 }}>Descripción</ThemedText>
        <TextInput
          value={descEdit}
          onChangeText={setDescEdit}
          placeholder="Escribe una descripción..."
          placeholderTextColor={tokens.textSecondary}
          multiline
          autoFocus
          style={{
            backgroundColor: tokens.surfaceAlt,
            borderRadius: 8,
            padding: 12,
            color: tokens.textPrimary,
            fontFamily: FontFamily.caveatRegular,
            fontSize: FontSize.body,
            minHeight: 100,
            textAlignVertical: "top",
          }}
        />
        <TouchableOpacity
          onPress={() => {
            updateProject(id, { description: descEdit.trim() || undefined });
            setDescSheetVisible(false);
          }}
          style={{ marginTop: 12, backgroundColor: tokens.textPrimary, borderRadius: 8, paddingVertical: 12, alignItems: "center" }}
        >
          <ThemedText variant="body" style={{ color: tokens.textInverse }}>Guardar</ThemedText>
        </TouchableOpacity>
      </BottomSheet>

      {/* Date picker */}
      <DatePickerModal
        visible={datePickerVisible}
        value={project.dueDate || undefined}
        onConfirm={(d) => { updateProject(id, { dueDate: d }); setDatePickerVisible(false); }}
        onCancel={() => setDatePickerVisible(false)}
      />
    </View>
  );
}
