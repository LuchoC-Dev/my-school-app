import { View, ScrollView, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/hooks/useTheme";
import { useActivityStore } from "@/stores/activityStore";
import { useCourseStore } from "@/stores/courseStore";
import { useTaskStore } from "@/stores/taskStore";
import { courseColors } from "@/theme/tokens";
import { ThemedText } from "@/components/ui";
import { useRouter } from "expo-router";
import { formatDate, localDateString } from "@/utils/dateUtils";

const HOURS = Array.from({ length: 15 }, (_, i) => i + 7); // 07:00–21:00

function addDays(dateStr: string, n: number): string {
  const d = new Date(dateStr + "T12:00:00");
  d.setDate(d.getDate() + n);
  return localDateString(d);
}

function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

export function CalendarDayView({ selectedDate, onSelectDate }: { selectedDate: string; onSelectDate: (d: string) => void }) {
  const { t } = useTranslation();
  const WEEK_DAYS: string[] = t("calendar.days", { returnObjects: true });
  const DAY_NAMES: string[] = t("calendar.daysFull", { returnObjects: true });
  const tokens = useTheme();
  const router = useRouter();
  const today = localDateString();
  const courses = useCourseStore((s) => s.courses);
  const activities = useActivityStore((s) => s.activities);
  const tasks = useTaskStore((s) => s.tasks);

  const dayOfWeek = WEEK_DAYS[new Date(selectedDate + "T12:00:00").getDay()];

  // Course schedule blocks for this day
  const scheduleBlocks = courses.flatMap((course) =>
    (course.schedules ?? [])
      .filter((s) => s.day === dayOfWeek)
      .map((s) => ({ course, from: s.from, to: s.to }))
  );

  // Activities due this day
  const dueTodayActivities = activities.filter((a) => a.dueDate?.slice(0, 10) === selectedDate);

  // Tasks with their own dueDate on this day
  const dueTodayTasks = tasks.filter((t) => t.dueDate?.slice(0, 10) === selectedDate);

  const isToday = selectedDate === today;

  return (
    <View style={{ flex: 1 }}>
      {/* Day navigation */}
      <View style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: tokens.borderLight,
      }}>
        <TouchableOpacity onPress={() => onSelectDate(addDays(selectedDate, -1))}>
          <ThemedText variant="body" style={{ color: tokens.accent }}>‹ Anterior</ThemedText>
        </TouchableOpacity>

        <View style={{ alignItems: "center" }}>
          <ThemedText variant="card" style={{ color: isToday ? tokens.accent : tokens.textPrimary }}>
            {DAY_NAMES[new Date(selectedDate + "T12:00:00").getDay()]}
          </ThemedText>
          <ThemedText variant="metadata" style={{ color: tokens.textSecondary }}>
            {formatDate(selectedDate)}
          </ThemedText>
        </View>

        <TouchableOpacity onPress={() => onSelectDate(addDays(selectedDate, 1))}>
          <ThemedText variant="body" style={{ color: tokens.accent }}>Siguiente ›</ThemedText>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Activities + Tasks due today — shown at top */}
        {(dueTodayActivities.length > 0 || dueTodayTasks.length > 0) && (
          <View style={{ padding: 12, gap: 6, borderBottomWidth: 1, borderBottomColor: tokens.borderLight }}>
            <ThemedText variant="metadata" style={{ color: tokens.textSecondary }}>Vencen hoy</ThemedText>
            {dueTodayActivities.map((a) => {
              const course = courses.find((c) => c.id === a.courseId);
              const colors = course ? courseColors[course.color] : null;
              return (
                <TouchableOpacity
                  key={a.id}
                  onPress={() => router.push(`/activities/${a.id}`)}
                  style={{
                    backgroundColor: tokens.surface,
                    borderRadius: 8,
                    borderLeftWidth: 3,
                    borderLeftColor: colors?.accent ?? tokens.accent,
                    padding: 10,
                    gap: 2,
                  }}
                >
                  <ThemedText variant="body">📝 {a.name}</ThemedText>
                  {course && (
                    <ThemedText variant="metadata" style={{ color: colors?.accent ?? tokens.accent }}>
                      {course.name}
                    </ThemedText>
                  )}
                </TouchableOpacity>
              );
            })}
            {dueTodayTasks.map((t) => {
              const parentActivity = activities.find((a) => a.id === t.activityId);
              const course = courses.find((c) => c.id === parentActivity?.courseId);
              const colors = course ? courseColors[course.color] : null;
              return (
                <TouchableOpacity
                  key={t.id}
                  onPress={() => router.push(`/tasks/${t.id}`)}
                  style={{
                    backgroundColor: tokens.surface,
                    borderRadius: 8,
                    borderLeftWidth: 3,
                    borderLeftColor: colors?.accent ?? tokens.accent,
                    padding: 10,
                    gap: 2,
                    paddingLeft: 13,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                    <View style={{
                      width: 12, height: 12, borderRadius: 2, borderWidth: 1.5,
                      borderColor: colors?.accent ?? tokens.accent,
                      backgroundColor: t.completed ? (colors?.accent ?? tokens.accent) : "transparent",
                    }} />
                    <ThemedText variant="body" style={{ flex: 1, textDecorationLine: t.completed ? "line-through" : "none" }}>
                      {t.title}
                    </ThemedText>
                  </View>
                  {parentActivity && (
                    <ThemedText variant="metadata" style={{ color: tokens.textSecondary, paddingLeft: 18 }}>
                      ↳ {parentActivity.name}
                    </ThemedText>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Timetable */}
        {HOURS.map((hour) => {
          const hourStr = String(hour).padStart(2, "0") + ":00";
          const hourMinutes = hour * 60;

          const blocksInHour = scheduleBlocks.filter((b) => {
            const start = timeToMinutes(b.from);
            const end = timeToMinutes(b.to);
            return start < (hour + 1) * 60 && end > hour * 60;
          });

          return (
            <View
              key={hour}
              style={{
                flexDirection: "row",
                minHeight: 52,
                borderBottomWidth: 1,
                borderBottomColor: tokens.borderLight,
              }}
            >
              {/* Hour label */}
              <View style={{ width: 48, padding: 6, alignItems: "flex-end" }}>
                <ThemedText variant="metadata" style={{ color: tokens.textSecondary }}>
                  {hourStr}
                </ThemedText>
              </View>

              {/* Course blocks */}
              <View style={{ flex: 1, paddingHorizontal: 4, paddingVertical: 4, gap: 3 }}>
                {blocksInHour.map((b, i) => {
                  const colors = courseColors[b.course.color];
                  const isStart = timeToMinutes(b.from) >= hourMinutes && timeToMinutes(b.from) < (hour + 1) * 60;
                  return (
                    <TouchableOpacity
                      key={`${b.course.id}-${i}`}
                      onPress={() => router.push(`/courses/${b.course.id}`)}
                      style={{
                        backgroundColor: colors.accentLight,
                        borderLeftWidth: 3,
                        borderLeftColor: colors.accent,
                        borderRadius: 4,
                        paddingHorizontal: 6,
                        paddingVertical: 3,
                      }}
                    >
                      <ThemedText variant="metadata" style={{ color: colors.accent, fontWeight: "600" }}>
                        {b.course.name}
                      </ThemedText>
                      <ThemedText variant="metadata" style={{ color: colors.accent }}>
                        {isStart ? `${b.from} – ${b.to}` : `hasta ${b.to}`}
                      </ThemedText>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          );
        })}

        {scheduleBlocks.length === 0 && dueTodayActivities.length === 0 && (
          <View style={{ padding: 32, alignItems: "center" }}>
            <ThemedText variant="body" style={{ color: tokens.textSecondary }}>Sin clases ni vencimientos</ThemedText>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
