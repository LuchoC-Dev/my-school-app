import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { zustandStorage } from "@/storage/storageAdapter";
import { Project } from "@/types/entities";
import { projectRepository } from "@/repositories/projectRepository";
import { generateId } from "@/utils/generateId";
import { now } from "@/utils/dateUtils";

interface ProjectState {
  projects: Project[];
  add: (data: Omit<Project, "id" | "createdAt" | "updatedAt">) => Promise<Project>;
  update: (id: string, patch: Partial<Project>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  getById: (id: string) => Project | undefined;
  getByCourseId: (courseId: string) => Project[];
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      projects: [],

      async add(data) {
        const ts = now();
        const project: Project = { ...data, id: generateId(), createdAt: ts, updatedAt: ts };
        await projectRepository.create(project);
        set((s) => ({ projects: [...s.projects, project] }));
        return project;
      },

      async update(id, patch) {
        const updated = await projectRepository.update(id, patch);
        if (!updated) return;
        set((s) => ({ projects: s.projects.map((p) => (p.id === id ? updated : p)) }));
      },

      async remove(id) {
        await projectRepository.delete(id);
        set((s) => ({ projects: s.projects.filter((p) => p.id !== id) }));
      },

      getById(id) {
        return get().projects.find((p) => p.id === id);
      },

      getByCourseId(courseId) {
        return get().projects.filter((p) => p.courseId === courseId);
      },
    }),
    {
      name: "projects",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
