import { View, ScrollView, TextInput, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";
import { ThemedText, BottomSheet, SectionLabel } from "@/components/ui";
import { useProjectStore } from "@/stores/projectStore";
import { useCourseStore } from "@/stores/courseStore";
import { Status } from "@/types/entities";
import { FontFamily, FontSize } from "@/theme/typography";

export default function ProjectCreateScreen() {
  const tokens = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const addProject = useProjectStore((s) => s.add);
  const courses = useCourseStore((s) => s.courses);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState<string | undefined>();
  const [dueDate, setDueDate] = useState("");
  const [courseSheetVisible, setCourseSheetVisible] = useState(false);

  const selectedCourse = courses.find((c) => c.id === selectedCourseId);
  const canCreate = name.trim().length > 0 && !!selectedCourseId;

  async function handleCreate() {
    if (!canCreate) return;
    await addProject({
      courseId: selectedCourseId!,
      name: name.trim(),
      description: description.trim() || undefined,
      status: "pending" as Status,
      dueDate: dueDate || undefined,
    });
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
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <ThemedText variant="body" style={{ color: tokens.textSecondary }}>Cancelar</ThemedText>
        </TouchableOpacity>
        <ThemedText variant="card">Nuevo proyecto</ThemedText>
        <TouchableOpacity onPress={handleCreate} disabled={!canCreate}>
          <ThemedText variant="body" style={{ color: canCreate ? tokens.accent : tokens.border }}>Crear</ThemedText>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Nombre del proyecto..."
          placeholderTextColor={tokens.textSecondary}
          style={[inputStyle, { fontSize: FontSize.card }]}
          autoFocus
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
          <TextInput
            value={dueDate}
            onChangeText={setDueDate}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={tokens.textSecondary}
            style={inputStyle}
          />
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
    </View>
  );
}
