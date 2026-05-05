import { useState } from "react";
import { View, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/hooks/useTheme";
import { ThemedText, Separator, BottomSheet, DatePickerModal, MaterialSection } from "@/components/ui";
import { useTaskStore } from "@/stores/taskStore";
import { useActivityStore } from "@/stores/activityStore";
import { useCourseStore } from "@/stores/courseStore";
import { courseColors } from "@/theme/tokens";
import { FontFamily, FontSize } from "@/theme/typography";
import { formatDate } from "@/utils/dateUtils";
import { useSmartBack } from "@/hooks/useSmartBack";
import { MaterialLink } from "@/types/entities";

export default function TaskCreateScreen() {
  const { t } = useTranslation();
  const tokens = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { activityId: preselectedActivityId, editId } = useLocalSearchParams<{ activityId?: string; editId?: string }>();
  const isEdit = !!editId;

  const addTask = useTaskStore((s) => s.add);
  const updateTask = useTaskStore((s) => s.update);
  const existing = useTaskStore((s) => s.tasks.find((t) => t.id === editId));
  const activities = useActivityStore((s) => s.activities);
  const courses = useCourseStore((s) => s.courses);

  const [title, setTitle] = useState(existing?.title ?? "");
  const [notes, setNotes] = useState(existing?.notes ?? "");
  const [dueDate, setDueDate] = useState(existing?.dueDate ?? "");
  const [selectedActivityId, setSelectedActivityId] = useState<string | undefined>(
    existing?.activityId ?? preselectedActivityId
  );
  const goBack = useSmartBack(preselectedActivityId ? `/activities/${preselectedActivityId}` : "/(tabs)/activities");
  const [activitySheetVisible, setActivitySheetVisible] = useState(false);
  const [notesSheetVisible, setNotesSheetVisible] = useState(false);
  const [notesEdit, setNotesEdit] = useState("");
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [links, setLinks] = useState<MaterialLink[]>(existing?.links ?? []);

  const selectedActivity = activities.find((a) => a.id === selectedActivityId);
  const selectedCourse = courses.find((c) => c.id === selectedActivity?.courseId);
  const colors = selectedCourse ? courseColors[selectedCourse.color] : null;

  const canSave = title.trim().length > 0;

  async function handleSave() {
    if (!canSave) return;
    if (isEdit && editId) {
      await updateTask(editId, {
        title: title.trim(),
        notes: notes.trim() || undefined,
        dueDate: dueDate || undefined,
        activityId: selectedActivityId,
        links,
      });
    } else {
      const existingTasks = useTaskStore.getState().tasks.filter((t) => t.activityId === selectedActivityId);
      await addTask({
        activityId: selectedActivityId,
        title: title.trim(),
        completed: false,
        order: existingTasks.length,
        notes: notes.trim() || undefined,
        dueDate: dueDate || undefined,
        links,
      });
    }
    goBack();
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
          <ThemedText variant="body" style={{ color: tokens.textSecondary }}>{t("common.cancel")}</ThemedText>
        </TouchableOpacity>
        <ThemedText variant="card">{isEdit ? t("tasks.edit") : t("tasks.create")}</ThemedText>
        <TouchableOpacity onPress={handleSave} disabled={!canSave}>
          <ThemedText variant="body" style={{ color: canSave ? tokens.accent : tokens.border }}>
            {isEdit ? t("common.save") : t("common.create")}
          </ThemedText>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
      <ScrollView
        contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Título */}
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder={t("tasks.namePlaceholder")}
          placeholderTextColor={tokens.textSecondary}
          autoFocus={!isEdit}
          style={{
            color: tokens.textPrimary,
            fontFamily: FontFamily.caveatBold,
            fontSize: FontSize.title,
          }}
        />

        <Separator />

        {/* Actividad */}
        <View style={{ gap: 6 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            {selectedCourse ? (
              <ThemedText variant="metadata" style={{ color: colors?.accent ?? tokens.accent, paddingLeft: 4 }}>
                🏫 {selectedCourse.name}
              </ThemedText>
            ) : <View />}
            <TouchableOpacity onPress={() => setDatePickerVisible(true)}>
              <ThemedText variant="metadata" style={{ color: dueDate ? tokens.textBody : tokens.textSecondary }}>
                {dueDate ? `🗓 ${formatDate(dueDate)}` : t("common.scheduleTask")}
              </ThemedText>
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: "row", alignItems: "stretch", gap: 8 }}>
            {selectedActivity && (
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

            <TouchableOpacity
              onPress={() => setActivitySheetVisible(true)}
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                backgroundColor: tokens.surface,
                borderRadius: 8,
                padding: 12,
                borderLeftWidth: 3,
                borderLeftColor: colors?.accent ?? tokens.borderLight,
              }}
            >
              <ThemedText variant="body" style={{ flex: 1, color: selectedActivity ? tokens.textPrimary : tokens.textSecondary }}>
                {selectedActivity ? `📋 ${selectedActivity.name}` : `📋 ${t("common.selectActivity")}`}
              </ThemedText>
              <ThemedText variant="metadata" style={{ color: tokens.textSecondary }}>›</ThemedText>
            </TouchableOpacity>
          </View>

          {selectedActivity?.dueDate && (
            <ThemedText variant="metadata" style={{ color: tokens.textSecondary, paddingLeft: 4 }}>
              {t("tasks.activityDue", { date: formatDate(selectedActivity.dueDate) })}
            </ThemedText>
          )}
        </View>

        <Separator />

        {/* Material heredado de la actividad (readonly) */}
        {(selectedActivity?.links ?? []).length > 0 && (
          <>
            <MaterialSection links={selectedActivity!.links!} readonlyLabel="de la actividad" />
            <Separator />
          </>
        )}

        {/* Material propio */}
        <MaterialSection
          links={links}
          onAdd={(link) => setLinks((prev) => [...prev, link])}
          onRemove={(i) => setLinks((prev) => prev.filter((_, idx) => idx !== i))}
        />

        <Separator />

        {/* Notas */}
        <TouchableOpacity
          onPress={() => { setNotesEdit(notes); setNotesSheetVisible(true); }}
          style={{ backgroundColor: tokens.surfaceAlt, borderRadius: 8, padding: 12, gap: 4 }}
        >
          <ThemedText variant="metadata" style={{ color: tokens.textSecondary }}>📓 {t("common.notes")}</ThemedText>
          {notes ? (
            <ThemedText variant="body">{notes}</ThemedText>
          ) : (
            <ThemedText variant="body" style={{ color: tokens.textSecondary, fontStyle: "italic" }}>
              {t("common.tapToAddNotes")}
            </ThemedText>
          )}
        </TouchableOpacity>
      </ScrollView>
      </KeyboardAvoidingView>

      {/* Activity picker */}
      <BottomSheet visible={activitySheetVisible} onClose={() => setActivitySheetVisible(false)}>
        <ThemedText variant="card" style={{ marginBottom: 8 }}>{t("tasks.selectActivity")}</ThemedText>
        <TouchableOpacity
          onPress={() => { setSelectedActivityId(undefined); setActivitySheetVisible(false); }}
          style={{ paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: tokens.borderLight }}
        >
          <ThemedText variant="body" style={{ color: !selectedActivityId ? tokens.accent : tokens.textSecondary, fontStyle: "italic" }}>
            {t("common.noActivity")}
          </ThemedText>
        </TouchableOpacity>
        {activities.map((a) => {
            const course = courses.find((c) => c.id === a.courseId);
            return (
              <TouchableOpacity
                key={a.id}
                onPress={() => { setSelectedActivityId(a.id); setActivitySheetVisible(false); }}
                style={{ paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: tokens.borderLight, gap: 2 }}
              >
                <ThemedText variant="body" style={{ color: selectedActivityId === a.id ? tokens.accent : tokens.textPrimary }}>
                  {a.name}
                </ThemedText>
                {course && (
                  <ThemedText variant="metadata" style={{ color: tokens.textSecondary }}>{course.name}</ThemedText>
                )}
              </TouchableOpacity>
            );
        })}
      </BottomSheet>

      {/* Notes editor */}
      <BottomSheet visible={notesSheetVisible} onClose={() => setNotesSheetVisible(false)}>
        <ThemedText variant="card" style={{ marginBottom: 8 }}>{t("tasks.notesTitle")}</ThemedText>
        <TextInput
          value={notesEdit}
          onChangeText={setNotesEdit}
          placeholder={t("common.writeNotes")}
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
          onPress={() => { setNotes(notesEdit.trim()); setNotesSheetVisible(false); }}
          style={{
            marginTop: 12,
            backgroundColor: tokens.textPrimary,
            borderRadius: 8,
            paddingVertical: 12,
            alignItems: "center",
          }}
        >
          <ThemedText variant="body" style={{ color: tokens.textInverse }}>{t("common.done")}</ThemedText>
        </TouchableOpacity>
      </BottomSheet>

      <DatePickerModal
        visible={datePickerVisible}
        value={dueDate || undefined}
        onConfirm={(d) => { setDueDate(d); setDatePickerVisible(false); }}
        onCancel={() => setDatePickerVisible(false)}
      />
    </View>
  );
}
