export const TASK_STATUSES = ["todo", "in_progress", "done"] as const;

export const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "To Do",
  in_progress: "In Progress",
  done: "Done"
};

export const PRIORITIES = ["Low", "Medium", "High"] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];
export type Priority = (typeof PRIORITIES)[number];
