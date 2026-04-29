import { View, ScrollView, Text } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { useProjectStore } from "@/stores/projectStore";
import { useCourseStore } from "@/stores/courseStore";
import { SearchBar, EmptyState, SectionLabel, Chip, ChipRow } from "@/components/ui";
import { ProjectCard } from "./ProjectCard";
import { courseColors } from "@/theme/tokens";

export function ProjectListTab() {
  const tokens = useTheme();
  const router = useRouter();
  const projects = useProjectStore((s) => s.projects);
  const courses = useCourseStore((s) => s.courses);
  const [search, setSearch] = useState("");
  const [filterCourseId, setFilterCourseId] = useState<string | null>(null);

  const filtered = projects.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterCourseId && p.courseId !== filterCourseId) return false;
    return true;
  });

  const active = filtered.filter((p) => p.status !== "completed");
  const completed = filtered.filter((p) => p.status === "completed");

  if (projects.length === 0) {
    return (
      <EmptyState
        icon={<Text style={{ fontSize: 40 }}>📁</Text>}
        title="Sin proyectos"
        description="Los proyectos son opcionales y agrupan varias actividades relacionadas."
        ctaLabel="+ Nuevo proyecto"
        onCta={() => router.push("/projects/create")}
      />
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ paddingBottom: 8, gap: 8 }}>
        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder="Buscar proyecto..."
          onGlobalSearch={() => router.push("/search")}
        />
        <ChipRow>
          <Chip label="Todos" active={filterCourseId === null} onPress={() => setFilterCourseId(null)} />
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
        </ChipRow>
      </View>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 80 }}>
        {active.length > 0 && (
          <View style={{ marginBottom: 8 }}>
            <SectionLabel>En curso · {active.length}</SectionLabel>
            {active.map((p) => (
              <ProjectCard
                key={p.id}
                project={p}
                course={courses.find((c) => c.id === p.courseId)}
                onPress={() => router.push(`/projects/${p.id}`)}
              />
            ))}
          </View>
        )}
        {completed.length > 0 && (
          <View>
            <SectionLabel>Completados · {completed.length}</SectionLabel>
            {completed.map((p) => (
              <ProjectCard
                key={p.id}
                project={p}
                course={courses.find((c) => c.id === p.courseId)}
                onPress={() => router.push(`/projects/${p.id}`)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
