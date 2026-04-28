export type ActivityType = "assignment" | "exam" | "project" | "reading" | "other";

export type CourseColor = "orange" | "blue" | "violet" | "green";

export type Status = "pending" | "in_progress" | "completed";

export type WeekDay = "Lu" | "Ma" | "Mi" | "Ju" | "Vi" | "Sa" | "Do";

export interface CourseSchedule {
  day: WeekDay;
  from: string; // "HH:MM"
  to: string;   // "HH:MM"
}

export interface Course {
  id: string;
  name: string;
  description?: string;
  professor?: string;
  color: CourseColor;
  emoji?: string;
  schedules: CourseSchedule[];
  createdAt: string;
  updatedAt: string;
}

export interface MaterialLink {
  label: string;
  url: string;
  type: "link" | "file";
  mimeType?: string;
}

export interface Project {
  id: string;
  courseId: string;
  name: string;
  description?: string;
  status: Status;
  dueDate?: string;
  links?: MaterialLink[];
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
  links?: MaterialLink[];
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  activityId: string;
  title: string;
  completed: boolean;
  order: number;
  dueDate?: string;
  notes?: string;
  links?: MaterialLink[];
  createdAt: string;
  updatedAt: string;
}
