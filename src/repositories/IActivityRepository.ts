import { IRepository } from "./IRepository";
import { Activity } from "@/types/entities";

export interface IActivityRepository extends IRepository<Activity> {
  getByCourseId(courseId: string): Promise<Activity[]>;
  getByProjectId(projectId: string): Promise<Activity[]>;
}
