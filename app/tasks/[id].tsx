import { useState } from "react";
import { View, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/hooks/useTheme";
import { ThemedText, Separator, MaterialSection, BottomSheet, DatePickerModal } from "@/components/ui";
import { FontFamily, FontSize } from "@/theme/typography";
import { useTaskStore } from "@/stores/taskStore";
import { useActivityStore } from "@/stores/activityStore";
import { useCourseStore } from "@/stores/courseStore";
import { courseColors } from "@/theme/tokens";
import { formatDate, dueDateStatus } from "@/utils/dateUtils";
import { useSmartBack } from "@/hooks/useSmartBack";
import { MaterialLink } from "@/types/entities";

export default function TaskViewScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const tokens = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const task = useTaskStore((s) => s.getById(id));
  const updateTask = useTaskStore((s) => s.update);
  const [notesSheetVisible, setNotesSheetVisible] = useState(false);
  const [notesEdit, setNotesEdit] = useState("");
  const [titleSheetVisible, setTitleSheetVisible] = useState(false);
  const [titleEdit, setTitleEdit] = useState("");
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [activitySheetVisible, setActivitySheetVisible] = useState(false);
  const activities = useActivityStore((s) => s.activities);
  const removeTask = useTaskStore((s) => s.remove);
  const activity = useActivityStore((s) => s.activities.find((a) => a.id === task?.activityId));
  const courses = useCourseStore((s) => s.courses);
  const course = courses.find((c) => c.id === activity?.courseId);
  const goBack = useSmartBack(activity ? `/activities/${activity.id}` : "/(tabs)/activities");

  if (!task) {
    return (
      <View style={{ flex: 1, backgroundColor: tokens.background, alignItems: "center", justifyContent: "center" }}>
        <ThemedText variant="body" style={{ color: tokens.textSecondary }}>
          {t("tasks.notFound")}
        </ThemedText>
      </View>
    );
  }

  const colors = course ? courseColors[course.color] : null;
  const inheritedLinks: MaterialLink[] = activity?.links ?? [];
  const ownLinks: MaterialLink[] = task.links ?? [];

  async function handleDelete() {
    await removeTask(task!.id);
    goBack();
  }

  async function handleAddLink(link: MaterialLink) {
    await updateTask(id, { links: [...ownLinks, link] });
  }

  async function handleRemoveLink(index: number) {
    await updateTask(id, { links: ownLinks.filter((_, i) => i !== index) });
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
          <ThemedText variant="body" style={{ color: tokens.textSecondary }}>
            {t("common.back")}
          </ThemedText>
        </TouchableOpacity>
        <View style={{ flexDirection: "row", gap: 16, alignItems: "center" }}>
          <TouchableOpacity onPress={handleDelete}>
            <ThemedText variant="body" style={{ color: tokens.destructive }}>
              {t("common.delete")}
            </ThemedText>
          </TouchableOpacity>
        </View>
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
              margin: "auto",
            }}
          >
            {task.completed && <ThemedText style={{ color: tokens.textInverse, fontSize: 12 }}>✓</ThemedText>}
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
          <TouchableOpacity onPress={() => { setTitleEdit(task.title); setTitleSheetVisible(true); }}>
            <ThemedText variant="body">✏️</ThemedText>
          </TouchableOpacity>
        </View>

        <Separator />

        {/* Parent activity */}
        <View style={{ gap: 6 }}>
          {/* Fila: materia (izq) — fecha de realización (der) */}
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            {course ? (
              <TouchableOpacity onPress={() => router.push(`/courses/${course.id}`)}>
                <ThemedText variant="metadata" style={{ color: colors?.accent ?? tokens.accent, paddingLeft: 4 }}>
                  🏫 {course.name} ›
                </ThemedText>
              </TouchableOpacity>
            ) : (
              <View />
            )}
            <TouchableOpacity onPress={() => setDatePickerVisible(true)}>
              <ThemedText variant="metadata" style={{ color: task.dueDate ? (dueDateStatus(task.dueDate) === "overdue" ? tokens.destructive : dueDateStatus(task.dueDate) === "today" ? tokens.warning : tokens.textBody) : tokens.textSecondary }}>
                {task.dueDate ? `🗓 ${formatDate(task.dueDate)}` : t("common.scheduleTask")}
              </ThemedText>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "row", alignItems: "stretch", gap: 8 }}>
            {/* Botón cambiar actividad — solo si tiene actividad */}
            {activity && (
              <TouchableOpacity
                onPress={() => setActivitySheetVisible(true)}
                style={{
                  justifyContent: "center",
                  paddingHorizontal: 8,
                  backgroundColor: tokens.surfaceAlt,
                  borderRadius: 8,
                }}
              >
                <ThemedText style={{ fontSize: 18, color: tokens.textSecondary }}>↻</ThemedText>
              </TouchableOpacity>
            )}

            {/* Card actividad → navega si tiene, asigna si no */}
            <TouchableOpacity
              onPress={() => activity ? router.push(`/activities/${activity.id}`) : setActivitySheetVisible(true)}
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                backgroundColor: tokens.surface,
                borderRadius: 8,
                padding: 12,
                borderLeftWidth: 3,
                borderLeftColor: colors?.accent ?? tokens.accent,
              }}
            >
              <ThemedText variant="body" style={{ flex: 1 }}>
                {activity ? `📋 ${activity.name}` : t("tasks.noActivity")}
              </ThemedText>
              {activity && (
                <ThemedText variant="metadata" style={{ color: tokens.textSecondary }}>›</ThemedText>
              )}
            </TouchableOpacity>
          </View>

          {activity?.dueDate && (
            <ThemedText variant="metadata" style={{ color: dueDateStatus(activity.dueDate) === "overdue" ? tokens.destructive : dueDateStatus(activity.dueDate) === "today" ? tokens.warning : tokens.textSecondary, paddingLeft: 4 }}>
              {t("tasks.activityDue", { date: formatDate(activity.dueDate) })}
            </ThemedText>
          )}
        </View>

        <Separator />

        {/* Inherited material from activity (readonly) */}
        {inheritedLinks.length > 0 && (
          <>
            <MaterialSection links={inheritedLinks} readonlyLabel="de la actividad" />
            <Separator />
          </>
        )}

        {/* Task's own material */}
        <MaterialSection links={ownLinks} onAdd={handleAddLink} onRemove={handleRemoveLink} />

        <Separator />

        <TouchableOpacity
          onPress={() => {
            setNotesEdit(task.notes ?? "");
            setNotesSheetVisible(true);
          }}
          style={{ backgroundColor: tokens.surfaceAlt, borderRadius: 8, padding: 12, gap: 4 }}
        >
          <ThemedText variant="metadata" style={{ color: tokens.textSecondary }}>
            📓 {t("common.notes")}
          </ThemedText>
          {task.notes ? (
            <ThemedText variant="body">{task.notes}</ThemedText>
          ) : (
            <ThemedText variant="body" style={{ color: tokens.textSecondary, fontStyle: "italic" }}>
              {t("common.tapToAddNotes")}
            </ThemedText>
          )}
        </TouchableOpacity>
        <Separator />
        <ThemedText variant="metadata" style={{ color: tokens.borderLight }}>
          {t("common.created")} {formatDate(task.createdAt)}
        </ThemedText>
      </ScrollView>
      <BottomSheet visible={activitySheetVisible} onClose={() => setActivitySheetVisible(false)}>
        <ThemedText variant="card" style={{ marginBottom: 8 }}>{t("tasks.changeActivity")}</ThemedText>
        <TouchableOpacity
          onPress={() => { updateTask(id, { activityId: undefined }); setActivitySheetVisible(false); }}
          style={{ paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: tokens.borderLight }}
        >
          <ThemedText variant="body" style={{ color: !task.activityId ? tokens.accent : tokens.textSecondary, fontStyle: "italic" }}>
            {t("common.noActivity")}
          </ThemedText>
        </TouchableOpacity>
        {activities.map((a) => {
          const c = courses.find((c) => c.id === a.courseId);
          return (
            <TouchableOpacity
              key={a.id}
              onPress={() => { updateTask(id, { activityId: a.id }); setActivitySheetVisible(false); }}
              style={{ paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: tokens.borderLight, gap: 2 }}
            >
              <ThemedText variant="body" style={{ color: task.activityId === a.id ? tokens.accent : tokens.textPrimary }}>
                {a.name}
              </ThemedText>
              {c && <ThemedText variant="metadata" style={{ color: tokens.textSecondary }}>{c.name}</ThemedText>}
            </TouchableOpacity>
          );
        })}
      </BottomSheet>

      <DatePickerModal
        visible={datePickerVisible}
        value={task.dueDate || undefined}
        onConfirm={(d) => {
          updateTask(id, { dueDate: d });
          setDatePickerVisible(false);
        }}
        onCancel={() => setDatePickerVisible(false)}
      />

      <BottomSheet visible={titleSheetVisible} onClose={() => setTitleSheetVisible(false)}>
        <ThemedText variant="card" style={{ marginBottom: 8 }}>Editar título</ThemedText>
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
              updateTask(id, { title: titleEdit.trim() });
              setTitleSheetVisible(false);
            }
          }}
          style={{
            marginTop: 12,
            backgroundColor: tokens.textPrimary,
            borderRadius: 8,
            paddingVertical: 12,
            alignItems: "center",
          }}
        >
          <ThemedText variant="body" style={{ color: tokens.textInverse }}>Guardar</ThemedText>
        </TouchableOpacity>
      </BottomSheet>

      <BottomSheet visible={notesSheetVisible} onClose={() => setNotesSheetVisible(false)}>
        <ThemedText variant="card" style={{ marginBottom: 8 }}>
          Notas
        </ThemedText>
        <TextInput
          value={notesEdit}
          onChangeText={setNotesEdit}
          placeholder="Escribe tus notas aquí..."
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
            minHeight: 120,
            textAlignVertical: "top",
          }}
        />
        <TouchableOpacity
          onPress={() => {
            updateTask(id, { notes: notesEdit.trim() || undefined });
            setNotesSheetVisible(false);
          }}
          style={{
            marginTop: 12,
            backgroundColor: tokens.textPrimary,
            borderRadius: 8,
            paddingVertical: 12,
            alignItems: "center",
          }}
        >
          <ThemedText variant="body" style={{ color: tokens.textInverse }}>
            Guardar
          </ThemedText>
        </TouchableOpacity>
      </BottomSheet>
    </View>
  );
}
