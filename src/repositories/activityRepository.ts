import { zustandStorage } from "@/storage/storageAdapter";
import { Activity } from "@/types/entities";
import { IActivityRepository } from "./IActivityRepository";

const KEY = "_raw_activities";

function readAll(): Activity[] {
  const raw = zustandStorage.getItem(KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Activity[];
  } catch {
    return [];
  }
}

function writeAll(items: Activity[]): void {
  zustandStorage.setItem(KEY, JSON.stringify(items));
}

export const activityRepository: IActivityRepository = {
  async getAll() {
    return readAll();
  },

  async getById(id) {
    return readAll().find((a) => a.id === id) ?? null;
  },

  async create(item) {
    const all = readAll();
    all.push(item);
    writeAll(all);
    return item;
  },

  async update(id, patch) {
    const all = readAll();
    const idx = all.findIndex((a) => a.id === id);
    if (idx === -1) return null;
    all[idx] = { ...all[idx], ...patch, updatedAt: new Date().toISOString() };
    writeAll(all);
    return all[idx];
  },

  async delete(id) {
    const all = readAll();
    const next = all.filter((a) => a.id !== id);
    if (next.length === all.length) return false;
    writeAll(next);
    return true;
  },

  async getByCourseId(courseId) {
    return readAll().filter((a) => a.courseId === courseId);
  },

  async getByProjectId(projectId) {
    return readAll().filter((a) => a.projectId === projectId);
  },
};
