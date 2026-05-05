import { useState, useMemo } from "react";
import { View, TextInput, TouchableOpacity, ScrollView, Text } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/hooks/useTheme";
import { useSmartBack } from "@/hooks/useSmartBack";
import { ThemedText, Chip } from "@/components/ui";
import { useCourseStore } from "@/stores/courseStore";
import { useProjectStore } from "@/stores/projectStore";
import { useActivityStore } from "@/stores/activityStore";
import { useTaskStore } from "@/stores/taskStore";
import { courseColors } from "@/theme/tokens";
import { FontFamily, FontSize } from "@/theme/typography";

type FilterType = "all" | "courses" | "projects" | "activities" | "tasks";
type ResultType = "course" | "project" | "activity" | "task";

interface SearchResult {
  id: string;
  type: ResultType;
  title: string;
  breadcrumb: string;
  courseAccent: string;
  indent: number;
  onPress: () => void;
}

function HighlightedText({ text, query, style }: { text: string; query: string; style?: object }) {
  if (!query.trim()) return <Text style={style}>{text}</Text>;
  const lower = text.toLowerCase();
  const q = query.toLowerCase();
  const parts: { str: string; highlight: boolean }[] = [];
  let cursor = 0;
  let idx: number;
  while ((idx = lower.indexOf(q, cursor)) !== -1) {
    if (idx > cursor) parts.push({ str: text.slice(cursor, idx), highlight: false });
    parts.push({ str: text.slice(idx, idx + q.length), highlight: true });
    cursor = idx + q.length;
  }
  if (cursor < text.length) parts.push({ str: text.slice(cursor), highlight: false });
  return (
    <Text style={style}>
      {parts.map((p, i) =>
        p.highlight ? (
          <Text key={i} style={{ backgroundColor: "#FFF3C4", borderRadius: 2 }}>{p.str}</Text>
        ) : (
          <Text key={i}>{p.str}</Text>
        )
      )}
    </Text>
  );
}

export default function SearchScreen() {
  const { t } = useTranslation();
  const tokens = useTheme();
  const router = useRouter();
  const goBack = useSmartBack("/(tabs)/");
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");

  const FILTERS: { value: FilterType; label: string }[] = [
    { value: "all", label: t("search.filters.all") },
    { value: "courses", label: t("search.filters.courses") },
    { value: "projects", label: t("search.filters.projects") },
    { value: "activities", label: t("search.filters.activities") },
    { value: "tasks", label: t("search.filters.tasks") },
  ];

  const TYPE_LABELS: Record<ResultType, string> = {
    course: t("search.typeLabels.course"),
    project: t("search.typeLabels.project"),
    activity: t("search.typeLabels.activity"),
    task: t("search.typeLabels.task"),
  };

  const courses = useCourseStore((s) => s.courses);
  const projects = useProjectStore((s) => s.projects);
  const activities = useActivityStore((s) => s.activities);
  const tasks = useTaskStore((s) => s.tasks);

  const noSubject = t("search.breadcrumb.noSubject");

  const results = useMemo<SearchResult[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const out: SearchResult[] = [];
    const added = new Set<string>();
    const matches = (str: string) => str.toLowerCase().includes(q);

    const accent = (courseId?: string) => {
      const c = courses.find((c) => c.id === courseId);
      return c ? courseColors[c.color]?.accent ?? tokens.accent : tokens.accent;
    };

    // Courses
    courses.forEach((c) => {
      if (!matches(c.name)) return;
      out.push({
        id: c.id, type: "course", title: c.name,
        breadcrumb: t("search.typeLabels.course"),
        courseAccent: courseColors[c.color]?.accent ?? tokens.accent,
        indent: 0, onPress: () => router.push(`/courses/${c.id}`),
      });
    });

    // Projects + their matching children
    projects.forEach((p) => {
      const course = courses.find((c) => c.id === p.courseId);
      const pAccent = accent(p.courseId);
      if (matches(p.name)) {
        out.push({
          id: p.id, type: "project", title: p.name,
          breadcrumb: `${t("search.typeLabels.project")} · ${course?.name ?? noSubject}`,
          courseAccent: pAccent, indent: 0,
          onPress: () => router.push(`/projects/${p.id}`),
        });
        added.add(`project-${p.id}`);
        // Child activities
        activities.filter((a) => a.projectId === p.id && matches(a.name)).forEach((a) => {
          out.push({
            id: a.id, type: "activity", title: a.name,
            breadcrumb: `${t("search.typeLabels.activity")} · ${p.name} · ${course?.name ?? ""}`,
            courseAccent: pAccent, indent: 1,
            onPress: () => router.push(`/activities/${a.id}`),
          });
          added.add(`activity-${a.id}`);
          tasks.filter((tk) => tk.activityId === a.id && matches(tk.title)).forEach((tk) => {
            out.push({
              id: tk.id, type: "task", title: tk.title,
              breadcrumb: `${t("search.typeLabels.task")} · ${a.name} · ${course?.name ?? ""}`,
              courseAccent: pAccent, indent: 2,
              onPress: () => router.push(`/tasks/${tk.id}`),
            });
            added.add(`task-${tk.id}`);
          });
        });
      }
    });

    // Activities not under matched project
    activities.filter((a) => matches(a.name) && !added.has(`activity-${a.id}`)).forEach((a) => {
      const course = courses.find((c) => c.id === a.courseId);
      const aAccent = accent(a.courseId);
      const project = projects.find((p) => p.id === a.projectId);
      out.push({
        id: a.id, type: "activity", title: a.name,
        breadcrumb: `${t("search.typeLabels.activity")} · ${project ? project.name + " · " : ""}${course?.name ?? noSubject}`,
        courseAccent: aAccent, indent: 0,
        onPress: () => router.push(`/activities/${a.id}`),
      });
      added.add(`activity-${a.id}`);
      tasks.filter((tk) => tk.activityId === a.id && matches(tk.title)).forEach((tk) => {
        out.push({
          id: tk.id, type: "task", title: tk.title,
          breadcrumb: `${t("search.typeLabels.task")} · ${a.name} · ${course?.name ?? ""}`,
          courseAccent: aAccent, indent: 1,
          onPress: () => router.push(`/tasks/${tk.id}`),
        });
        added.add(`task-${tk.id}`);
      });
    });

    // Remaining tasks
    tasks.filter((tk) => matches(tk.title) && !added.has(`task-${tk.id}`)).forEach((tk) => {
      const activity = activities.find((a) => a.id === tk.activityId);
      const course = courses.find((c) => c.id === activity?.courseId);
      out.push({
        id: tk.id, type: "task", title: tk.title,
        breadcrumb: `${t("search.typeLabels.task")} · ${activity ? activity.name + " · " : ""}${course?.name ?? noSubject}`,
        courseAccent: accent(activity?.courseId), indent: 0,
        onPress: () => router.push(`/tasks/${tk.id}`),
      });
    });

    return out;
  }, [query, courses, projects, activities, tasks, t, noSubject]);

  const filtered = useMemo(() => {
    if (filter === "all") return results;
    const typeMap: Record<FilterType, string> = {
      all: "", courses: "course", projects: "project", activities: "activity", tasks: "task",
    };
    return results.filter((r) => r.type === typeMap[filter]);
  }, [results, filter]);

  return (
    <View style={{ flex: 1, backgroundColor: tokens.background }}>
      {/* Header */}
      <View style={{
        paddingTop: insets.top + 8,
        paddingBottom: 6,
        paddingHorizontal: 12,
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
      }}>
        <TouchableOpacity onPress={() => goBack()}>
          <ThemedText variant="body" style={{ color: tokens.accent }}>{t("search.back")}</ThemedText>
        </TouchableOpacity>

        <View style={{
          flex: 1, flexDirection: "row", alignItems: "center", gap: 6,
          backgroundColor: tokens.surface, borderRadius: 10,
          paddingHorizontal: 10, paddingVertical: 6,
          borderWidth: 1.5, borderColor: tokens.textPrimary,
        }}>
          <Text style={{ fontSize: 13, color: tokens.textSecondary }}>🔍</Text>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={t("search.placeholder")}
            placeholderTextColor={tokens.textSecondary}
            autoFocus
            style={{
              flex: 1, padding: 0,
              color: tokens.textPrimary,
              fontFamily: FontFamily.caveatRegular,
              fontSize: FontSize.body,
              fontWeight: "600",
            }}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery("")}>
              <ThemedText variant="metadata" style={{ color: tokens.textSecondary }}>✕</ThemedText>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity onPress={() => goBack()}>
          <ThemedText variant="metadata" style={{ color: tokens.textSecondary }}>{t("search.cancel")}</ThemedText>
        </TouchableOpacity>
      </View>

      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 12, gap: 6, paddingBottom: 6 }}
        style={{ flexGrow: 0 }}
      >
        {FILTERS.map((f) => (
          <Chip key={f.value} label={f.label} active={filter === f.value} onPress={() => setFilter(f.value)} />
        ))}
      </ScrollView>

      {/* Result count */}
      {query.trim().length > 0 && (
        <ThemedText
          variant="metadata"
          style={{ color: tokens.textSecondary, paddingHorizontal: 14, paddingBottom: 4, textTransform: "uppercase", letterSpacing: 0.4 }}
        >
          {t("search.result", { count: filtered.length })}
        </ThemedText>
      )}

      {/* Results list */}
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        {query.trim().length === 0 ? (
          <View style={{ padding: 40, alignItems: "center", gap: 8 }}>
            <Text style={{ fontSize: 40 }}>🔍</Text>
            <ThemedText variant="body" style={{ color: tokens.textSecondary, textAlign: "center" }}>
              {t("search.empty")}
            </ThemedText>
          </View>
        ) : filtered.length === 0 ? (
          <View style={{ padding: 40, alignItems: "center" }}>
            <ThemedText variant="body" style={{ color: tokens.textSecondary }}>
              {t("search.noResults", { query })}
            </ThemedText>
          </View>
        ) : (
          filtered.map((item, index) => {
            const prev = filtered[index - 1];
            const showDivider = index > 0 && item.indent === 0 && (prev?.indent === 0);
            return (
              <View key={`${item.type}-${item.id}`}>
                {showDivider && (
                  <View style={{ height: 1, backgroundColor: tokens.borderLight, marginHorizontal: 14, marginVertical: 3 }} />
                )}
                <TouchableOpacity
                  onPress={item.onPress}
                  style={{
                    flexDirection: "row", alignItems: "center", gap: 8,
                    paddingVertical: 7,
                    paddingLeft: 14 + item.indent * 12,
                    paddingRight: 14,
                    borderBottomWidth: 1,
                    borderBottomColor: tokens.borderLight,
                  }}
                >
                  {/* Icon */}
                  {item.type === "task" ? (
                    <View style={{ width: 12, height: 12, borderRadius: 3, borderWidth: 1.5, borderColor: tokens.textSecondary, flexShrink: 0 }} />
                  ) : item.type === "activity" ? (
                    <View style={{ width: 12, height: 12, borderRadius: 6, borderWidth: 1.5, borderColor: tokens.textSecondary, flexShrink: 0 }} />
                  ) : item.type === "project" ? (
                    <Text style={{ fontSize: 14, flexShrink: 0 }}>📁</Text>
                  ) : (
                    <Text style={{ fontSize: 14, flexShrink: 0 }}>🏫</Text>
                  )}

                  {/* Body */}
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <HighlightedText
                      text={item.title}
                      query={query}
                      style={{
                        fontFamily: FontFamily.caveatBold,
                        fontSize: FontSize.body,
                        color: tokens.textPrimary,
                      }}
                    />
                    <Text
                      numberOfLines={1}
                      style={{
                        fontFamily: FontFamily.caveatRegular,
                        fontSize: 10,
                        color: tokens.textSecondary,
                        marginTop: 1,
                      }}
                    >
                      {item.breadcrumb}
                    </Text>
                  </View>

                  {/* Type tag */}
                  <View style={{
                    borderWidth: 1, borderColor: item.courseAccent,
                    borderRadius: 999, paddingHorizontal: 5, paddingVertical: 1, flexShrink: 0,
                  }}>
                    <Text style={{ fontFamily: FontFamily.caveatRegular, fontSize: 9, color: item.courseAccent }}>
                      {TYPE_LABELS[item.type]}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}
