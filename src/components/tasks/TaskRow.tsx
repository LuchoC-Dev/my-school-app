import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Task } from "@/types/entities";
import { useTheme } from "@/hooks/useTheme";
import { ThemedText } from "@/components/ui";

interface TaskRowProps {
  task: Task;
  courseLabel?: string;
  activityLabel?: string;
  courseColor?: string;
  dueDate?: string;
  onToggle: () => void;
  onPress: () => void;
}

export function TaskRow({ task, courseLabel, activityLabel, courseColor, dueDate, onToggle, onPress }: TaskRowProps) {
  const tokens = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={{
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 10,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: tokens.borderLight,
      }}
    >
      {/* Checkbox circle */}
      <TouchableOpacity
        onPress={onToggle}
        style={{
          width: 18,
          height: 18,
          borderRadius: 9,
          borderWidth: 1.5,
          borderColor: task.completed ? tokens.accent : tokens.border,
          backgroundColor: task.completed ? tokens.accent : "transparent",
          marginTop: 2,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {task.completed && <ThemedText style={{ color: tokens.textInverse, fontSize: 10 }}>✓</ThemedText>}
      </TouchableOpacity>

      <View style={{ flex: 1, gap: 2 }}>
        <ThemedText
          variant="body"
          style={{
            color: task.completed ? tokens.textSecondary : tokens.textPrimary,
            textDecorationLine: task.completed ? "line-through" : "none",
            marginBottom: 4,
          }}
        >
          {task.title}
        </ThemedText>
        <View style={{ flexDirection: "row", gap: 6, flexWrap: "wrap" }}>
          {courseLabel && (
            <View
              style={{
                borderRadius: 999,
                paddingHorizontal: 6,
                paddingVertical: 1,
                backgroundColor: courseColor ? `${courseColor}22` : tokens.surfaceAlt,
              }}
            >
              <ThemedText variant="metadata" style={{ color: courseColor ?? tokens.textSecondary }}>
                {courseLabel}
              </ThemedText>
            </View>
          )}
          {activityLabel && (
            <View
              style={{
                borderRadius: 999,
                paddingHorizontal: 6,
                paddingVertical: 1,
                backgroundColor: tokens.surfaceAlt,
              }}
            >
              <ThemedText variant="metadata" style={{ color: tokens.textSecondary }}>
                {activityLabel}
              </ThemedText>
            </View>
          )}
          {dueDate && !task.completed && (
            <ThemedText variant="metadata" style={{ color: tokens.textSecondary }}>
              {dueDate}
            </ThemedText>
          )}
        </View>
      </View>

      <ThemedText variant="metadata" style={{ color: tokens.borderLight, marginTop: 4 }}>
        ›
      </ThemedText>
    </TouchableOpacity>
  );
}
