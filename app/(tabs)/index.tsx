import { View, ScrollView, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { AppHeader } from "@/components/navigation/AppHeader";
import { EmptyState, SearchBar } from "@/components/ui";
import { CourseCard } from "@/components/courses/CourseCard";
import { useCourseStore } from "@/stores/courseStore";
import { useActivityStore } from "@/stores/activityStore";
import { FontFamily, FontSize } from "@/theme/typography";
import { courseColors } from "@/theme/tokens";
import { useState } from "react";

export default function CoursesScreen() {
  const tokens = useTheme();
  const router = useRouter();
  const courses = useCourseStore((s) => s.courses);
  const activities = useActivityStore((s) => s.activities);
  const [search, setSearch] = useState("");

  const filtered = courses.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  function getPendingCount(courseId: string) {
    return activities.filter(
      (a) => a.courseId === courseId && a.status !== "completed"
    ).length;
  }

  function getCompletedCount(courseId: string) {
    return activities.filter(
      (a) => a.courseId === courseId && a.status === "completed"
    ).length;
  }

  return (
    <View style={{ flex: 1, backgroundColor: tokens.background }}>
      <AppHeader title="Mis Materias" />

      {courses.length === 0 ? (
        <EmptyState
          icon={<Text style={{ fontSize: 40 }}>🏫</Text>}
          title="Sin materias"
          description="Agregá tu primera materia para empezar a organizar tus actividades."
          ctaLabel="+ Agregar materia"
          onCta={() => router.push("/courses/create")}
        />
      ) : (
        <>
          <View style={{ paddingTop: 8, paddingBottom: 4 }}>
            <SearchBar
              value={search}
              onChangeText={setSearch}
              placeholder="Buscar materia..."
            />
          </View>
          <ScrollView
            contentContainerStyle={{ padding: 14, gap: 10, paddingBottom: 32 }}
          >
            {filtered.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                pendingCount={getPendingCount(course.id)}
                completedCount={getCompletedCount(course.id)}
                onPress={() => router.push(`/courses/${course.id}`)}
              />
            ))}
            {/* Create card (dashed) */}
            <TouchableOpacity
              onPress={() => router.push("/courses/create")}
              activeOpacity={0.7}
              style={{
                borderWidth: 1.5,
                borderStyle: "dashed",
                borderColor: tokens.border,
                borderRadius: 12,
                paddingVertical: 14,
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
                gap: 6,
              }}
            >
              <Text
                style={{
                  fontFamily: FontFamily.caveatRegular,
                  fontSize: FontSize.body,
                  color: tokens.textSecondary,
                }}
              >
                + Nueva materia
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </>
      )}
    </View>
  );
}
