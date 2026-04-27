export type ActivityType = "assignment" | "exam" | "project" | "reading" | "other";

export type CourseColor = "orange" | "blue" | "violet" | "green";

export type Status = "pending" | "in_progress" | "completed";

export interface Course {
  id: string;
  name: string;
  description?: string;
  color: CourseColor;
  emoji?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  courseId: string;
  name: string;
  description?: string;
  status: Status;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: string;
  courseId: string;
  projectId?: string;
  name: string;
  type: ActivityType;
  status: Status;
  dueDate?: string;
  progress: number; // 0.0 – 1.0, computed from tasks
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  activityId: string;
  title: string;
  completed: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}
