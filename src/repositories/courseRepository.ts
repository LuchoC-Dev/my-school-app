import { zustandStorage } from "@/storage/storageAdapter";
import { Course } from "@/types/entities";
import { ICourseRepository } from "./ICourseRepository";

const KEY = "_raw_courses";

function readAll(): Course[] {
  const raw = zustandStorage.getItem(KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Course[];
  } catch {
    return [];
  }
}

function writeAll(items: Course[]): void {
  zustandStorage.setItem(KEY, JSON.stringify(items));
}

export const courseRepository: ICourseRepository = {
  async getAll() {
    return readAll();
  },

  async getById(id) {
    return readAll().find((c) => c.id === id) ?? null;
  },

  async create(item) {
    const all = readAll();
    all.push(item);
    writeAll(all);
    return item;
  },

  async update(id, patch) {
    const all = readAll();
    const idx = all.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    all[idx] = { ...all[idx], ...patch, updatedAt: new Date().toISOString() };
    writeAll(all);
    return all[idx];
  },

  async delete(id) {
    const all = readAll();
    const next = all.filter((c) => c.id !== id);
    if (next.length === all.length) return false;
    writeAll(next);
    return true;
  },
};
