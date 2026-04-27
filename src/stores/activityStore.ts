import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { zustandStorage } from "@/storage/storageAdapter";
import { Activity } from "@/types/entities";
import { activityRepository } from "@/repositories/activityRepository";
import { taskRepository } from "@/repositories/taskRepository";
import { generateId } from "@/utils/generateId";
import { now } from "@/utils/dateUtils";

interface ActivityState {
  activities: Activity[];
  add: (data: Omit<Activity, "id" | "progress" | "createdAt" | "updatedAt">) => Promise<Activity>;
  update: (id: string, patch: Partial<Activity>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  recalculateProgress: (activityId: string) => Promise<void>;
  getById: (id: string) => Activity | undefined;
  getByCourseId: (courseId: string) => Activity[];
  getByProjectId: (projectId: string) => Activity[];
}

export const useActivityStore = create<ActivityState>()(
  persist(
    (set, get) => ({
      activities: [],

      async add(data) {
        const ts = now();
        const activity: Activity = { ...data, id: generateId(), progress: 0, createdAt: ts, updatedAt: ts };
        await activityRepository.create(activity);
        set((s) => ({ activities: [...s.activities, activity] }));
        return activity;
      },

      async update(id, patch) {
        const updated = await activityRepository.update(id, patch);
        if (!updated) return;
        set((s) => ({ activities: s.activities.map((a) => (a.id === id ? updated : a)) }));
      },

      async remove(id) {
        // cascade: delete all tasks for this activity
        const tasks = await taskRepository.getByActivityId(id);
        for (const t of tasks) await taskRepository.delete(t.id);
        await activityRepository.delete(id);
        set((s) => ({ activities: s.activities.filter((a) => a.id !== id) }));
        // sync taskStore state
        const { useTaskStore } = await import("./taskStore");
        useTaskStore.setState((s) => ({ tasks: s.tasks.filter((t) => t.activityId !== id) }));
      },

      async recalculateProgress(activityId) {
        const tasks = await taskRepository.getByActivityId(activityId);
        const progress =
          tasks.length === 0
            ? 0
            : tasks.filter((t) => t.completed).length / tasks.length;
        const updated = await activityRepository.update(activityId, { progress });
        if (!updated) return;
        set((s) => ({
          activities: s.activities.map((a) => (a.id === activityId ? updated : a)),
        }));
      },

      getById(id) {
        return get().activities.find((a) => a.id === id);
      },

      getByCourseId(courseId) {
        return get().activities.filter((a) => a.courseId === courseId);
      },

      getByProjectId(projectId) {
        return get().activities.filter((a) => a.projectId === projectId);
      },
    }),
    {
      name: "activities",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
