import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { zustandStorage } from "@/storage/storageAdapter";
import { getLocales } from "expo-localization";
import i18next from "@/i18n";

function getDefaultLanguage(): "es" | "en" {
  const code = getLocales()[0]?.languageCode ?? "es";
  return code === "en" ? "en" : "es";
}

export type CalendarViewDefault = "day" | "week" | "month";
export type WeekStartDay = "sun" | "mon" | "sat";
export type AppFontFamily = "caveat" | "georgia" | "system";
export type AppLanguage = "es" | "en";

export type AccentColor =
  | "#2A2016"
  | "#4A7FB5"
  | "#7060D0"
  | "#D4753A"
  | "#5A9E6A"
  | "#C94A3A"
  | "#C47FB0";

interface NotificationSettings {
  master: boolean;
  tasks: boolean;
  activities: boolean;
  projects: boolean;
  dailyReminder: boolean;
  daysAhead: number;
}

interface SettingsState {
  // Account
  userName: string;
  userAvatar: string;
  setUserName: (name: string) => void;
  setUserAvatar: (avatar: string) => void;

  // General — Calendar
  calendarViewDefault: CalendarViewDefault;
  weekStart: WeekStartDay;
  setCalendarViewDefault: (v: CalendarViewDefault) => void;
  setWeekStart: (d: WeekStartDay) => void;

  // Notifications
  notifications: NotificationSettings;
  setNotifications: (partial: Partial<NotificationSettings>) => void;

  // Appearance
  accentColor: AccentColor;
  fontScale: number; // 0.85 – 1.2
  fontFamily: AppFontFamily;
  setAccentColor: (c: AccentColor) => void;
  setFontScale: (s: number) => void;
  setFontFamily: (f: AppFontFamily) => void;

  // Language
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      userName: "Luciano García",
      userAvatar: "🧑",
      setUserName: (userName) => set({ userName }),
      setUserAvatar: (userAvatar) => set({ userAvatar }),

      calendarViewDefault: "day",
      weekStart: "mon",
      setCalendarViewDefault: (calendarViewDefault) => set({ calendarViewDefault }),
      setWeekStart: (weekStart) => set({ weekStart }),

      notifications: {
        master: true,
        tasks: true,
        activities: true,
        projects: false,
        dailyReminder: false,
        daysAhead: 2,
      },
      setNotifications: (partial) =>
        set((s) => ({ notifications: { ...s.notifications, ...partial } })),

      accentColor: "#D4753A",
      fontScale: 1,
      fontFamily: "caveat",
      setAccentColor: (accentColor) => set({ accentColor }),
      setFontScale: (fontScale) => set({ fontScale }),
      setFontFamily: (fontFamily) => set({ fontFamily }),

      language: getDefaultLanguage(),
      setLanguage: (language) => {
        set({ language });
        i18next.changeLanguage(language);
      },
    }),
    {
      name: "settings-store",
      storage: createJSONStorage(() => zustandStorage),
      onRehydrateStorage: () => (state) => {
        if (state?.language) {
          i18next.changeLanguage(state.language);
        }
      },
    }
  )
);
