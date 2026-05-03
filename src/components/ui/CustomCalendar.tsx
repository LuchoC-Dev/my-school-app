import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

type DotMark = { key: string; color: string };
type MarkedDate =
  | { dots?: DotMark[]; selected?: boolean; selectedColor?: string }
  | { selected?: boolean; selectedColor?: string };

interface CalendarTheme {
  backgroundColor?: string;
  calendarBackground?: string;
  textSectionTitleColor?: string;
  selectedDayBackgroundColor?: string;
  selectedDayTextColor?: string;
  todayTextColor?: string;
  dayTextColor?: string;
  textDisabledColor?: string;
  dotColor?: string;
  selectedDotColor?: string;
  arrowColor?: string;
  monthTextColor?: string;
  indicatorColor?: string;
  textMonthFontWeight?: string;
  textDayFontSize?: number;
  textMonthFontSize?: number;
  textDayHeaderFontSize?: number;
  textDayFontFamily?: string;
  textMonthFontFamily?: string;
  textDayHeaderFontFamily?: string;
}

interface DateData {
  dateString: string;
  day: number;
  month: number;
  year: number;
}

interface CustomCalendarProps {
  current?: string;
  markedDates?: Record<string, MarkedDate>;
  onDayPress?: (day: DateData) => void;
  markingType?: string;
  theme?: CalendarTheme;
}

const DAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

function toDateString(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function CustomCalendar({ current, markedDates = {}, onDayPress, theme = {} }: CustomCalendarProps) {
  const today = new Date();
  const todayStr = toDateString(today.getFullYear(), today.getMonth() + 1, today.getDate());

  const initial = current ? new Date(current + "T12:00:00") : today;
  const [displayYear, setDisplayYear] = useState(initial.getFullYear());
  const [displayMonth, setDisplayMonth] = useState(initial.getMonth() + 1); // 1-12

  const bg = theme.calendarBackground ?? theme.backgroundColor ?? "#fff";
  const headerColor = theme.monthTextColor ?? "#000";
  const headerWeight = (theme.textMonthFontWeight ?? "700") as "bold" | "700" | "normal";
  const headerSize = theme.textMonthFontSize ?? 16;
  const arrowColor = theme.arrowColor ?? "#000";
  const dayHeaderColor = theme.textSectionTitleColor ?? "#888";
  const dayHeaderSize = theme.textDayHeaderFontSize ?? 12;
  const dayTextSize = theme.textDayFontSize ?? 14;
  const dayTextColor = theme.dayTextColor ?? "#000";
  const disabledColor = theme.textDisabledColor ?? "#ccc";
  const todayColor = theme.todayTextColor ?? "#007aff";
  const selectedBg = theme.selectedDayBackgroundColor ?? "#007aff";
  const selectedTextColor = theme.selectedDayTextColor ?? "#fff";

  function prevMonth() {
    if (displayMonth === 1) { setDisplayMonth(12); setDisplayYear(y => y - 1); }
    else setDisplayMonth(m => m - 1);
  }
  function nextMonth() {
    if (displayMonth === 12) { setDisplayMonth(1); setDisplayYear(y => y + 1); }
    else setDisplayMonth(m => m + 1);
  }

  // Build grid
  const firstDay = new Date(displayYear, displayMonth - 1, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(displayYear, displayMonth, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // Pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  return (
    <View style={{ backgroundColor: bg, paddingHorizontal: 8, paddingVertical: 10 }}>
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8, paddingHorizontal: 4 }}>
        <TouchableOpacity onPress={prevMonth} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Text style={{ fontSize: 20, color: arrowColor, fontWeight: "400" }}>‹</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: headerSize, fontWeight: headerWeight, color: headerColor }}>
          {MONTHS[displayMonth - 1]} {displayYear}
        </Text>
        <TouchableOpacity onPress={nextMonth} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Text style={{ fontSize: 20, color: arrowColor, fontWeight: "400" }}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Day headers */}
      <View style={{ flexDirection: "row", marginBottom: 4 }}>
        {DAYS.map((d) => (
          <View key={d} style={{ flex: 1, alignItems: "center" }}>
            <Text style={{ fontSize: dayHeaderSize, color: dayHeaderColor }}>{d}</Text>
          </View>
        ))}
      </View>

      {/* Weeks */}
      {weeks.map((week, wi) => (
        <View key={wi} style={{ flexDirection: "row" }}>
          {week.map((day, di) => {
            if (day === null) {
              return <View key={di} style={{ flex: 1 }} />;
            }
            const dateStr = toDateString(displayYear, displayMonth, day);
            const mark = markedDates[dateStr];
            const isSelected = mark && "selected" in mark && mark.selected;
            const selColor = (mark && "selectedColor" in mark && mark.selectedColor) ? mark.selectedColor : selectedBg;
            const isToday = dateStr === todayStr;
            const dots: DotMark[] = (mark && "dots" in mark && mark.dots) ? mark.dots : [];

            return (
              <TouchableOpacity
                key={di}
                style={{ flex: 1, alignItems: "center", paddingVertical: 4 }}
                onPress={() => onDayPress?.({ dateString: dateStr, day, month: displayMonth, year: displayYear })}
              >
                <View style={{
                  width: 32, height: 32, borderRadius: 16,
                  alignItems: "center", justifyContent: "center",
                  backgroundColor: isSelected ? selColor : "transparent",
                }}>
                  <Text style={{
                    fontSize: dayTextSize,
                    color: isSelected ? selectedTextColor : isToday ? todayColor : dayTextColor,
                    fontWeight: isToday ? "700" : "400",
                  }}>
                    {day}
                  </Text>
                </View>
                {dots.length > 0 && (
                  <View style={{ flexDirection: "row", gap: 2, marginTop: 1, height: 5 }}>
                    {dots.slice(0, 3).map((dot, i) => (
                      <View key={i} style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: dot.color }} />
                    ))}
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
}
