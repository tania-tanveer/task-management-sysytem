"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { ArrowLeft, Plus } from "lucide-react";
import { BoardColumn } from "@/components/board/BoardColumn";
import { TaskModal, type TaskFormValues } from "@/components/tasks/TaskModal";
import { TASK_STATUSES, type TaskStatus } from "@/lib/constants";
import { createClient } from "@/lib/supabase/browser";
import type { Board, Task } from "@/types/app";

type BoardViewProps = {
  board: Board;
  initialTasks: Task[];
  userId: string;
};

type ModalState = {
  isOpen: boolean;
  task: Task | null;
  status: TaskStatus;
};

const modalDefault: ModalState = {
  isOpen: false,
  task: null,
  status: "todo"
};

export function BoardView({ board, initialTasks, userId }: BoardViewProps) {
  const supabase = createClient();
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [modal, setModal] = useState<ModalState>(modalDefault);
  const [error, setError] = useState<string | null>(null);

  const tasksByStatus = useMemo(() => {
    return TASK_STATUSES.reduce(
      (groups, status) => {
        groups[status] = tasks
          .filter((task) => task.status === status)
          .sort((a, b) => a.position - b.position || a.created_at.localeCompare(b.created_at));
        return groups;
      },
      {} as Record<TaskStatus, Task[]>
    );
  }, [tasks]);

  function openCreateTask(status: TaskStatus = "todo") {
    setModal({ isOpen: true, task: null, status });
  }

  function openEditTask(task: Task) {
    setModal({ isOpen: true, task, status: task.status });
  }

  async function saveTask(values: TaskFormValues) {
    setError(null);

    if (modal.task) {
      const { data, error: updateError } = await supabase
        .from("tasks")
        .update(values)
        .eq("id", modal.task.id)
        .select()
        .single();

      if (updateError) throw new Error(updateError.message);
      setTasks((current) => current.map((task) => (task.id === data.id ? data : task)));
      return;
    }

    const nextPosition = tasksByStatus[modal.status].length;
    const { data, error: insertError } = await supabase
      .from("tasks")
      .insert({
        ...values,
        board_id: board.id,
        user_id: userId,
        status: modal.status,
        position: nextPosition
      })
      .select()
      .single();

    if (insertError) throw new Error(insertError.message);
    setTasks((current) => [...current, data]);
  }

  async function deleteTask(taskId: string) {
    const previousTasks = tasks;
    setTasks((current) => current.filter((task) => task.id !== taskId));
    setError(null);

    const { error: deleteError } = await supabase.from("tasks").delete().eq("id", taskId);

    if (deleteError) {
      setTasks(previousTasks);
      setError(deleteError.message);
    }
  }

  async function persistPositions(nextTasks: Task[], changedTasks: Task[]) {
    const updates = changedTasks.map((task) =>
      supabase.from("tasks").update({ status: task.status, position: task.position }).eq("id", task.id)
    );
    const results = await Promise.all(updates);
    const failed = results.find((result) => result.error);

    if (failed?.error) {
      throw new Error(failed.error.message);
    }

    setTasks(nextTasks);
  }

  async function handleDragEnd(result: DropResult) {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    const sourceStatus = source.droppableId as TaskStatus;
    const destinationStatus = destination.droppableId as TaskStatus;

    if (sourceStatus === destinationStatus && source.index === destination.index) return;

    const previousTasks = tasks;
    const nextColumns: Record<TaskStatus, Task[]> = {
      todo: [...tasksByStatus.todo],
      in_progress: [...tasksByStatus.in_progress],
      done: [...tasksByStatus.done]
    };

    const [movedTask] = nextColumns[sourceStatus].splice(source.index, 1);
    if (!movedTask || movedTask.id !== draggableId) return;

    nextColumns[destinationStatus].splice(destination.index, 0, {
      ...movedTask,
      status: destinationStatus
    });

    const nextTasks = TASK_STATUSES.flatMap((status) =>
      nextColumns[status].map((task, index) => ({
        ...task,
        status,
        position: index
      }))
    );

    const changedTasks = nextTasks.filter((nextTask) => {
      const previousTask = previousTasks.find((task) => task.id === nextTask.id);
      return previousTask?.status !== nextTask.status || previousTask?.position !== nextTask.position;
    });

    setTasks(nextTasks);
    setError(null);

    try {
      await persistPositions(nextTasks, changedTasks);
    } catch (dragError) {
      setTasks(previousTasks);
      setError(dragError instanceof Error ? dragError.message : "Unable to move task.");
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          <Link className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-teal-700" href="/dashboard">
            <ArrowLeft size={16} />
            Dashboard
          </Link>
          <h1 className="truncate text-3xl font-bold text-ink">{board.title}</h1>
        </div>
        <button
          className="inline-flex items-center justify-center gap-2 rounded-md bg-teal-700 px-4 py-2.5 font-semibold text-white transition hover:bg-teal-800"
          type="button"
          onClick={() => openCreateTask("todo")}
        >
          <Plus size={18} />
          Add task
        </button>
      </div>

      {error ? <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid gap-4 lg:grid-cols-3">
          {TASK_STATUSES.map((status) => (
            <BoardColumn
              key={status}
              status={status}
              tasks={tasksByStatus[status]}
              onAddTask={openCreateTask}
              onEditTask={openEditTask}
              onDeleteTask={deleteTask}
            />
          ))}
        </div>
      </DragDropContext>

      <TaskModal
        isOpen={modal.isOpen}
        task={modal.task}
        onClose={() => setModal(modalDefault)}
        onSubmit={saveTask}
      />
    </main>
  );
}
