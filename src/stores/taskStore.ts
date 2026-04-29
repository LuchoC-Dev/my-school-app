import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { zustandStorage } from "@/storage/storageAdapter";
import { Task } from "@/types/entities";
import { taskRepository } from "@/repositories/taskRepository";
import { generateId } from "@/utils/generateId";
import { now } from "@/utils/dateUtils";

interface TaskState {
  tasks: Task[];
  add: (data: Omit<Task, "id" | "createdAt" | "updatedAt">) => Promise<Task>;
  update: (id: string, patch: Partial<Task>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  getById: (id: string) => Task | undefined;
  getByActivityId: (activityId: string) => Task[];
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],

      async add(data) {
        const ts = now();
        const task: Task = { ...data, id: generateId(), createdAt: ts, updatedAt: ts };
        await taskRepository.create(task);
        set((s) => ({ tasks: [...s.tasks, task] }));
        // recalculate parent activity progress
        if (data.activityId) {
          const { useActivityStore } = await import("./activityStore");
          useActivityStore.getState().recalculateProgress(data.activityId);
        }
        return task;
      },

      async update(id, patch) {
        const updated = await taskRepository.update(id, patch);
        if (!updated) return;
        set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? updated : t)) }));
        if (updated.activityId) {
          const { useActivityStore } = await import("./activityStore");
          useActivityStore.getState().recalculateProgress(updated.activityId);
        }
      },

      async remove(id) {
        const task = get().tasks.find((t) => t.id === id);
        await taskRepository.delete(id);
        set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) }));
        if (task) {
          const { useActivityStore } = await import("./activityStore");
          useActivityStore.getState().recalculateProgress(task.activityId);
        }
      },

      getById(id) {
        return get().tasks.find((t) => t.id === id);
      },

      getByActivityId(activityId) {
        return get().tasks.filter((t) => t.activityId === activityId);
      },
    }),
    {
      name: "tasks",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
