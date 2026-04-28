import { View, ScrollView, TouchableOpacity } from "react-native";
import { useShallow } from "zustand/react/shallow";
import { useTheme } from "@/hooks/useTheme";
import { useActivityStore } from "@/stores/activityStore";
import { useTaskStore } from "@/stores/taskStore";
import { useCourseStore } from "@/stores/courseStore";
import { courseColors } from "@/theme/tokens";
import { ThemedText } from "@/components/ui";
import { useRouter } from "expo-router";
import { localDateString } from "@/utils/dateUtils";
import { useSettingsStore } from "@/stores/settingsStore";

const DAY_NAMES_BY_JS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const WEEKEND_JS = [0, 6]; // JS getDay() values: 0=Dom, 6=Sáb

function getDayName(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return DAY_NAMES_BY_JS[d.getDay()];
}

function isWeekend(dateStr: string): boolean {
  const d = new Date(dateStr + "T12:00:00");
  return WEEKEND_JS.includes(d.getDay());
}

function addDays(dateStr: string, n: number): string {
  const d = new Date(dateStr + "T12:00:00");
  d.setDate(d.getDate() + n);
  return localDateString(d);
}

function getWeekStart(dateStr: string, weekStart: "sun" | "mon" | "sat"): string {
  const d = new Date(dateStr + "T12:00:00");
  const day = d.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  const startDay = weekStart === "sun" ? 0 : weekStart === "mon" ? 1 : 6;
  let diff = day - startDay;
  if (diff < 0) diff += 7;
  d.setDate(d.getDate() - diff);
  return localDateString(d);
}

function formatDayDate(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return `${d.getDate()} ${d.toLocaleDateString(undefined, { month: "short" })}`;
}

function formatWeekRange(start: string, end: string): string {
  const s = new Date(start + "T12:00:00");
  const e = new Date(end + "T12:00:00");
  const sDay = s.getDate();
  const eDay = e.getDate();
  const month = e.toLocaleDateString(undefined, { month: "long" });
  const year = e.getFullYear();
  return `${sDay} – ${eDay} ${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`;
}

export function CalendarWeekView({
  selectedDate,
  onSelectDate,
}: {
  selectedDate: string;
  onSelectDate: (d: string) => void;
}) {
  const tokens = useTheme();
  const router = useRouter();
  const today = localDateString();
  const courses = useCourseStore((s) => s.courses);
  const activities = useActivityStore(useShallow((s) => s.activities));
  const tasks = useTaskStore(useShallow((s) => s.tasks));
  const weekStartSetting = useSettingsStore((s) => s.weekStart);

  const weekStartDate = getWeekStart(selectedDate, weekStartSetting);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStartDate, i));

  function prevWeek() { onSelectDate(addDays(weekStartDate, -7)); }
  function nextWeek() { onSelectDate(addDays(weekStartDate, 7)); }

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
      {/* Week navigation */}
      <View style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 14,
        paddingVertical: 7,
      }}>
        <TouchableOpacity onPress={prevWeek}>
          <ThemedText variant="body" style={{ color: tokens.textSecondary }}>‹</ThemedText>
        </TouchableOpacity>
        <ThemedText variant="card" style={{ fontWeight: "700" }}>
          {formatWeekRange(weekStartDate, weekDays[6])}
        </ThemedText>
        <TouchableOpacity onPress={nextWeek}>
          <ThemedText variant="body" style={{ color: tokens.textSecondary }}>›</ThemedText>
        </TouchableOpacity>
      </View>

      {/* Day blocks */}
      <View style={{ paddingHorizontal: 12, gap: 4 }}>
        {weekDays.map((date, i) => {
          const isToday = date === today;
          const isDayWeekend = isWeekend(date);
          const dayActivities = activities.filter((a) => a.dueDate?.slice(0, 10) === date);

          // Tasks with their own dueDate on this day (not already shown under a day activity)
          const standaloneTasks = tasks.filter((t) =>
            t.dueDate?.slice(0, 10) === date &&
            !dayActivities.some((a) => a.id === t.activityId)
          );

          const isEmpty = dayActivities.length === 0 && standaloneTasks.length === 0;

          return (
            <View
              key={date}
              style={{
                borderWidth: 1.5,
                borderColor: isToday ? tokens.textPrimary : tokens.borderLight,
                borderRadius: 10,
                overflow: "hidden",
                marginBottom: 4,
              }}
            >
              {/* Day header */}
              <View style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 10,
                paddingVertical: 6,
                backgroundColor: isToday ? tokens.textPrimary : isDayWeekend ? tokens.background : tokens.surface,
              }}>
                <ThemedText
                  variant="metadata"
                  style={{
                    fontWeight: "700",
                    color: isToday ? tokens.textInverse : isDayWeekend ? tokens.textSecondary : tokens.textPrimary,
                  }}
                >
                  {getDayName(date)}{isToday ? " · Hoy" : ""}
                </ThemedText>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                  <ThemedText
                    variant="metadata"
                    style={{
                      color: isToday ? tokens.textInverse : isDayWeekend ? tokens.textSecondary : tokens.textSecondary,
                      opacity: 0.7,
                    }}
                  >
                    {formatDayDate(date)}
                  </ThemedText>
                  <TouchableOpacity
                    onPress={() => router.push({ pathname: "/activities/create", params: { dueDate: date } })}
                  >
                    <ThemedText
                      style={{
                        fontSize: 16,
                        opacity: 0.5,
                        color: isToday ? tokens.textInverse : tokens.textPrimary,
                      }}
                    >
                      +
                    </ThemedText>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Day content */}
              <View style={{ backgroundColor: isToday ? "#fff" : undefined }}>
                {isEmpty ? (
                  <ThemedText
                    variant="metadata"
                    style={{ color: tokens.textSecondary, paddingHorizontal: 10, paddingVertical: 5, fontStyle: "italic" }}
                  >
                    Sin actividades
                  </ThemedText>
                ) : (
                  <>
                  {dayActivities.map((activity) => {
                    const course = courses.find((c) => c.id === activity.courseId);
                    const colors = course ? courseColors[course.color] : null;
                    const accentColor = colors?.accent ?? tokens.accent;
                    const actTasks = tasks.filter((t) => t.activityId === activity.id);

                    return (
                      <View key={activity.id}>
                        {/* Activity row */}
                        <TouchableOpacity
                          onPress={() => router.push(`/activities/${activity.id}`)}
                          style={{ flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 10, paddingVertical: 4 }}
                        >
                          {/* Circular checkbox */}
                          <TouchableOpacity
                            onPress={() => {}}
                            style={{
                              width: 14, height: 14, borderRadius: 7, flexShrink: 0,
                              borderWidth: 1.5, borderColor: accentColor,
                              backgroundColor: activity.status === "completed" ? accentColor : "transparent",
                              alignItems: "center", justifyContent: "center",
                            }}
                          >
                            {activity.status === "completed" && (
                              <ThemedText style={{ color: tokens.textInverse, fontSize: 8, lineHeight: 10 }}>✓</ThemedText>
                            )}
                          </TouchableOpacity>
                          <ThemedText
                            variant="metadata"
                            style={{
                              flex: 1, fontSize: 11,
                              textDecorationLine: activity.status === "completed" ? "line-through" : "none",
                              color: activity.status === "completed" ? tokens.textSecondary : tokens.textPrimary,
                            }}
                            numberOfLines={1}
                          >
                            {activity.name}
                          </ThemedText>
                          {course && (
                            <View style={{
                              borderWidth: 1, borderColor: accentColor, borderRadius: 999,
                              paddingHorizontal: 5, paddingVertical: 1,
                            }}>
                              <ThemedText style={{ fontSize: 9, color: accentColor }}>
                                {course.name.length > 6 ? course.name.slice(0, 6) + "…" : course.name}
                              </ThemedText>
                            </View>
                          )}
                        </TouchableOpacity>

                        {/* Task rows (children of this activity) */}
                        {actTasks.map((task) => (
                          <TouchableOpacity
                            key={task.id}
                            onPress={() => router.push(`/tasks/${task.id}`)}
                            style={{ flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 10, paddingVertical: 3, paddingLeft: 20 }}
                          >
                            {/* Square checkbox */}
                            <View style={{
                              width: 14, height: 14, borderRadius: 3, flexShrink: 0,
                              borderWidth: 1.5, borderColor: accentColor,
                              backgroundColor: task.completed ? accentColor : "transparent",
                              alignItems: "center", justifyContent: "center",
                            }}>
                              {task.completed && (
                                <ThemedText style={{ color: tokens.textInverse, fontSize: 8, lineHeight: 10 }}>✓</ThemedText>
                              )}
                            </View>
                            <ThemedText
                              variant="metadata"
                              style={{ flex: 1, fontSize: 11, color: tokens.textSecondary }}
                              numberOfLines={1}
                            >
                              ↳ {task.title}
                            </ThemedText>
                            <ThemedText style={{ fontSize: 9, color: tokens.borderLight }}>task</ThemedText>
                          </TouchableOpacity>
                        ))}
                      </View>
                    );
                  })}
                  {standaloneTasks.map((task) => {
                    const parentActivity = activities.find((a) => a.id === task.activityId);
                    const course = courses.find((c) => c.id === parentActivity?.courseId);
                    const colors = course ? courseColors[course.color] : null;
                    const accentColor = colors?.accent ?? tokens.accent;
                    return (
                      <TouchableOpacity
                        key={task.id}
                        onPress={() => router.push(`/tasks/${task.id}`)}
                        style={{ flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 10, paddingVertical: 4 }}
                      >
                        <View style={{
                          width: 14, height: 14, borderRadius: 3, flexShrink: 0,
                          borderWidth: 1.5, borderColor: accentColor,
                          backgroundColor: task.completed ? accentColor : "transparent",
                          alignItems: "center", justifyContent: "center",
                        }}>
                          {task.completed && (
                            <ThemedText style={{ color: tokens.textInverse, fontSize: 8, lineHeight: 10 }}>✓</ThemedText>
                          )}
                        </View>
                        <ThemedText
                          variant="metadata"
                          style={{ flex: 1, fontSize: 11, color: tokens.textPrimary }}
                          numberOfLines={1}
                        >
                          {task.title}
                        </ThemedText>
                        <ThemedText style={{ fontSize: 9, color: tokens.borderLight }}>task</ThemedText>
                      </TouchableOpacity>
                    );
                  })}
                  </>
                )}
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}
