import { useState } from "react";
import {
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Text,
} from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { useSmartBack } from "@/hooks/useSmartBack";
import { ThemedText } from "@/components/ui";
import { CourseColorPicker } from "@/components/courses/CourseColorPicker";
import { CourseScheduleRow } from "@/components/courses/CourseScheduleRow";
import { useCourseStore } from "@/stores/courseStore";
import { CourseColor, CourseSchedule, WeekDay } from "@/types/entities";
import { FontFamily, FontSize } from "@/theme/typography";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomSheet, SectionLabel } from "@/components/ui";

const DAYS: WeekDay[] = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"];

export default function CourseCreateScreen() {
  const tokens = useTheme();
  const router = useRouter();
  const goBack = useSmartBack("/(tabs)/");
  const insets = useSafeAreaInsets();
  const addCourse = useCourseStore((s) => s.add);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [professor, setProfessor] = useState("");
  const [color, setColor] = useState<CourseColor>("orange");
  const [schedules, setSchedules] = useState<CourseSchedule[]>([]);

  // Day picker sheet
  const [daySheetVisible, setDaySheetVisible] = useState(false);
  // Pending schedule being built
  const [pendingDay, setPendingDay] = useState<WeekDay | null>(null);
  const [pendingFrom, setPendingFrom] = useState("");
  const [pendingTo, setPendingTo] = useState("");

  function addSchedule() {
    if (!pendingDay || !pendingFrom || !pendingTo) return;
    setSchedules((prev) => [
      ...prev,
      { day: pendingDay, from: pendingFrom, to: pendingTo },
    ]);
    setPendingDay(null);
    setPendingFrom("");
    setPendingTo("");
  }

  function removeSchedule(index: number) {
    setSchedules((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleCreate() {
    if (!name.trim()) return;
    await addCourse({
      name: name.trim(),
      description: description.trim() || undefined,
      professor: professor.trim() || undefined,
      color,
      schedules,
    });
    goBack();
  }

  const inputStyle = {
    height: 40,
    borderWidth: 1.5,
    borderColor: tokens.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: tokens.surface,
    color: tokens.textPrimary,
    fontFamily: FontFamily.caveatRegular,
    fontSize: FontSize.body,
  };

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
        <TouchableOpacity onPress={() => goBack()}>
          <ThemedText variant="body" style={{ color: tokens.textSecondary }}>
            Cancelar
          </ThemedText>
        </TouchableOpacity>
        <ThemedText variant="card">Nueva materia</ThemedText>
        <TouchableOpacity onPress={handleCreate} disabled={!name.trim()}>
          <ThemedText
            variant="body"
            style={{ color: name.trim() ? tokens.accent : tokens.border }}
          >
            Crear
          </ThemedText>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Name */}
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Nombre de la materia..."
          placeholderTextColor={tokens.textSecondary}
          style={[inputStyle, { fontSize: FontSize.card }]}
          autoFocus
        />

        {/* Description */}
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Descripción (opcional)"
          placeholderTextColor={tokens.textSecondary}
          style={[inputStyle, { height: 72, paddingTop: 10, textAlignVertical: "top" }]}
          multiline
        />

        {/* Professor */}
        <TextInput
          value={professor}
          onChangeText={setProfessor}
          placeholder="Profesor/a (opcional)"
          placeholderTextColor={tokens.textSecondary}
          style={inputStyle}
        />

        {/* Color */}
        <View style={{ gap: 8 }}>
          <SectionLabel>Color</SectionLabel>
          <CourseColorPicker value={color} onChange={setColor} />
        </View>

        {/* Schedules */}
        <View style={{ gap: 8 }}>
          <SectionLabel>Horarios (opcional)</SectionLabel>
          {schedules.map((s, i) => (
            <CourseScheduleRow
              key={i}
              schedule={s}
              onRemove={() => removeSchedule(i)}
            />
          ))}
          {/* Pending schedule row */}
          <View style={{ gap: 8 }}>
            <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
              <TouchableOpacity
                onPress={() => setDaySheetVisible(true)}
                style={{
                  borderWidth: 1.5,
                  borderColor: tokens.border,
                  borderRadius: 8,
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  backgroundColor: tokens.surface,
                  minWidth: 48,
                  alignItems: "center",
                }}
              >
                <ThemedText variant="body" style={{ color: pendingDay ? tokens.textPrimary : tokens.textSecondary }}>
                  {pendingDay ?? "Día"}
                </ThemedText>
              </TouchableOpacity>
              <TextInput
                value={pendingFrom}
                onChangeText={setPendingFrom}
                placeholder="15:00"
                placeholderTextColor={tokens.textSecondary}
                style={[inputStyle, { flex: 1 }]}
                maxLength={5}
              />
              <ThemedText style={{ color: tokens.textSecondary }}>→</ThemedText>
              <TextInput
                value={pendingTo}
                onChangeText={setPendingTo}
                placeholder="17:00"
                placeholderTextColor={tokens.textSecondary}
                style={[inputStyle, { flex: 1 }]}
                maxLength={5}
              />
              <TouchableOpacity
                onPress={addSchedule}
                disabled={!pendingDay || !pendingFrom || !pendingTo}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  backgroundColor: pendingDay && pendingFrom && pendingTo ? tokens.textPrimary : tokens.borderLight,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ThemedText variant="metadata" style={{ color: tokens.textInverse }}>+</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Day picker bottom sheet */}
      <BottomSheet visible={daySheetVisible} onClose={() => setDaySheetVisible(false)}>
        <View style={{ gap: 4 }}>
          <ThemedText variant="card" style={{ marginBottom: 8 }}>Día de la semana</ThemedText>
          {DAYS.map((day) => (
            <TouchableOpacity
              key={day}
              onPress={() => {
                setPendingDay(day);
                setDaySheetVisible(false);
              }}
              style={{
                paddingVertical: 12,
                paddingHorizontal: 4,
                borderBottomWidth: 1,
                borderBottomColor: tokens.borderLight,
              }}
            >
              <ThemedText variant="body" style={{ color: pendingDay === day ? tokens.accent : tokens.textPrimary }}>
                {day}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </BottomSheet>
    </View>
  );
}
