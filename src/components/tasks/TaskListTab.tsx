import { useState } from "react";
import { View, ScrollView, Text } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/hooks/useTheme";
import { useTaskStore } from "@/stores/taskStore";
import { useActivityStore } from "@/stores/activityStore";
import { useCourseStore } from "@/stores/courseStore";
import { SearchBar, EmptyState, SectionLabel, Chip, ChipRow } from "@/components/ui";
import { TaskRow } from "./TaskRow";
import { courseColors } from "@/theme/tokens";
import { formatDate } from "@/utils/dateUtils";

export function TaskListTab() {
  const { t } = useTranslation();
  const tokens = useTheme();
  const router = useRouter();
  const tasks = useTaskStore((s) => s.tasks);
  const updateTask = useTaskStore((s) => s.update);
  const activities = useActivityStore((s) => s.activities);
  const courses = useCourseStore((s) => s.courses);
  const [search, setSearch] = useState("");
  const [filterCourseId, setFilterCourseId] = useState<string | null>(null);

  const activityMap = Object.fromEntries(activities.map((a) => [a.id, a]));
  const courseMap = Object.fromEntries(courses.map((c) => [c.id, c]));

  const filtered = tasks.filter((t) => {
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterCourseId) {
      const activity = activityMap[t.activityId];
      if (!activity || activity.courseId !== filterCourseId) return false;
    }
    return true;
  });

  const pending = filtered.filter((t) => !t.completed);
  const completed = filtered.filter((t) => t.completed);

  if (tasks.length === 0) {
    return (
      <EmptyState
        icon={<Text style={{ fontSize: 40 }}>☑️</Text>}
        title="Sin tasks"
        description="Las tasks van dentro de actividades o sueltas. Creá la primera."
        ctaLabel="+ Nueva task"
        onCta={() => router.push("/tasks/create")}
      />
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ paddingBottom: 8, gap: 8 }}>
        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder="Buscar task..."
          onGlobalSearch={() => router.push("/search")}
        />
        {/* Course filter chips */}
        <ChipRow>
          <Chip
            label={t("common.all")}
            active={filterCourseId === null}
            onPress={() => setFilterCourseId(null)}
          />
          {courses.map((c) => {
            const isActive = filterCourseId === c.id;
            const accent = courseColors[c.color].accent;
            return (
              <Chip
                key={c.id}
                label={c.name}
                active={isActive}
                onPress={() => setFilterCourseId(isActive ? null : c.id)}
                style={{
                  borderColor: isActive ? accent : tokens.border,
                  backgroundColor: isActive ? `${accent}22` : "transparent",
                }}
              />
            );
          })}
        </ChipRow>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 80 }}>
        {pending.length > 0 && (
          <View style={{ marginBottom: 8 }}>
            <SectionLabel>Pendientes · {pending.length}</SectionLabel>
            {pending.map((task) => {
              const activity = activityMap[task.activityId];
              const course = activity ? courseMap[activity.courseId] : undefined;
              return (
                <TaskRow
                  key={task.id}
                  task={task}
                  courseLabel={course?.name}
                  activityLabel={activity?.name}
                  courseColor={course ? courseColors[course.color].accent : undefined}
                  dueDate={activity?.dueDate ? formatDate(activity.dueDate) : undefined}
                  onToggle={() => updateTask(task.id, { completed: !task.completed })}
                  onPress={() => router.push(`/tasks/${task.id}`)}
                />
              );
            })}
          </View>
        )}
        {completed.length > 0 && (
          <View>
            <SectionLabel>Completadas · {completed.length}</SectionLabel>
            {completed.map((task) => {
              const activity = activityMap[task.activityId];
              const course = activity ? courseMap[activity.courseId] : undefined;
              return (
                <TaskRow
                  key={task.id}
                  task={task}
                  courseLabel={course?.name}
                  activityLabel={activity?.name}
                  courseColor={course ? courseColors[course.color].accent : undefined}
                  onToggle={() => updateTask(task.id, { completed: !task.completed })}
                  onPress={() => router.push(`/tasks/${task.id}`)}
                />
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
