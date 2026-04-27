import { View, ScrollView, TextInput, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";
import { ThemedText, BottomSheet, SectionLabel } from "@/components/ui";
import { useActivityStore } from "@/stores/activityStore";
import { useCourseStore } from "@/stores/courseStore";
import { ActivityType, Status } from "@/types/entities";
import { FontFamily, FontSize } from "@/theme/typography";

const ACTIVITY_TYPES: { value: ActivityType; label: string }[] = [
  { value: "assignment", label: "Trabajo práctico" },
  { value: "exam", label: "Examen" },
  { value: "project", label: "Proyecto" },
  { value: "reading", label: "Lectura" },
  { value: "other", label: "Otro" },
];

export default function ActivityCreateScreen() {
  const tokens = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const addActivity = useActivityStore((s) => s.add);
  const courses = useCourseStore((s) => s.courses);

  const [name, setName] = useState("");
  const [type, setType] = useState<ActivityType>("assignment");
  const [selectedCourseId, setSelectedCourseId] = useState<string | undefined>();
  const [dueDate, setDueDate] = useState("");
  const [courseSheetVisible, setCourseSheetVisible] = useState(false);
  const [typeSheetVisible, setTypeSheetVisible] = useState(false);

  const selectedCourse = courses.find((c) => c.id === selectedCourseId);
  const canCreate = name.trim().length > 0 && !!selectedCourseId;

  async function handleCreate() {
    if (!canCreate) return;
    await addActivity({
      courseId: selectedCourseId!,
      name: name.trim(),
      type,
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
        <ThemedText variant="card">Nueva actividad</ThemedText>
        <TouchableOpacity onPress={handleCreate} disabled={!canCreate}>
          <ThemedText variant="body" style={{ color: canCreate ? tokens.accent : tokens.border }}>Crear</ThemedText>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Nombre de la actividad..."
          placeholderTextColor={tokens.textSecondary}
          style={[inputStyle, { fontSize: FontSize.card }]}
          autoFocus
        />

        {/* Course selector */}
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

        {/* Type selector */}
        <View style={{ gap: 6 }}>
          <SectionLabel>Tipo</SectionLabel>
          <TouchableOpacity
            onPress={() => setTypeSheetVisible(true)}
            style={{
              borderWidth: 1.5,
              borderColor: tokens.border,
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 8,
              backgroundColor: tokens.surface,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <ThemedText variant="body">{ACTIVITY_TYPES.find((t) => t.value === type)?.label}</ThemedText>
            <ThemedText variant="body" style={{ color: tokens.textSecondary }}>›</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Due date */}
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

      {/* Type picker */}
      <BottomSheet visible={typeSheetVisible} onClose={() => setTypeSheetVisible(false)}>
        <ThemedText variant="card" style={{ marginBottom: 8 }}>Tipo de actividad</ThemedText>
        {ACTIVITY_TYPES.map((t) => (
          <TouchableOpacity
            key={t.value}
            onPress={() => { setType(t.value); setTypeSheetVisible(false); }}
            style={{ paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: tokens.borderLight }}
          >
            <ThemedText variant="body" style={{ color: type === t.value ? tokens.accent : tokens.textPrimary }}>
              {t.label}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </BottomSheet>
    </View>
  );
}
