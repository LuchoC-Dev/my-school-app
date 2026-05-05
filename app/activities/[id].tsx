import { useState } from "react";
import { View, ScrollView, TouchableOpacity, Text, TextInput } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useShallow } from "zustand/react/shallow";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/hooks/useTheme";
import { useSmartBack } from "@/hooks/useSmartBack";
import { ThemedText, SectionLabel, Separator, EmptyState, ProgressBar, BottomSheet, MaterialSection, DatePickerModal } from "@/components/ui";
import { useActivityStore } from "@/stores/activityStore";
import { useTaskStore } from "@/stores/taskStore";
import { useCourseStore } from "@/stores/courseStore";
import { useProjectStore } from "@/stores/projectStore";
import { courseColors } from "@/theme/tokens";
import { formatDate, dueDateStatus } from "@/utils/dateUtils";
import { MaterialLink, ActivityType } from "@/types/entities";
import { FontFamily, FontSize } from "@/theme/typography";

export default function ActivityViewScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const tokens = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [projectSheetVisible, setProjectSheetVisible] = useState(false);
  const [titleSheetVisible, setTitleSheetVisible] = useState(false);
  const [titleEdit, setTitleEdit] = useState("");
  const [descSheetVisible, setDescSheetVisible] = useState(false);
  const [descEdit, setDescEdit] = useState("");
  const [typeSheetVisible, setTypeSheetVisible] = useState(false);
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  const activity = useActivityStore((s) => s.activities.find((a) => a.id === id));
  const updateActivity = useActivityStore((s) => s.update);
  const removeActivity = useActivityStore((s) => s.remove);
  const tasks = useTaskStore(useShallow((s) => s.tasks.filter((t) => t.activityId === id)));
  const updateTask = useTaskStore((s) => s.update);
  const course = useCourseStore((s) => s.courses.find((c) => c.id === activity?.courseId));
  const courseId = activity?.courseId ?? "";
  const goBack = useSmartBack(courseId ? `/courses/${courseId}` : "/(tabs)/activities");
  const projects = useProjectStore(useShallow((s) => s.projects.filter((p) => p.courseId === courseId)));
  const currentProject = useProjectStore((s) => s.projects.find((p) => p.id === activity?.projectId));

  const TYPE_LABELS: Record<string, string> = {
    assignment: t("activities.types.assignment"),
    exam: t("activities.types.exam"),
    project: t("activities.types.project"),
    reading: t("activities.types.reading"),
    other: t("activities.types.other"),
  };

  const ACTIVITY_TYPES: { value: ActivityType; label: string }[] = [
    { value: "assignment", label: t("activities.types.assignment") },
    { value: "exam", label: t("activities.types.exam") },
    { value: "project", label: t("activities.types.project") },
    { value: "reading", label: t("activities.types.reading") },
    { value: "other", label: t("activities.types.other") },
  ];

  if (!activity) {
    return (
      <View style={{ flex: 1, backgroundColor: tokens.background, alignItems: "center", justifyContent: "center" }}>
        <ThemedText variant="body" style={{ color: tokens.textSecondary }}>{t("activities.notFound")}</ThemedText>
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
    goBack();
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

  const dueDateColor = activity.dueDate
    ? dueDateStatus(activity.dueDate) === "overdue"
      ? tokens.destructive
      : dueDateStatus(activity.dueDate) === "today"
      ? tokens.warning
      : tokens.textSecondary
    : tokens.textSecondary;

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
          <ThemedText variant="body" style={{ color: tokens.textSecondary }}>{t("common.back")}</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDelete}>
          <ThemedText variant="body" style={{ color: tokens.destructive }}>{t("activities.delete")}</ThemedText>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 80 }}>
        {/* Title row */}
        <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12 }}>
          <ThemedText
            variant="title"
            style={{ flex: 1, textDecorationLine: isCompleted ? "line-through" : "none", color: isCompleted ? tokens.textSecondary : tokens.textPrimary }}
          >
            {activity.name}
          </ThemedText>
          <TouchableOpacity onPress={() => { setTitleEdit(activity.name); setTitleSheetVisible(true); }}>
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
            <ThemedText variant="metadata" style={{ color: activity.dueDate ? dueDateColor : tokens.textSecondary }}>
              {activity.dueDate ? `🗓 ${formatDate(activity.dueDate)}` : t("common.schedule")}
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* Type + project row */}
        <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
          <TouchableOpacity
            onPress={() => setTypeSheetVisible(true)}
            style={{ borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3, backgroundColor: tokens.surfaceAlt, flexDirection: "row", gap: 4, alignItems: "center" }}
          >
            <ThemedText variant="metadata" style={{ color: tokens.textSecondary }}>
              {TYPE_LABELS[activity.type] ?? activity.type}
            </ThemedText>
            <ThemedText variant="metadata" style={{ color: tokens.textSecondary, fontSize: 10 }}>▾</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setProjectSheetVisible(true)}
            style={{
              borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3,
              borderWidth: 1,
              borderColor: currentProject ? tokens.accent : tokens.border,
              borderStyle: currentProject ? "solid" : "dashed",
            }}
          >
            <ThemedText variant="metadata" style={{ color: currentProject ? tokens.accent : tokens.textSecondary }}>
              {currentProject ? `📁 ${currentProject.name} ›` : `📁 ${t("common.assignToProject")}`}
            </ThemedText>
          </TouchableOpacity>
        </View>

        <Separator />

        {/* Description block */}
        <TouchableOpacity
          onPress={() => { setDescEdit(activity.description ?? ""); setDescSheetVisible(true); }}
          style={{ backgroundColor: tokens.surfaceAlt, borderRadius: 8, padding: 12, gap: 4 }}
        >
          <ThemedText variant="metadata" style={{ color: tokens.textSecondary }}>📝 {t("common.description")}</ThemedText>
          {activity.description ? (
            <ThemedText variant="body">{activity.description}</ThemedText>
          ) : (
            <ThemedText variant="body" style={{ color: tokens.textSecondary, fontStyle: "italic" }}>
              {t("common.tapToAddDescription")}
            </ThemedText>
          )}
        </TouchableOpacity>

        <Separator />

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
            {isCompleted ? t("activities.markPending") : t("activities.markCompleted")}
          </ThemedText>
        </TouchableOpacity>

        <Separator />

        {/* Progress */}
        {tasks.length > 0 && (
          <View style={{ gap: 6 }}>
            <ThemedText variant="metadata" style={{ color: tokens.textSecondary }}>
              {t("activities.tasksCompleted", { completed: completedTasks.length, total: tasks.length })}
            </ThemedText>
            <ProgressBar progress={activity.progress} accentColor={colors?.accent} />
          </View>
        )}

        {/* Tasks */}
        <View style={{ gap: 6 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <SectionLabel>{t("tasks.tabLabel")}</SectionLabel>
            <TouchableOpacity onPress={() => router.push({ pathname: "/tasks/create", params: { activityId: id } })}>
              <ThemedText variant="metadata" style={{ color: tokens.accent }}>{t("activities.new")}</ThemedText>
            </TouchableOpacity>
          </View>

          {tasks.length === 0 && (
            <EmptyState
              icon={<Text style={{ fontSize: 28 }}>☑️</Text>}
              title={t("activities.noTasks")}
              description={t("activities.noTasksDesc")}
              ctaLabel={t("activities.newTask")}
              onCta={() => router.push({ pathname: "/tasks/create", params: { activityId: id } })}
            />
          )}

          {pendingTasks.map((task) => (
            <TouchableOpacity
              key={task.id}
              onPress={() => router.push(`/tasks/${task.id}`)}
              style={{ flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: tokens.borderLight }}
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
              style={{ flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: tokens.borderLight, opacity: 0.6 }}
            >
              <View style={{ width: 18, height: 18, borderRadius: 9, borderWidth: 1.5, borderColor: tokens.accent, backgroundColor: tokens.accent, alignItems: "center", justifyContent: "center" }}>
                <ThemedText style={{ color: tokens.textInverse, fontSize: 10 }}>✓</ThemedText>
              </View>
              <ThemedText variant="body" style={{ flex: 1, textDecorationLine: "line-through", color: tokens.textSecondary }}>{task.title}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        <Separator />

        {/* Material */}
        <MaterialSection links={links} onAdd={handleAddLink} onRemove={handleRemoveLink} />

        <Separator />

        <ThemedText variant="metadata" style={{ color: tokens.borderLight }}>
          {t("common.created")} {formatDate(activity.createdAt)}
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

      {/* Title editor */}
      <BottomSheet visible={titleSheetVisible} onClose={() => setTitleSheetVisible(false)}>
        <ThemedText variant="card" style={{ marginBottom: 8 }}>{t("common.editName")}</ThemedText>
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
              updateActivity(id, { name: titleEdit.trim() });
              setTitleSheetVisible(false);
            }
          }}
          style={{ marginTop: 12, backgroundColor: tokens.textPrimary, borderRadius: 8, paddingVertical: 12, alignItems: "center" }}
        >
          <ThemedText variant="body" style={{ color: tokens.textInverse }}>{t("common.save")}</ThemedText>
        </TouchableOpacity>
      </BottomSheet>

      {/* Type picker */}
      <BottomSheet visible={typeSheetVisible} onClose={() => setTypeSheetVisible(false)}>
        <ThemedText variant="card" style={{ marginBottom: 8 }}>{t("activities.typeTitle")}</ThemedText>
        {ACTIVITY_TYPES.map((t) => (
          <TouchableOpacity
            key={t.value}
            onPress={() => { updateActivity(id, { type: t.value }); setTypeSheetVisible(false); }}
            style={{ paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: tokens.borderLight }}
          >
            <ThemedText variant="body" style={{ color: activity.type === t.value ? tokens.accent : tokens.textPrimary }}>
              {t.label}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </BottomSheet>

      {/* Project picker */}
      <BottomSheet visible={projectSheetVisible} onClose={() => setProjectSheetVisible(false)}>
        <ThemedText variant="card" style={{ marginBottom: 8 }}>{t("common.moveToProject")}</ThemedText>
        {currentProject && (
          <TouchableOpacity
            onPress={() => handleMoveToProject(null)}
            style={{ paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: tokens.borderLight }}
          >
            <ThemedText variant="body" style={{ color: tokens.destructive }}>✕ {t("common.noProject")}</ThemedText>
          </TouchableOpacity>
        )}
        {projects.length === 0 && (
          <ThemedText variant="body" style={{ color: tokens.textSecondary }}>{t("common.noProjectsForCourse")}</ThemedText>
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

      {/* Description editor */}
      <BottomSheet visible={descSheetVisible} onClose={() => setDescSheetVisible(false)}>
        <ThemedText variant="card" style={{ marginBottom: 8 }}>{t("common.descriptionTitle")}</ThemedText>
        <TextInput
          value={descEdit}
          onChangeText={setDescEdit}
          placeholder={t("common.writeDescription")}
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
          onPress={() => { updateActivity(id, { description: descEdit.trim() || undefined }); setDescSheetVisible(false); }}
          style={{ marginTop: 12, backgroundColor: tokens.textPrimary, borderRadius: 8, paddingVertical: 12, alignItems: "center" }}
        >
          <ThemedText variant="body" style={{ color: tokens.textInverse }}>{t("common.save")}</ThemedText>
        </TouchableOpacity>
      </BottomSheet>

      {/* Date picker */}
      <DatePickerModal
        visible={datePickerVisible}
        value={activity.dueDate || undefined}
        onConfirm={(d) => { updateActivity(id, { dueDate: d }); setDatePickerVisible(false); }}
        onCancel={() => setDatePickerVisible(false)}
      />
    </View>
  );
}
