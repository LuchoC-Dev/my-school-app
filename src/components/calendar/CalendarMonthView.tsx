import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { useTheme } from "@/hooks/useTheme";
import { useActivityStore } from "@/stores/activityStore";
import { useProjectStore } from "@/stores/projectStore";
import { useTaskStore } from "@/stores/taskStore";
import { useCourseStore } from "@/stores/courseStore";
import { courseColors } from "@/theme/tokens";
import { ThemedText, Separator } from "@/components/ui";
import { useRouter } from "expo-router";
import { formatDate, localDateString } from "@/utils/dateUtils";

type MarkedDates = Record<string, { dots: { key: string; color: string }[]; selected?: boolean; selectedColor?: string }>;

export function CalendarMonthView({ selectedDate, onSelectDate }: { selectedDate: string; onSelectDate: (d: string) => void }) {
  const tokens = useTheme();
  const router = useRouter();
  const today = localDateString();
  const activities = useActivityStore((s) => s.activities);
  const projects = useProjectStore((s) => s.projects);
  const tasks = useTaskStore((s) => s.tasks);
  const courses = useCourseStore((s) => s.courses);

  const markedDates: MarkedDates = {};

  activities.forEach((a) => {
    if (!a.dueDate) return;
    const dateKey = a.dueDate.slice(0, 10);
    const course = courses.find((c) => c.id === a.courseId);
    const accent = course ? courseColors[course.color].accent : tokens.accent;
    if (!markedDates[dateKey]) markedDates[dateKey] = { dots: [] };
    if (markedDates[dateKey].dots.length < 3) {
      markedDates[dateKey].dots.push({ key: a.id, color: accent });
    }
  });

  projects.forEach((p) => {
    if (!p.dueDate) return;
    const dateKey = p.dueDate.slice(0, 10);
    const course = courses.find((c) => c.id === p.courseId);
    const accent = course ? courseColors[course.color].accent : tokens.accent;
    if (!markedDates[dateKey]) markedDates[dateKey] = { dots: [] };
    if (markedDates[dateKey].dots.length < 3) {
      markedDates[dateKey].dots.push({ key: p.id, color: accent });
    }
  });

  tasks.forEach((t) => {
    if (!t.dueDate) return;
    const dateKey = t.dueDate.slice(0, 10);
    const parentActivity = activities.find((a) => a.id === t.activityId);
    const course = courses.find((c) => c.id === parentActivity?.courseId);
    const accent = course ? courseColors[course.color].accent : tokens.accent;
    if (!markedDates[dateKey]) markedDates[dateKey] = { dots: [] };
    if (markedDates[dateKey].dots.length < 3) {
      markedDates[dateKey].dots.push({ key: t.id, color: accent });
    }
  });

  const finalMarked = { ...markedDates };
  if (selectedDate) {
    finalMarked[selectedDate] = {
      ...(finalMarked[selectedDate] ?? { dots: [] }),
      selected: true,
      selectedColor: tokens.accent,
    };
  }

  const itemsForDate = selectedDate ? [
    ...activities
      .filter((a) => a.dueDate?.slice(0, 10) === selectedDate)
      .map((a) => {
        const course = courses.find((c) => c.id === a.courseId);
        return {
          type: "activity" as const,
          id: a.id,
          name: a.name,
          courseAccent: course ? courseColors[course.color].accent : tokens.accent,
          courseName: course?.name ?? "Sin materia",
          status: a.status,
        };
      }),
    ...projects
      .filter((p) => p.dueDate?.slice(0, 10) === selectedDate)
      .map((p) => {
        const course = courses.find((c) => c.id === p.courseId);
        return {
          type: "project" as const,
          id: p.id,
          name: p.name,
          courseAccent: course ? courseColors[course.color].accent : tokens.accent,
          courseName: course?.name ?? "Sin materia",
          status: p.status,
        };
      }),
    ...tasks
      .filter((t) => t.dueDate?.slice(0, 10) === selectedDate)
      .map((t) => {
        const parentActivity = activities.find((a) => a.id === t.activityId);
        const course = courses.find((c) => c.id === parentActivity?.courseId);
        return {
          type: "task" as const,
          id: t.id,
          name: t.title,
          courseAccent: course ? courseColors[course.color].accent : tokens.accent,
          courseName: course?.name ?? "Sin materia",
          status: t.completed ? "completed" as const : "pending" as const,
        };
      }),
  ] : [];

  return (
    <View style={{ flex: 1 }}>
      <Calendar
        current={today}
        markingType="multi-dot"
        markedDates={finalMarked}
        onDayPress={(day: DateData) => onSelectDate(day.dateString)}
        theme={{
          backgroundColor: tokens.background,
          calendarBackground: tokens.background,
          textSectionTitleColor: tokens.textSecondary,
          selectedDayBackgroundColor: tokens.accent,
          selectedDayTextColor: tokens.textInverse,
          todayTextColor: tokens.accent,
          dayTextColor: tokens.textPrimary,
          textDisabledColor: tokens.textSecondary,
          dotColor: tokens.accent,
          selectedDotColor: tokens.textInverse,
          arrowColor: tokens.accent,
          monthTextColor: tokens.textPrimary,
          indicatorColor: tokens.accent,
          textMonthFontWeight: "700",
          textDayFontSize: 14,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 12,
        }}
      />

      <Separator />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: 40 }}>
        {itemsForDate.length === 0 ? (
          <ThemedText variant="body" style={{ color: tokens.textSecondary, textAlign: "center", marginTop: 24 }}>
            {selectedDate ? `Sin vencimientos el ${formatDate(selectedDate)}` : "Tocá un día para ver los vencimientos"}
          </ThemedText>
        ) : (
          <>
            <ThemedText variant="metadata" style={{ color: tokens.textSecondary, marginBottom: 4 }}>
              {formatDate(selectedDate)} · {itemsForDate.length} {itemsForDate.length === 1 ? "vencimiento" : "vencimientos"}
            </ThemedText>
            {itemsForDate.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => router.push(`/${item.type === "activity" ? "activities" : item.type === "project" ? "projects" : "tasks"}/${item.id}`)}
                style={{
                  borderRadius: 10,
                  borderLeftWidth: 4,
                  borderLeftColor: item.courseAccent,
                  backgroundColor: tokens.surface,
                  padding: 12,
                  gap: 4,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <Text style={{ fontSize: 14 }}>{item.type === "activity" ? "📝" : item.type === "project" ? "📁" : "☑️"}</Text>
                  <ThemedText variant="body" style={{ flex: 1 }}>{item.name}</ThemedText>
                  {item.status === "completed" && <Text style={{ fontSize: 12 }}>✅</Text>}
                </View>
                <ThemedText variant="metadata" style={{ color: item.courseAccent }}>
                  🏫 {item.courseName}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}
