"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { PRIORITIES, type Priority } from "@/lib/constants";
import type { Task } from "@/types/app";

export type TaskFormValues = {
  title: string;
  description: string | null;
  priority: Priority;
  due_date: string | null;
};

type TaskModalProps = {
  isOpen: boolean;
  task?: Task | null;
  onClose: () => void;
  onSubmit: (values: TaskFormValues) => Promise<void>;
};

const initialValues: TaskFormValues = {
  title: "",
  description: "",
  priority: "Medium",
  due_date: ""
};

export function TaskModal({ isOpen, task, onClose, onSubmit }: TaskModalProps) {
  const [values, setValues] = useState<TaskFormValues>(initialValues);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setError(null);
    setValues(
      task
        ? {
            title: task.title,
            description: task.description ?? "",
            priority: task.priority,
            due_date: task.due_date ?? ""
          }
        : initialValues
    );
  }, [isOpen, task]);

  if (!isOpen) return null;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = values.title.trim();

    if (!title) {
      setError("Task title is required.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await onSubmit({
        ...values,
        title,
        description: values.description?.trim() || null,
        due_date: values.due_date || null
      });
      onClose();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-6">
      <div className="w-full max-w-lg rounded-lg bg-white shadow-panel">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-lg font-semibold text-ink">{task ? "Edit task" : "New task"}</h2>
          <button
            className="grid size-9 place-items-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
            type="button"
            onClick={onClose}
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        <form className="space-y-4 p-5" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Title</span>
            <input
              className="mt-2 w-full rounded-md border border-line px-3 py-2 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
              value={values.title}
              onChange={(event) => setValues((current) => ({ ...current, title: event.target.value }))}
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Description</span>
            <textarea
              className="mt-2 min-h-28 w-full resize-y rounded-md border border-line px-3 py-2 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
              value={values.description ?? ""}
              onChange={(event) => setValues((current) => ({ ...current, description: event.target.value }))}
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Priority</span>
              <select
                className="mt-2 w-full rounded-md border border-line bg-white px-3 py-2 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                value={values.priority}
                onChange={(event) =>
                  setValues((current) => ({ ...current, priority: event.target.value as Priority }))
                }
              >
                {PRIORITIES.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Due date</span>
              <input
                className="mt-2 w-full rounded-md border border-line px-3 py-2 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                type="date"
                value={values.due_date ?? ""}
                onChange={(event) => setValues((current) => ({ ...current, due_date: event.target.value }))}
              />
            </label>
          </div>

          {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

          <div className="flex justify-end gap-3 pt-2">
            <button
              className="rounded-md border border-line px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-50"
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="rounded-md bg-teal-700 px-4 py-2 font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-70"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
