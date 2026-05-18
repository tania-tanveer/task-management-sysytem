"use client";

import { Droppable, Draggable } from "@hello-pangea/dnd";
import { Plus } from "lucide-react";
import clsx from "clsx";
import { STATUS_LABELS, type TaskStatus } from "@/lib/constants";
import { TaskCard } from "@/components/tasks/TaskCard";
import type { Task } from "@/types/app";

type BoardColumnProps = {
  status: TaskStatus;
  tasks: Task[];
  onAddTask: (status: TaskStatus) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
};

export function BoardColumn({ status, tasks, onAddTask, onEditTask, onDeleteTask }: BoardColumnProps) {
  return (
    <section className="flex min-h-[32rem] min-w-0 flex-col rounded-lg border border-line bg-slate-100">
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <div className="min-w-0">
          <h2 className="truncate font-semibold text-ink">{STATUS_LABELS[status]}</h2>
          <p className="text-sm text-slate-500">{tasks.length} tasks</p>
        </div>
        <button
          className="grid size-9 place-items-center rounded-md bg-white text-slate-600 transition hover:bg-teal-700 hover:text-white"
          type="button"
          onClick={() => onAddTask(status)}
          title={`Add task to ${STATUS_LABELS[status]}`}
        >
          <Plus size={18} />
        </button>
      </div>

      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            className={clsx(
              "task-scrollbar flex-1 space-y-3 overflow-y-auto p-3 transition",
              snapshot.isDraggingOver && "bg-teal-50"
            )}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {tasks.map((task, index) => (
              <Draggable draggableId={task.id} index={index} key={task.id}>
                {(dragProvided, dragSnapshot) => (
                  <div
                    ref={dragProvided.innerRef}
                    {...dragProvided.draggableProps}
                    {...dragProvided.dragHandleProps}
                    className={clsx(dragSnapshot.isDragging && "rotate-1 shadow-panel")}
                  >
                    <TaskCard task={task} onEdit={onEditTask} onDelete={onDeleteTask} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </section>
  );
}
