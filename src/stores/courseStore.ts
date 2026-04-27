import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { zustandStorage } from "@/storage/storageAdapter";
import { Course } from "@/types/entities";
import { courseRepository } from "@/repositories/courseRepository";
import { projectRepository } from "@/repositories/projectRepository";
import { activityRepository } from "@/repositories/activityRepository";
import { taskRepository } from "@/repositories/taskRepository";
import { generateId } from "@/utils/generateId";
import { now } from "@/utils/dateUtils";

interface CourseState {
  courses: Course[];
  add: (data: Omit<Course, "id" | "createdAt" | "updatedAt">) => Promise<Course>;
  update: (id: string, patch: Partial<Course>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  getById: (id: string) => Course | undefined;
}

export const useCourseStore = create<CourseState>()(
  persist(
    (set, get) => ({
      courses: [],

      async add(data) {
        const ts = now();
        const course: Course = { ...data, id: generateId(), createdAt: ts, updatedAt: ts };
        await courseRepository.create(course);
        set((s) => ({ courses: [...s.courses, course] }));
        return course;
      },

      async update(id, patch) {
        const updated = await courseRepository.update(id, patch);
        if (!updated) return;
        set((s) => ({ courses: s.courses.map((c) => (c.id === id ? updated : c)) }));
      },

      async remove(id) {
        // cascade: delete all activities (and their tasks) for this course
        const activities = await activityRepository.getByCourseId(id);
        const deletedActivityIds = new Set(activities.map((a) => a.id));
        for (const a of activities) {
          const tasks = await taskRepository.getByActivityId(a.id);
          for (const t of tasks) await taskRepository.delete(t.id);
          await activityRepository.delete(a.id);
        }
        // cascade: delete all projects for this course
        const projects = await projectRepository.getByCourseId(id);
        for (const p of projects) await projectRepository.delete(p.id);
        // delete the course itself
        await courseRepository.delete(id);

        // sync all Zustand state slices (lazy import to avoid circular module refs)
        set((s) => ({ courses: s.courses.filter((c) => c.id !== id) }));
        const { useProjectStore } = await import("./projectStore");
        useProjectStore.setState((s) => ({ projects: s.projects.filter((p) => p.courseId !== id) }));
        const { useActivityStore } = await import("./activityStore");
        useActivityStore.setState((s) => ({ activities: s.activities.filter((a) => a.courseId !== id) }));
        const { useTaskStore } = await import("./taskStore");
        useTaskStore.setState((s) => ({ tasks: s.tasks.filter((t) => !deletedActivityIds.has(t.activityId)) }));
      },

      getById(id) {
        return get().courses.find((c) => c.id === id);
      },
    }),
    {
      name: "courses",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
