import { IRepository } from "./IRepository";
import { Task } from "@/types/entities";

export interface ITaskRepository extends IRepository<Task> {
  getByActivityId(activityId: string): Promise<Task[]>;
}
