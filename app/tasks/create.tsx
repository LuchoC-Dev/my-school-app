import { useState } from "react";
import { View, ScrollView, TextInput, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";
import { ThemedText, BottomSheet, SectionLabel } from "@/components/ui";
import { useTaskStore } from "@/stores/taskStore";
import { useActivityStore } from "@/stores/activityStore";
import { useCourseStore } from "@/stores/courseStore";
import { FontFamily, FontSize } from "@/theme/typography";

export default function TaskCreateScreen() {
  const tokens = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { activityId: preselectedActivityId } = useLocalSearchParams<{ activityId?: string }>();

  const addTask = useTaskStore((s) => s.add);
  const activities = useActivityStore((s) => s.activities);
  const courses = useCourseStore((s) => s.courses);

  const [title, setTitle] = useState("");
  const [selectedActivityId, setSelectedActivityId] = useState<string | undefined>(
    preselectedActivityId
  );
  const [activitySheetVisible, setActivitySheetVisible] = useState(false);

  const selectedActivity = activities.find((a) => a.id === selectedActivityId);
  const selectedCourse = courses.find((c) => c.id === selectedActivity?.courseId);

  async function handleCreate() {
    if (!title.trim() || !selectedActivityId) return;
    const existingTasks = useTaskStore
      .getState()
      .tasks.filter((t) => t.activityId === selectedActivityId);
    await addTask({
      activityId: selectedActivityId,
      title: title.trim(),
      completed: false,
      order: existingTasks.length,
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

  const canCreate = title.trim().length > 0 && !!selectedActivityId;

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
          backgroundColor: tokens.background,
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <ThemedText variant="body" style={{ color: tokens.textSecondary }}>Cancelar</ThemedText>
        </TouchableOpacity>
        <ThemedText variant="card">Nueva task</ThemedText>
        <TouchableOpacity onPress={handleCreate} disabled={!canCreate}>
          <ThemedText variant="body" style={{ color: canCreate ? tokens.accent : tokens.border }}>
            Crear
          </ThemedText>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Title */}
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Nombre de la task..."
          placeholderTextColor={tokens.textSecondary}
          style={[inputStyle, { fontSize: FontSize.card }]}
          autoFocus
        />

        {/* Activity selector */}
        <View style={{ gap: 6 }}>
          <SectionLabel>Actividad</SectionLabel>
          <TouchableOpacity
            onPress={() => setActivitySheetVisible(true)}
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
              {selectedActivity
                ? `📋 ${selectedActivity.name}`
                : "📋 Actividad... ›"}
            </ThemedText>
          </TouchableOpacity>
          {selectedCourse && (
            <ThemedText variant="metadata" style={{ color: tokens.textSecondary, paddingLeft: 4 }}>
              🏫 {selectedCourse.name}
            </ThemedText>
          )}
        </View>
      </ScrollView>

      {/* Activity picker sheet */}
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
    </View>
  );
}
