import React from "react";
import { View, TouchableOpacity } from "react-native";
import { CourseSchedule, WeekDay } from "@/types/entities";
import { useTheme } from "@/hooks/useTheme";
import { ThemedText } from "@/components/ui";

interface CourseScheduleRowProps {
  schedule?: CourseSchedule;
  onRemove?: () => void;
  // Create mode: editable fields
  editable?: boolean;
  onDayPress?: () => void;
  onFromPress?: () => void;
  onToPress?: () => void;
}

export function CourseScheduleRow({
  schedule,
  onRemove,
  editable,
  onDayPress,
  onFromPress,
  onToPress,
}: CourseScheduleRowProps) {
  const tokens = useTheme();

  if (schedule) {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 4,
          gap: 6,
        }}
      >
        <ThemedText variant="body" style={{ color: tokens.textBody }}>
          {schedule.day} {schedule.from}–{schedule.to}
        </ThemedText>
        {onRemove && (
          <TouchableOpacity onPress={onRemove} style={{ marginLeft: "auto" }}>
            <ThemedText variant="metadata" style={{ color: tokens.textSecondary }}>
              ✕
            </ThemedText>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  // Add-new row (dashed)
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1.5,
        borderStyle: "dashed",
        borderColor: tokens.border,
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 6,
        gap: 6,
      }}
    >
      <TouchableOpacity onPress={onDayPress}>
        <ThemedText variant="body" style={{ color: tokens.textSecondary }}>
          Día
        </ThemedText>
      </TouchableOpacity>
      <ThemedText variant="body" style={{ color: tokens.borderLight }}>
        ·
      </ThemedText>
      <TouchableOpacity onPress={onFromPress}>
        <ThemedText variant="body" style={{ color: tokens.textSecondary }}>
          Desde
        </ThemedText>
      </TouchableOpacity>
      <ThemedText variant="body" style={{ color: tokens.textSecondary }}>
        →
      </ThemedText>
      <TouchableOpacity onPress={onToPress}>
        <ThemedText variant="body" style={{ color: tokens.textSecondary }}>
          Hasta
        </ThemedText>
      </TouchableOpacity>
      {editable && (
        <View
          style={{
            marginLeft: "auto",
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: tokens.textPrimary,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ThemedText variant="metadata" style={{ color: tokens.textInverse }}>
            +
          </ThemedText>
        </View>
      )}
    </View>
  );
}
