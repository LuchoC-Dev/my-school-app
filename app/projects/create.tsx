import { View, ScrollView, TextInput, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";
import { useSmartBack } from "@/hooks/useSmartBack";
import { ThemedText, BottomSheet, SectionLabel, DatePickerModal } from "@/components/ui";
import { useProjectStore } from "@/stores/projectStore";
import { useCourseStore } from "@/stores/courseStore";
import { Status } from "@/types/entities";
import { FontFamily, FontSize } from "@/theme/typography";
import { formatDate } from "@/utils/dateUtils";

export default function ProjectCreateScreen() {
  const tokens = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { editId } = useLocalSearchParams<{ editId?: string }>();
  const isEdit = !!editId;

  const addProject = useProjectStore((s) => s.add);
  const updateProject = useProjectStore((s) => s.update);
  const existing = useProjectStore((s) => s.projects.find((p) => p.id === editId));
  const courses = useCourseStore((s) => s.courses);

  const [name, setName] = useState(existing?.name ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [selectedCourseId, setSelectedCourseId] = useState<string | undefined>(existing?.courseId);
  const goBack = useSmartBack(existing?.courseId ? `/courses/${existing.courseId}` : "/(tabs)/");
  const [dueDate, setDueDate] = useState(existing?.dueDate ?? "");
  const [courseSheetVisible, setCourseSheetVisible] = useState(false);
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  const selectedCourse = courses.find((c) => c.id === selectedCourseId);
  const canSave = name.trim().length > 0 && !!selectedCourseId;

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

      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Nombre del proyecto..."
          placeholderTextColor={tokens.textSecondary}
          style={[inputStyle, { fontSize: FontSize.card }]}
          autoFocus={!isEdit}
        />

        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Descripción (opcional)"
          placeholderTextColor={tokens.textSecondary}
          style={[inputStyle, { height: 72, paddingTop: 10, textAlignVertical: "top" }]}
          multiline
        />

        <View style={{ gap: 6 }}>
          <SectionLabel>Materia</SectionLabel>
          <TouchableOpacity
            onPress={() => setCourseSheetVisible(true)}
            style={{
              borderWidth: 1.5,
              borderStyle: selectedCourseId ? "solid" : "dashed",
              borderColor: selectedCourseId ? tokens.accent : tokens.border,
              borderRadius: 999,
              paddingHorizontal: 12,
              paddingVertical: 6,
              alignSelf: "flex-start",
              backgroundColor: selectedCourseId ? tokens.accentLight : "transparent",
            }}
          >
            <ThemedText variant="metadata" style={{ color: selectedCourseId ? tokens.accent : tokens.textSecondary }}>
              {selectedCourse ? `🏫 ${selectedCourse.name}` : "🏫 Materia... ›"}
            </ThemedText>
          </TouchableOpacity>
        </View>

        <View style={{ gap: 6 }}>
          <SectionLabel>Fecha de entrega (opcional)</SectionLabel>
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
              {dueDate ? `📅 ${formatDate(dueDate)}` : "📅 Elegir fecha..."}
            </ThemedText>
            <ThemedText variant="body" style={{ color: tokens.textSecondary }}>›</ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>

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

      <DatePickerModal
        visible={datePickerVisible}
        value={dueDate || undefined}
        onConfirm={(d) => { setDueDate(d); setDatePickerVisible(false); }}
        onCancel={() => setDatePickerVisible(false)}
      />
    </View>
  );
}
