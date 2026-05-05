import { useState } from "react";
import { View, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/hooks/useTheme";
import { useSmartBack } from "@/hooks/useSmartBack";
import { ThemedText, BottomSheet, Separator, DatePickerModal, MaterialSection } from "@/components/ui";
import { useActivityStore } from "@/stores/activityStore";
import { useCourseStore } from "@/stores/courseStore";
import { ActivityType, Status, MaterialLink } from "@/types/entities";
import { FontFamily, FontSize } from "@/theme/typography";
import { formatDate, dueDateStatus } from "@/utils/dateUtils";
import { courseColors } from "@/theme/tokens";

export default function ActivityCreateScreen() {
  const { t } = useTranslation();
  const tokens = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { editId, dueDate: preselectedDueDate, courseId: preselectedCourseId } = useLocalSearchParams<{ editId?: string; dueDate?: string; courseId?: string }>();
  const isEdit = !!editId;

  const addActivity = useActivityStore((s) => s.add);
  const updateActivity = useActivityStore((s) => s.update);
  const existing = useActivityStore((s) => s.activities.find((a) => a.id === editId));
  const courses = useCourseStore((s) => s.courses);

  const [name, setName] = useState(existing?.name ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [descSheetVisible, setDescSheetVisible] = useState(false);
  const [descEdit, setDescEdit] = useState("");
  const [type, setType] = useState<ActivityType>(existing?.type ?? "assignment");
  const [selectedCourseId, setSelectedCourseId] = useState<string | undefined>(existing?.courseId ?? preselectedCourseId);
  const [dueDate, setDueDate] = useState(existing?.dueDate ?? preselectedDueDate ?? "");
  const [links, setLinks] = useState<MaterialLink[]>(existing?.links ?? []);
  const [courseSheetVisible, setCourseSheetVisible] = useState(false);
  const [typeSheetVisible, setTypeSheetVisible] = useState(false);
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  const goBack = useSmartBack(preselectedCourseId ? `/courses/${preselectedCourseId}` : "/(tabs)/activities");

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
      await updateActivity(editId, {
        name: name.trim(),
        description: description.trim() || undefined,
        type,
        courseId: selectedCourseId!,
        dueDate: dueDate || undefined,
        links,
      });
    } else {
      await addActivity({
        courseId: selectedCourseId!,
        name: name.trim(),
        description: description.trim() || undefined,
        type,
        status: "pending" as Status,
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
        <ThemedText variant="card">{isEdit ? t("activities.edit") : t("activities.create")}</ThemedText>
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
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        {/* Title */}
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder={t("activities.namePlaceholder")}
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
              {dueDate ? `🗓 ${formatDate(dueDate)}` : t("common.schedule")}
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* Type + course row */}
        <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
          <TouchableOpacity
            onPress={() => setTypeSheetVisible(true)}
            style={{ borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3, backgroundColor: tokens.surfaceAlt, flexDirection: "row", gap: 4, alignItems: "center" }}
          >
            <ThemedText variant="metadata" style={{ color: tokens.textSecondary }}>
              {TYPE_LABELS[type]}
            </ThemedText>
            <ThemedText variant="metadata" style={{ color: tokens.textSecondary, fontSize: 10 }}>▾</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setCourseSheetVisible(true)}
            style={{
              borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3,
              borderWidth: 1,
              borderColor: selectedCourseId ? tokens.accent : tokens.border,
              borderStyle: selectedCourseId ? "solid" : "dashed",
            }}
          >
            <ThemedText variant="metadata" style={{ color: selectedCourseId ? tokens.accent : tokens.textSecondary }}>
              {selectedCourse ? `🏫 ${selectedCourse.name} ›` : `🏫 ${t("common.selectCourse")}`}
            </ThemedText>
          </TouchableOpacity>
        </View>

        <Separator />

        {/* Description block */}
        <TouchableOpacity
          onPress={() => { setDescEdit(description); setDescSheetVisible(true); }}
          style={{ backgroundColor: tokens.surfaceAlt, borderRadius: 8, padding: 12, gap: 4 }}
        >
          <ThemedText variant="metadata" style={{ color: tokens.textSecondary }}>📝 {t("common.description")}</ThemedText>
          {description ? (
            <ThemedText variant="body">{description}</ThemedText>
          ) : (
            <ThemedText variant="body" style={{ color: tokens.textSecondary, fontStyle: "italic" }}>
              {t("common.tapToAddDescription")}
            </ThemedText>
          )}
        </TouchableOpacity>

        <Separator />

        {/* Material */}
        <MaterialSection
          links={links}
          onAdd={(link) => setLinks((prev) => [...prev, link])}
          onRemove={(i) => setLinks((prev) => prev.filter((_, idx) => idx !== i))}
        />
      </ScrollView>
      </KeyboardAvoidingView>

      {/* Course picker */}
      <BottomSheet visible={courseSheetVisible} onClose={() => setCourseSheetVisible(false)}>
        <ThemedText variant="card" style={{ marginBottom: 8 }}>{t("common.selectCourse")}</ThemedText>
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
        <ThemedText variant="card" style={{ marginBottom: 8 }}>{t("activities.typeTitle")}</ThemedText>
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
          onPress={() => { setDescription(descEdit.trim()); setDescSheetVisible(false); }}
          style={{ marginTop: 12, backgroundColor: tokens.textPrimary, borderRadius: 8, paddingVertical: 12, alignItems: "center" }}
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
