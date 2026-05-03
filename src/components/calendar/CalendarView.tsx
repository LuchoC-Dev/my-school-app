import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { CustomCalendar } from "@/components/ui/CustomCalendar";
type DateData = { dateString: string };
import { useTheme } from "@/hooks/useTheme";
import { useActivityStore } from "@/stores/activityStore";
import { useProjectStore } from "@/stores/projectStore";
import { useCourseStore } from "@/stores/courseStore";
import { courseColors } from "@/theme/tokens";
import { ThemedText, Separator } from "@/components/ui";
import { useRouter } from "expo-router";
import { Activity, Project } from "@/types/entities";
import { formatDate } from "@/utils/dateUtils";

type MarkedDates = Record<string, { dots: { key: string; color: string }[]; selected?: boolean; selectedColor?: string }>;

interface CalendarItem {
  type: "activity" | "project";
  id: string;
  name: string;
  courseColor: string;
  courseAccent: string;
  courseName: string;
  emoji?: string;
  itemType?: string;
  status: string;
}

export function CalendarView({ selectedDate, onSelectDate }: { selectedDate: string; onSelectDate: (d: string) => void }) {
  const tokens = useTheme();
  const router = useRouter();
  const activities = useActivityStore((s) => s.activities);
  const projects = useProjectStore((s) => s.projects);
  const courses = useCourseStore((s) => s.courses);

  // Build marked dates from activities + projects with dueDates
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

  // Add selection styling
  const finalMarked = { ...markedDates };
  if (selectedDate) {
    finalMarked[selectedDate] = {
      ...(finalMarked[selectedDate] ?? { dots: [] }),
      selected: true,
      selectedColor: tokens.accent,
    };
  }

  // Items for selected date
  const itemsForDate: CalendarItem[] = [];
  if (selectedDate) {
    activities
      .filter((a) => a.dueDate?.slice(0, 10) === selectedDate)
      .forEach((a) => {
        const course = courses.find((c) => c.id === a.courseId);
        itemsForDate.push({
          type: "activity",
          id: a.id,
          name: a.name,
          courseColor: course ? courseColors[course.color].accentLight : tokens.accentLight,
          courseAccent: course ? courseColors[course.color].accent : tokens.accent,
          courseName: course?.name ?? "Sin materia",
          itemType: a.type,
          status: a.status,
        });
      });

    projects
      .filter((p) => p.dueDate?.slice(0, 10) === selectedDate)
      .forEach((p) => {
        const course = courses.find((c) => c.id === p.courseId);
        itemsForDate.push({
          type: "project",
          id: p.id,
          name: p.name,
          courseColor: course ? courseColors[course.color].accentLight : tokens.accentLight,
          courseAccent: course ? courseColors[course.color].accent : tokens.accent,
          courseName: course?.name ?? "Sin materia",
          status: p.status,
        });
      });
  }

  return (
    <View style={{ flex: 1 }}>
      <CustomCalendar
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
          textDayFontFamily: "System",
          textMonthFontFamily: "System",
          textDayHeaderFontFamily: "System",
          textMonthFontWeight: "700",
          textDayFontSize: 14,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 12,
        }}
      />


      <Separator />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: 40 }}>
        {!selectedDate && (
          <ThemedText variant="body" style={{ color: tokens.textSecondary, textAlign: "center", marginTop: 24 }}>
            Tocá un día para ver los vencimientos
          </ThemedText>
        )}

        {selectedDate && itemsForDate.length === 0 && (
          <ThemedText variant="body" style={{ color: tokens.textSecondary, textAlign: "center", marginTop: 24 }}>
            Sin vencimientos el {formatDate(selectedDate)}
          </ThemedText>
        )}

        {selectedDate && itemsForDate.length > 0 && (
          <ThemedText variant="metadata" style={{ color: tokens.textSecondary, marginBottom: 4 }}>
            {formatDate(selectedDate)} · {itemsForDate.length} {itemsForDate.length === 1 ? "vencimiento" : "vencimientos"}
          </ThemedText>
        )}

        {itemsForDate.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => router.push(`/${item.type === "activity" ? "activities" : "projects"}/${item.id}`)}
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
              <Text style={{ fontSize: 14 }}>{item.type === "activity" ? "📝" : "📁"}</Text>
              <ThemedText variant="body" style={{ flex: 1 }}>
                {item.name}
              </ThemedText>
              {item.status === "completed" && (
                <Text style={{ fontSize: 12 }}>✅</Text>
              )}
            </View>
            <ThemedText variant="metadata" style={{ color: item.courseAccent }}>
              🏫 {item.courseName}
              {item.itemType ? ` · ${item.itemType}` : ""}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
