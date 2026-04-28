import { View, TouchableOpacity, Modal } from "react-native";
import { Calendar } from "react-native-calendars";
import { useTheme } from "@/hooks/useTheme";
import { ThemedText } from "./ThemedText";
import { localDateString } from "@/utils/dateUtils";

interface DatePickerModalProps {
  visible: boolean;
  value?: string; // YYYY-MM-DD
  onConfirm: (date: string) => void;
  onCancel: () => void;
}

export function DatePickerModal({ visible, value, onConfirm, onCancel }: DatePickerModalProps) {
  const tokens = useTheme();
  const today = localDateString();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <TouchableOpacity
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", padding: 24 }}
        activeOpacity={1}
        onPress={onCancel}
      >
        <TouchableOpacity activeOpacity={1}>
          <View style={{ backgroundColor: tokens.surface, borderRadius: 16, overflow: "hidden" }}>
            <Calendar
              current={value ?? today}
              markedDates={value ? { [value]: { selected: true, selectedColor: tokens.accent } } : {}}
              onDayPress={(day) => onConfirm(day.dateString)}
              theme={{
                backgroundColor: tokens.surface,
                calendarBackground: tokens.surface,
                textSectionTitleColor: tokens.textSecondary,
                selectedDayBackgroundColor: tokens.accent,
                selectedDayTextColor: tokens.textInverse,
                todayTextColor: tokens.accent,
                dayTextColor: tokens.textPrimary,
                textDisabledColor: tokens.textSecondary,
                arrowColor: tokens.accent,
                monthTextColor: tokens.textPrimary,
                textMonthFontWeight: "700",
                textDayFontSize: 14,
                textMonthFontSize: 16,
                textDayHeaderFontSize: 12,
              }}
            />
            <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 16, paddingTop: 0 }}>
              <TouchableOpacity onPress={onCancel}>
                <ThemedText variant="body" style={{ color: tokens.textSecondary }}>Cancelar</ThemedText>
              </TouchableOpacity>
              {value && (
                <TouchableOpacity onPress={() => onConfirm("")}>
                  <ThemedText variant="body" style={{ color: tokens.destructive }}>Sin fecha</ThemedText>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
