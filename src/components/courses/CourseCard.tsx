import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Course } from "@/types/entities";
import { courseColors } from "@/theme/tokens";
import { useTheme } from "@/hooks/useTheme";
import { ThemedText } from "@/components/ui";
import { FontSize } from "@/theme/typography";

interface CourseCardProps {
  course: Course;
  pendingCount: number;
  completedCount: number;
  onPress: () => void;
}

export function CourseCard({ course, pendingCount, completedCount, onPress }: CourseCardProps) {
  const tokens = useTheme();
  const colors = courseColors[course.color];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{
        backgroundColor: tokens.surface,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: tokens.borderLight,
        borderLeftWidth: 4,
        borderLeftColor: colors.accent,
        padding: 14,
        gap: 6,
      }}
    >
      {/* Name row */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        {course.emoji ? (
          <ThemedText style={{ fontSize: FontSize.card }}>{course.emoji}</ThemedText>
        ) : null}
        <ThemedText variant="card" style={{ flex: 1 }}>
          {course.name}
        </ThemedText>
      </View>

      {/* Professor */}
      {course.professor ? (
        <ThemedText variant="metadata" style={{ color: tokens.textSecondary }}>
          👤 {course.professor}
        </ThemedText>
      ) : (
        <ThemedText variant="metadata" style={{ color: tokens.textSecondary, fontStyle: "italic" }}>
          Sin profesor asignado
        </ThemedText>
      )}

      {/* Badges */}
      <View style={{ flexDirection: "row", gap: 8, marginTop: 2 }}>
        {pendingCount > 0 && (
          <View
            style={{
              backgroundColor: tokens.surfaceAlt,
              borderRadius: 999,
              paddingHorizontal: 8,
              paddingVertical: 3,
            }}
          >
            <ThemedText variant="metadata" style={{ color: tokens.warning }}>
              {pendingCount} pendiente{pendingCount !== 1 ? "s" : ""}
            </ThemedText>
          </View>
        )}
        {completedCount > 0 && (
          <View
            style={{
              backgroundColor: tokens.surfaceAlt,
              borderRadius: 999,
              paddingHorizontal: 8,
              paddingVertical: 3,
            }}
          >
            <ThemedText variant="metadata" style={{ color: tokens.textSecondary }}>
              {completedCount} completada{completedCount !== 1 ? "s" : ""}
            </ThemedText>
          </View>
        )}
        {pendingCount === 0 && completedCount === 0 && (
          <ThemedText variant="metadata" style={{ color: tokens.textSecondary }}>
            Sin actividades
          </ThemedText>
        )}
      </View>
    </TouchableOpacity>
  );
}
