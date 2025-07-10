import type { Task, Filter } from "../types/types";

export const searchTasks = (tasks: Task[], filters: Filter): Task[] => {
  return tasks.filter((task) => {
    if(filters.status && task.status !== filters.status) {
      return false;
    }
    if(filters.priority && task.priority !== filters.priority) {
      return false;
    }
    return true;
  });
};