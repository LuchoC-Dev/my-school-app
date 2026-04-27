import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Activity, Course } from "@/types/entities";
import { useTheme } from "@/hooks/useTheme";
import { ThemedText, ProgressBar } from "@/components/ui";
import { courseColors } from "@/theme/tokens";
import { formatDate } from "@/utils/dateUtils";
import { useTaskStore } from "@/stores/taskStore";

interface ActivityCardProps {
  activity: Activity;
  course?: Course;
  onPress: () => void;
}

export function ActivityCard({ activity, course, onPress }: ActivityCardProps) {
  const tokens = useTheme();
  const colors = course ? courseColors[course.color] : null;
  const tasks = useTaskStore((s) => s.getByActivityId(activity.id));

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
        <ThemedText variant="body" style={{ flex: 1 }}>{activity.name}</ThemedText>
        <ThemedText variant="metadata" style={{ color: tokens.textSecondary }}>›</ThemedText>
      </View>

      <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
        {course && (
          <ThemedText variant="metadata" style={{ color: colors?.accent ?? tokens.textSecondary }}>
            {course.name}
          </ThemedText>
        )}
        <ThemedText variant="metadata" style={{ color: tokens.textSecondary }}>
          {tasks.length}/? tasks
        </ThemedText>
        {activity.dueDate && (
          <ThemedText variant="metadata" style={{ color: tokens.textSecondary }}>
            {formatDate(activity.dueDate)}
          </ThemedText>
        )}
      </View>

      {tasks.length > 0 && (
        <ProgressBar progress={activity.progress} />
      )}
    </TouchableOpacity>
  );
}
