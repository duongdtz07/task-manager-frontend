import { useMemo } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Task, TaskStatus } from '../store/useTaskStore';
import TaskCard from './TaskCard';

interface ColumnProps {
  status: TaskStatus;
  title: string;
  tasks: Task[];
}

const columnConfig = {
  TODO: {
    colClass: 'col-todo',
    headerClass: 'col-header-todo',
    badgeClass: 'badge-todo',
    dotClass: 'dot-todo',
    iconColor: 'text-blue-400',
    label: 'TO DO',
    emoji: '📋',
  },
  IN_PROGRESS: {
    colClass: 'col-inprogress',
    headerClass: 'col-header-inprogress',
    badgeClass: 'badge-inprogress',
    dotClass: 'dot-inprogress dot-pulse',
    iconColor: 'text-amber-400',
    label: 'IN PROGRESS',
    emoji: '⚡',
  },
  DONE: {
    colClass: 'col-done',
    headerClass: 'col-header-done',
    badgeClass: 'badge-done',
    dotClass: 'dot-done',
    iconColor: 'text-emerald-400',
    label: 'DONE',
    emoji: '✅',
  },
};

export default function Column({ status, tasks }: ColumnProps) {
  const taskIds = useMemo(() => tasks.map((t) => t.id), [tasks]);
  const config = columnConfig[status];

  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: {
      type: 'Column',
      status,
    },
  });

  return (
    <div className={`flex flex-col flex-1 min-w-[300px] h-full rounded-2xl overflow-hidden ${config.colClass} transition-all duration-200 ${isOver ? 'scale-[1.01] shadow-2xl' : ''}`}>

      {/* Column Header */}
      <div className={`px-4 py-3.5 ${config.headerClass} flex items-center justify-between`}>
        <div className="flex items-center gap-2.5">
          <span className={`w-2 h-2 rounded-full ${config.dotClass} flex-shrink-0`} />
          <span className="text-xs font-bold tracking-[0.12em] text-foreground/80 uppercase">
            {config.label}
          </span>
        </div>
        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${config.badgeClass}`}>
          {tasks.length}
        </span>
      </div>

      {/* Cards Area */}
      <div
        ref={setNodeRef}
        className={`flex-1 p-3 flex flex-col gap-2.5 overflow-y-auto min-h-[200px] transition-colors duration-200 ${
          isOver ? 'bg-white/[0.03]' : ''
        }`}
      >
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} status={status} />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center h-28 gap-2 drop-placeholder rounded-xl">
            <span className="text-2xl opacity-30">{config.emoji}</span>
            <p className="text-xs font-medium text-muted-foreground/40">
              Drop tasks here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
