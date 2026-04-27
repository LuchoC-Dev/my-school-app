import { zustandStorage } from "@/storage/storageAdapter";
import { Project } from "@/types/entities";
import { IProjectRepository } from "./IProjectRepository";

const KEY = "_raw_projects";

function readAll(): Project[] {
  const raw = zustandStorage.getItem(KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Project[];
  } catch {
    return [];
  }
}

function writeAll(items: Project[]): void {
  zustandStorage.setItem(KEY, JSON.stringify(items));
}

export const projectRepository: IProjectRepository = {
  async getAll() {
    return readAll();
  },

  async getById(id) {
    return readAll().find((p) => p.id === id) ?? null;
  },

  async create(item) {
    const all = readAll();
    all.push(item);
    writeAll(all);
    return item;
  },

  async update(id, patch) {
    const all = readAll();
    const idx = all.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    all[idx] = { ...all[idx], ...patch, updatedAt: new Date().toISOString() };
    writeAll(all);
    return all[idx];
  },

  async delete(id) {
    const all = readAll();
    const next = all.filter((p) => p.id !== id);
    if (next.length === all.length) return false;
    writeAll(next);
    return true;
  },

  async getByCourseId(courseId) {
    return readAll().filter((p) => p.courseId === courseId);
  },
};
