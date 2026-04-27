import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Project, Course } from "@/types/entities";
import { useTheme } from "@/hooks/useTheme";
import { ThemedText } from "@/components/ui";
import { courseColors } from "@/theme/tokens";
import { formatDate } from "@/utils/dateUtils";
import { useActivityStore } from "@/stores/activityStore";

interface ProjectCardProps {
  project: Project;
  course?: Course;
  onPress: () => void;
}

export function ProjectCard({ project, course, onPress }: ProjectCardProps) {
  const tokens = useTheme();
  const colors = course ? courseColors[course.color] : null;
  const activities = useActivityStore((s) => s.getByProjectId(project.id));
  const pending = activities.filter((a) => a.status !== "completed").length;
  const completedCount = activities.filter((a) => a.status === "completed").length;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{
        backgroundColor: tokens.surface,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: tokens.borderLight,
        borderLeftWidth: 3,
        borderLeftColor: colors?.accent ?? tokens.accent,
        padding: 12,
        marginBottom: 8,
        gap: 6,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <ThemedText variant="body" style={{ flex: 1 }}>📁 {project.name}</ThemedText>
        <ThemedText variant="metadata" style={{ color: tokens.textSecondary }}>›</ThemedText>
      </View>

      <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
        {course && (
          <ThemedText variant="metadata" style={{ color: colors?.accent ?? tokens.textSecondary }}>
            {course.name}
          </ThemedText>
        )}
        {activities.length > 0 && (
          <ThemedText variant="metadata" style={{ color: tokens.textSecondary }}>
            {completedCount}/{activities.length} actividades
          </ThemedText>
        )}
        {project.dueDate && (
          <ThemedText variant="metadata" style={{ color: tokens.textSecondary }}>
            {formatDate(project.dueDate)}
          </ThemedText>
        )}
      </View>
    </TouchableOpacity>
  );
}
