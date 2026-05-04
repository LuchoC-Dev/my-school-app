import { useState } from "react";
import { View, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";
import { useSmartBack } from "@/hooks/useSmartBack";
import { ThemedText, BottomSheet, Separator, DatePickerModal } from "@/components/ui";
import { useProjectStore } from "@/stores/projectStore";
import { useCourseStore } from "@/stores/courseStore";
import { Status } from "@/types/entities";
import { FontFamily, FontSize } from "@/theme/typography";
import { formatDate, dueDateStatus } from "@/utils/dateUtils";
import { courseColors } from "@/theme/tokens";

export default function ProjectCreateScreen() {
  const tokens = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { editId, courseId: preselectedCourseId } = useLocalSearchParams<{ editId?: string; courseId?: string }>();
  const isEdit = !!editId;

  const addProject = useProjectStore((s) => s.add);
  const updateProject = useProjectStore((s) => s.update);
  const existing = useProjectStore((s) => s.projects.find((p) => p.id === editId));
  const courses = useCourseStore((s) => s.courses);

  const [name, setName] = useState(existing?.name ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [descSheetVisible, setDescSheetVisible] = useState(false);
  const [descEdit, setDescEdit] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState<string | undefined>(existing?.courseId ?? preselectedCourseId);
  const [dueDate, setDueDate] = useState(existing?.dueDate ?? "");
  const [courseSheetVisible, setCourseSheetVisible] = useState(false);
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  const goBack = useSmartBack(
    preselectedCourseId ? `/courses/${preselectedCourseId}`
    : existing?.courseId ? `/courses/${existing.courseId}`
    : "/(tabs)/"
  );

  const selectedCourse = courses.find((c) => c.id === selectedCourseId);
  const colors = selectedCourse ? courseColors[selectedCourse.color] : null;
  const canSave = name.trim().length > 0 && !!selectedCourseId;

  const dueDateColor = dueDate
    ? dueDateStatus(dueDate) === "overdue" ? tokens.destructive
    : dueDateStatus(dueDate) === "today" ? tokens.warning
    : tokens.textBody
    : tokens.textSecondary;

  async function handleSave() {
    if (!canSave) return;
    if (isEdit && editId) {
      await updateProject(editId, {
        name: name.trim(),
        description: description.trim() || undefined,
        courseId: selectedCourseId!,
        dueDate: dueDate || undefined,
      });
    } else {
      await addProject({
        courseId: selectedCourseId!,
        name: name.trim(),
        description: description.trim() || undefined,
        status: "pending" as Status,
        dueDate: dueDate || undefined,
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
          <ThemedText variant="body" style={{ color: tokens.textSecondary }}>Cancelar</ThemedText>
        </TouchableOpacity>
        <ThemedText variant="card">{isEdit ? "Editar proyecto" : "Nuevo proyecto"}</ThemedText>
        <TouchableOpacity onPress={handleSave} disabled={!canSave}>
          <ThemedText variant="body" style={{ color: canSave ? tokens.accent : tokens.border }}>
            {isEdit ? "Guardar" : "Crear"}
          </ThemedText>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        {/* Title */}
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Nombre del proyecto..."
          placeholderTextColor={tokens.textSecondary}
          autoFocus={!isEdit}
          style={{
            color: tokens.textPrimary,
            fontFamily: FontFamily.caveatBold,
            fontSize: FontSize.title,
          }}
        />

        <Separator />

        {/* Meta row: course (left) — date (right) */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          {selectedCourse ? (
            <ThemedText variant="metadata" style={{ color: colors?.accent ?? tokens.accent, paddingLeft: 4 }}>
              🏫 {selectedCourse.name}
            </ThemedText>
          ) : <View />}
          <TouchableOpacity onPress={() => setDatePickerVisible(true)}>
            <ThemedText variant="metadata" style={{ color: dueDateColor }}>
              {dueDate ? `🗓 ${formatDate(dueDate)}` : "+ Programar entrega"}
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* Course selector chip */}
        <TouchableOpacity
          onPress={() => setCourseSheetVisible(true)}
          style={{
            borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3, alignSelf: "flex-start",
            borderWidth: 1,
            borderColor: selectedCourseId ? tokens.accent : tokens.border,
            borderStyle: selectedCourseId ? "solid" : "dashed",
          }}
        >
          <ThemedText variant="metadata" style={{ color: selectedCourseId ? tokens.accent : tokens.textSecondary }}>
            {selectedCourse ? `🏫 ${selectedCourse.name} ›` : "🏫 Seleccionar materia..."}
          </ThemedText>
        </TouchableOpacity>

        <Separator />

        {/* Description block */}
        <TouchableOpacity
          onPress={() => { setDescEdit(description); setDescSheetVisible(true); }}
          style={{ backgroundColor: tokens.surfaceAlt, borderRadius: 8, padding: 12, gap: 4 }}
        >
          <ThemedText variant="metadata" style={{ color: tokens.textSecondary }}>📝 DESCRIPCIÓN</ThemedText>
          {description ? (
            <ThemedText variant="body">{description}</ThemedText>
          ) : (
            <ThemedText variant="body" style={{ color: tokens.textSecondary, fontStyle: "italic" }}>
              Tocar para agregar descripción...
            </ThemedText>
          )}
        </TouchableOpacity>
      </ScrollView>
      </KeyboardAvoidingView>

      {/* Course picker */}
      <BottomSheet visible={courseSheetVisible} onClose={() => setCourseSheetVisible(false)}>
        <ThemedText variant="card" style={{ marginBottom: 8 }}>Seleccionar materia</ThemedText>
        {courses.map((c) => (
          <TouchableOpacity
            key={c.id}
            onPress={() => { setSelectedCourseId(c.id); setCourseSheetVisible(false); }}
            style={{ paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: tokens.borderLight }}
          >
            <ThemedText variant="body" style={{ color: selectedCourseId === c.id ? tokens.accent : tokens.textPrimary }}>
              {c.name}
            </ThemedText>
          </TouchableOpacity>
        ))}
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
          onPress={() => { setDescription(descEdit.trim()); setDescSheetVisible(false); }}
          style={{ marginTop: 12, backgroundColor: tokens.textPrimary, borderRadius: 8, paddingVertical: 12, alignItems: "center" }}
        >
          <ThemedText variant="body" style={{ color: tokens.textInverse }}>Listo</ThemedText>
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
