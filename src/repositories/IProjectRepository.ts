import { IRepository } from "./IRepository";
import { Project } from "@/types/entities";

export interface IProjectRepository extends IRepository<Project> {
  getByCourseId(courseId: string): Promise<Project[]>;
}
