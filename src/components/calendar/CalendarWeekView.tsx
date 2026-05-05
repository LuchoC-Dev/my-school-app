import { useState } from "react";
import { View, ScrollView, TouchableOpacity, Text } from "react-native";
import { useShallow } from "zustand/react/shallow";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/hooks/useTheme";
import { useActivityStore } from "@/stores/activityStore";
import { useTaskStore } from "@/stores/taskStore";
import { useCourseStore } from "@/stores/courseStore";
import { courseColors } from "@/theme/tokens";
import { ThemedText } from "@/components/ui";
import { useRouter } from "expo-router";
import { localDateString } from "@/utils/dateUtils";
import { useSettingsStore } from "@/stores/settingsStore";
import { FontSize } from "@/theme/typography";

const WEEKEND_JS = [0, 6]; // JS getDay() values: 0=Dom, 6=Sáb

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
  const { t } = useTranslation();
  const DAY_NAMES_BY_JS: string[] = t("calendar.daysFull", { returnObjects: true });
  const tokens = useTheme();
  const router = useRouter();
  const today = localDateString();
  const courses = useCourseStore((s) => s.courses);
  const activities = useActivityStore(useShallow((s) => s.activities));
  const tasks = useTaskStore(useShallow((s) => s.tasks));
  const weekStartSetting = useSettingsStore((s) => s.weekStart);

  const [expandedActivities, setExpandedActivities] = useState<Set<string>>(new Set());

  function toggleActivity(actId: string) {
    setExpandedActivities((prev) => {
      const next = new Set(prev);
      next.has(actId) ? next.delete(actId) : next.add(actId);
      return next;
    });
  }

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
                  {DAY_NAMES_BY_JS[new Date(date + "T12:00:00").getDay()]}{isToday ? ` · ${t("calendar.today")}` : ""}
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
                    style={{
                      width: 26, height: 26, borderRadius: 13,
                      borderWidth: 1.5,
                      borderColor: isToday ? tokens.textInverse : tokens.border,
                      alignItems: "center", justifyContent: "center",
                      opacity: 0.7,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 18,
                        lineHeight: 20,
                        includeFontPadding: false,
                        fontFamily: "System",
                        color: isToday ? tokens.textInverse : tokens.textPrimary,
                      }}
                    >
                      +
                    </Text>
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

                    const isExpanded = expandedActivities.has(activity.id);
                    const completedCount = actTasks.filter((t) => t.completed).length;

                    return (
                      <View key={activity.id}>
                        {/* Activity row */}
                        <TouchableOpacity
                          onPress={() => router.push(`/activities/${activity.id}`)}
                          style={{ flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 10, paddingVertical: 6, borderTopWidth: 1, borderTopColor: tokens.borderLight }}
                        >
                          {/* Circular checkbox */}
                          <TouchableOpacity
                            onPress={() => {}}
                            style={{
                              width: 18, height: 18, borderRadius: 9, flexShrink: 0,
                              borderWidth: 1.5, borderColor: accentColor,
                              backgroundColor: activity.status === "completed" ? accentColor : "transparent",
                              alignItems: "center", justifyContent: "center",
                            }}
                          >
                            {activity.status === "completed" && (
                              <ThemedText style={{ color: tokens.textInverse, fontSize: 8, lineHeight: 10 }}>✓</ThemedText>
                            )}
                          </TouchableOpacity>
                          <View style={{ flex: 1, gap: 1 }}>
                            <ThemedText
                              variant="body"
                              style={{
                                textDecorationLine: activity.status === "completed" ? "line-through" : "none",
                                color: activity.status === "completed" ? tokens.textSecondary : tokens.textPrimary,
                              }}
                              numberOfLines={1}
                            >
                              {activity.name}
                            </ThemedText>
                            {actTasks.length > 0 && !isExpanded && (
                              <ThemedText variant="metadata" style={{ color: tokens.textSecondary }}>
                                {completedCount}/{actTasks.length} tasks
                              </ThemedText>
                            )}
                          </View>
                          {course && (
                            <View style={{
                              borderWidth: 1, borderColor: accentColor, borderRadius: 999,
                              paddingHorizontal: 6, paddingVertical: 2,
                            }}>
                              <ThemedText style={{ fontSize: FontSize.metadata, color: accentColor }}>
                                {course.name.length > 8 ? course.name.slice(0, 8) + "…" : course.name}
                              </ThemedText>
                            </View>
                          )}
                          {actTasks.length > 0 && (
                            <TouchableOpacity
                              onPress={(e) => { e.stopPropagation?.(); toggleActivity(activity.id); }}
                              style={{ width: 30, height: 30, borderRadius: 15, borderWidth: 1.5, borderColor: tokens.border, alignItems: "center", justifyContent: "center" }}
                            >
                              <Text style={{ fontSize: 14, includeFontPadding: false, fontFamily: "System", color: tokens.textSecondary }}>
                                {isExpanded ? "▲" : "▼"}
                              </Text>
                            </TouchableOpacity>
                          )}
                        </TouchableOpacity>

                        {/* Task rows — only when expanded */}
                        {isExpanded && actTasks.map((task) => (
                          <TouchableOpacity
                            key={task.id}
                            onPress={() => router.push(`/tasks/${task.id}`)}
                            style={{ flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 10, paddingVertical: 5, paddingLeft: 24 }}
                          >
                            {/* Square checkbox */}
                            <View style={{
                              width: 18, height: 18, borderRadius: 4, flexShrink: 0,
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
                              style={{ flex: 1, color: tokens.textSecondary }}
                              numberOfLines={1}
                            >
                              ↳ {task.title}
                            </ThemedText>
                            <ThemedText style={{ fontSize: FontSize.metadata, color: tokens.borderLight }}>task</ThemedText>
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
                        style={{ flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 10, paddingVertical: 6, borderTopWidth: 1, borderTopColor: tokens.borderLight }}
                      >
                        <View style={{
                          width: 18, height: 18, borderRadius: 4, flexShrink: 0,
                          borderWidth: 1.5, borderColor: accentColor,
                          backgroundColor: task.completed ? accentColor : "transparent",
                          alignItems: "center", justifyContent: "center",
                        }}>
                          {task.completed && (
                            <ThemedText style={{ color: tokens.textInverse, fontSize: 8, lineHeight: 10 }}>✓</ThemedText>
                          )}
                        </View>
                        <ThemedText
                          variant="body"
                          style={{ flex: 1, color: tokens.textPrimary }}
                          numberOfLines={1}
                        >
                          {task.title}
                        </ThemedText>
                        <ThemedText style={{ fontSize: FontSize.metadata, color: tokens.borderLight }}>task</ThemedText>
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
