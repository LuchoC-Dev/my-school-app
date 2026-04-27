import { zustandStorage } from "@/storage/storageAdapter";
import { Task } from "@/types/entities";
import { ITaskRepository } from "./ITaskRepository";

const KEY = "_raw_tasks";

function readAll(): Task[] {
  const raw = zustandStorage.getItem(KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Task[];
  } catch {
    return [];
  }
}

function writeAll(items: Task[]): void {
  zustandStorage.setItem(KEY, JSON.stringify(items));
}

export const taskRepository: ITaskRepository = {
  async getAll() {
    return readAll();
  },

  async getById(id) {
    return readAll().find((t) => t.id === id) ?? null;
  },

  async create(item) {
    const all = readAll();
    all.push(item);
    writeAll(all);
    return item;
  },

  async update(id, patch) {
    const all = readAll();
    const idx = all.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    all[idx] = { ...all[idx], ...patch, updatedAt: new Date().toISOString() };
    writeAll(all);
    return all[idx];
  },

  async delete(id) {
    const all = readAll();
    const next = all.filter((t) => t.id !== id);
    if (next.length === all.length) return false;
    writeAll(next);
    return true;
  },

  async getByActivityId(activityId) {
    return readAll().filter((t) => t.activityId === activityId);
  },
};
