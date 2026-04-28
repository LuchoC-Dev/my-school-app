import { useState } from "react";
import { View, ScrollView, TextInput, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";
import { ThemedText, BottomSheet, SectionLabel, DatePickerModal } from "@/components/ui";
import { useTaskStore } from "@/stores/taskStore";
import { useActivityStore } from "@/stores/activityStore";
import { useCourseStore } from "@/stores/courseStore";
import { FontFamily, FontSize } from "@/theme/typography";
import { formatDate } from "@/utils/dateUtils";

export default function TaskCreateScreen() {
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
  const [activitySheetVisible, setActivitySheetVisible] = useState(false);
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  const selectedActivity = activities.find((a) => a.id === selectedActivityId);
  const selectedCourse = courses.find((c) => c.id === selectedActivity?.courseId);

  const canSave = title.trim().length > 0 && !!selectedActivityId;

  async function handleSave() {
    if (!canSave) return;
    if (isEdit && editId) {
      await updateTask(editId, {
        title: title.trim(),
        notes: notes.trim() || undefined,
        dueDate: dueDate || undefined,
      });
    } else {
      const existingTasks = useTaskStore
        .getState()
        .tasks.filter((t) => t.activityId === selectedActivityId);
      await addTask({
        activityId: selectedActivityId!,
        title: title.trim(),
        completed: false,
        order: existingTasks.length,
        notes: notes.trim() || undefined,
        dueDate: dueDate || undefined,
      });
    }
    router.back();
  }

  const inputStyle = {
    borderWidth: 1.5,
    borderColor: tokens.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: tokens.surface,
    color: tokens.textPrimary,
    fontFamily: FontFamily.caveatRegular,
    fontSize: FontSize.body,
  };

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
          backgroundColor: tokens.background,
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <ThemedText variant="body" style={{ color: tokens.textSecondary }}>Cancelar</ThemedText>
        </TouchableOpacity>
        <ThemedText variant="card">{isEdit ? "Editar task" : "Nueva task"}</ThemedText>
        <TouchableOpacity onPress={handleSave} disabled={!canSave}>
          <ThemedText variant="body" style={{ color: canSave ? tokens.accent : tokens.border }}>
            {isEdit ? "Guardar" : "Crear"}
          </ThemedText>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Nombre de la task..."
          placeholderTextColor={tokens.textSecondary}
          style={[inputStyle, { fontSize: FontSize.card }]}
          autoFocus={!isEdit}
        />

        {/* Activity selector */}
        <View style={{ gap: 6 }}>
          <SectionLabel>Actividad</SectionLabel>
          <TouchableOpacity
            onPress={() => !isEdit && setActivitySheetVisible(true)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              borderWidth: 1.5,
              borderStyle: selectedActivityId ? "solid" : "dashed",
              borderColor: selectedActivityId ? tokens.accent : tokens.border,
              borderRadius: 999,
              paddingHorizontal: 12,
              paddingVertical: 6,
              alignSelf: "flex-start",
              backgroundColor: selectedActivityId ? tokens.accentLight : "transparent",
            }}
          >
            <ThemedText
              variant="metadata"
              style={{ color: selectedActivityId ? tokens.accent : tokens.textSecondary }}
            >
              {selectedActivity ? `📋 ${selectedActivity.name}` : "📋 Actividad... ›"}
            </ThemedText>
          </TouchableOpacity>
          {selectedCourse && (
            <ThemedText variant="metadata" style={{ color: tokens.textSecondary, paddingLeft: 4 }}>
              🏫 {selectedCourse.name}
            </ThemedText>
          )}
          {selectedActivity?.dueDate && (
            <ThemedText variant="metadata" style={{ color: tokens.textSecondary, paddingLeft: 4 }}>
              🗓 Actividad vence {formatDate(selectedActivity.dueDate)}
            </ThemedText>
          )}
        </View>

        {/* Execution date */}
        <View style={{ gap: 6 }}>
          <SectionLabel>¿Cuándo realizarla? (opcional)</SectionLabel>
          <TouchableOpacity
            onPress={() => setDatePickerVisible(true)}
            style={{
              borderWidth: 1.5,
              borderStyle: dueDate ? "solid" : "dashed",
              borderColor: dueDate ? tokens.accent : tokens.border,
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 8,
              backgroundColor: tokens.surface,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <ThemedText variant="body" style={{ color: dueDate ? tokens.textPrimary : tokens.textSecondary }}>
              {dueDate ? `🗓 ${formatDate(dueDate)}` : "🗓 Elegir fecha..."}
            </ThemedText>
            {dueDate ? (
              <TouchableOpacity onPress={() => setDueDate("")}>
                <ThemedText variant="body" style={{ color: tokens.textSecondary }}>✕</ThemedText>
              </TouchableOpacity>
            ) : (
              <ThemedText variant="body" style={{ color: tokens.textSecondary }}>›</ThemedText>
            )}
          </TouchableOpacity>
        </View>

        {/* Notes */}
        <View style={{ gap: 6 }}>
          <SectionLabel>Notas (opcional)</SectionLabel>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Agregar notas..."
            placeholderTextColor={tokens.textSecondary}
            style={[inputStyle, { height: 80, paddingTop: 10, textAlignVertical: "top", borderStyle: "dashed" }]}
            multiline
          />
        </View>
      </ScrollView>

      <BottomSheet visible={activitySheetVisible} onClose={() => setActivitySheetVisible(false)}>
        <View style={{ gap: 4 }}>
          <ThemedText variant="card" style={{ marginBottom: 8 }}>Seleccionar actividad</ThemedText>
          {activities.length === 0 ? (
            <ThemedText variant="body" style={{ color: tokens.textSecondary }}>
              No hay actividades. Creá una primero.
            </ThemedText>
          ) : (
            activities.map((a) => {
              const course = courses.find((c) => c.id === a.courseId);
              return (
                <TouchableOpacity
                  key={a.id}
                  onPress={() => {
                    setSelectedActivityId(a.id);
                    setActivitySheetVisible(false);
                  }}
                  style={{
                    paddingVertical: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: tokens.borderLight,
                    gap: 2,
                  }}
                >
                  <ThemedText
                    variant="body"
                    style={{ color: selectedActivityId === a.id ? tokens.accent : tokens.textPrimary }}
                  >
                    {a.name}
                  </ThemedText>
                  {course && (
                    <ThemedText variant="metadata" style={{ color: tokens.textSecondary }}>
                      {course.name}
                    </ThemedText>
                  )}
                </TouchableOpacity>
              );
            })
          )}
        </View>
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
