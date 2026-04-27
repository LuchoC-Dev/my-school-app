import { View, ScrollView, Text } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { useActivityStore } from "@/stores/activityStore";
import { useCourseStore } from "@/stores/courseStore";
import { SearchBar, EmptyState, SectionLabel, Chip } from "@/components/ui";
import { ActivityCard } from "./ActivityCard";
import { courseColors } from "@/theme/tokens";

export function ActivityListTab() {
  const tokens = useTheme();
  const router = useRouter();
  const activities = useActivityStore((s) => s.activities);
  const courses = useCourseStore((s) => s.courses);
  const [search, setSearch] = useState("");
  const [filterCourseId, setFilterCourseId] = useState<string | null>(null);

  const filtered = activities.filter((a) => {
    if (search && !a.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterCourseId && a.courseId !== filterCourseId) return false;
    return true;
  });

  const pending = filtered.filter((a) => a.status !== "completed");
  const completed = filtered.filter((a) => a.status === "completed");

  if (activities.length === 0) {
    return (
      <EmptyState
        icon={<Text style={{ fontSize: 40 }}>📋</Text>}
        title="Sin actividades"
        description="Las actividades agrupan tareas con fecha de entrega. Creá la primera."
        ctaLabel="+ Nueva actividad"
        onCta={() => router.push("/activities/create")}
      />
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ paddingBottom: 8, gap: 8 }}>
        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder="Buscar actividad..."
          onGlobalSearch={() => router.push("/search")}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 14, gap: 6 }}
        >
          <Chip label="Todas" active={filterCourseId === null} onPress={() => setFilterCourseId(null)} />
          {courses.map((c) => {
            const isActive = filterCourseId === c.id;
            const accent = courseColors[c.color].accent;
            return (
              <Chip
                key={c.id}
                label={c.name}
                active={isActive}
                onPress={() => setFilterCourseId(isActive ? null : c.id)}
                style={{ borderColor: isActive ? accent : tokens.border, backgroundColor: isActive ? `${accent}22` : "transparent" }}
              />
            );
          })}
        </ScrollView>
      </View>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 80 }}>
        {pending.length > 0 && (
          <View style={{ marginBottom: 8 }}>
            <SectionLabel>Pendientes · {pending.length}</SectionLabel>
            {pending.map((a) => (
              <ActivityCard
                key={a.id}
                activity={a}
                course={courses.find((c) => c.id === a.courseId)}
                onPress={() => router.push(`/activities/${a.id}`)}
              />
            ))}
          </View>
        )}
        {completed.length > 0 && (
          <View>
            <SectionLabel>Completadas · {completed.length}</SectionLabel>
            {completed.map((a) => (
              <ActivityCard
                key={a.id}
                activity={a}
                course={courses.find((c) => c.id === a.courseId)}
                onPress={() => router.push(`/activities/${a.id}`)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
