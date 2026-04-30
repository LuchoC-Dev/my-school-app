import { useState } from "react";
import { View } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { AppHeader } from "@/components/navigation/AppHeader";
import { CalendarMonthView } from "@/components/calendar/CalendarMonthView";
import { CalendarWeekView } from "@/components/calendar/CalendarWeekView";
import { CalendarDayView } from "@/components/calendar/CalendarDayView";
import { Chip } from "@/components/ui";
import { localDateString } from "@/utils/dateUtils";
import { useSettingsStore } from "@/stores/settingsStore";

type CalendarViewType = "day" | "week" | "month";

export default function CalendarScreen() {
  const tokens = useTheme();
  const today = localDateString();
  const [selectedDate, setSelectedDate] = useState(today);
  const calendarViewDefault = useSettingsStore((s) => s.calendarViewDefault);
  const [viewType, setViewType] = useState<CalendarViewType>(calendarViewDefault);

  return (
    <View style={{ flex: 1, backgroundColor: tokens.background }}>
      <AppHeader title="Calendario" />

      {/* Sub-tabs */}
      <View style={{
        flexDirection: "row",
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: tokens.borderLight,
      }}>
        {(["day", "week", "month"] as CalendarViewType[]).map((v) => {
          const label = v === "day" ? "Día" : v === "week" ? "Semana" : "Mes";
          const active = viewType === v;
          return (
            <Chip
              key={v}
              label={label}
              active={active}
              onPress={() => setViewType(v)}
            />
          );
        })}
      </View>

      {viewType === "day" && (
        <CalendarDayView selectedDate={selectedDate} onSelectDate={setSelectedDate} />
      )}
      {viewType === "week" && (
        <CalendarWeekView selectedDate={selectedDate} onSelectDate={setSelectedDate} />
      )}
      {viewType === "month" && (
        <CalendarMonthView
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          onSwitchToDay={(d) => { setSelectedDate(d); setViewType("day"); }}
        />
      )}
    </View>
  );
}
