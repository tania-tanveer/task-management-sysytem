"use client";

import { Calendar, Pencil, Trash2 } from "lucide-react";
import clsx from "clsx";
import type { Task } from "@/types/app";

type TaskCardProps = {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
};

const priorityClasses = {
  High: "bg-red-50 text-red-700 border-red-100",
  Medium: "bg-amber-50 text-amber-700 border-amber-100",
  Low: "bg-emerald-50 text-emerald-700 border-emerald-100"
};

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const dueDate = task.due_date
    ? new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(
        new Date(`${task.due_date}T00:00:00`)
      )
    : null;

  return (
    <article className="rounded-lg border border-line bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <h3 className="min-w-0 flex-1 break-words font-semibold text-ink">{task.title}</h3>
        <div className="flex shrink-0 items-center gap-1">
          <button
            className="grid size-8 place-items-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
            type="button"
            title="Edit task"
            onClick={() => onEdit(task)}
          >
            <Pencil size={15} />
          </button>
          <button
            className="grid size-8 place-items-center rounded-md text-slate-500 transition hover:bg-red-50 hover:text-red-700"
            type="button"
            title="Delete task"
            onClick={() => onDelete(task.id)}
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {task.description ? <p className="mt-2 break-words text-sm leading-6 text-slate-600">{task.description}</p> : null}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className={clsx("rounded-full border px-2.5 py-1 text-xs font-semibold", priorityClasses[task.priority])}>
          {task.priority}
        </span>
        {dueDate ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">
            <Calendar size={13} />
            {dueDate}
          </span>
        ) : null}
      </div>
    </article>
  );
}
