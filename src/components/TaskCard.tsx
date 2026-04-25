import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useTaskStore } from '../store/useTaskStore';
import type { Task, TaskStatus } from '../store/useTaskStore';
import { GripVertical, Trash2 } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  status?: TaskStatus;
}



const statusBar: Record<TaskStatus, string> = {
  TODO: 'bg-gradient-to-b from-blue-500 to-blue-400',
  IN_PROGRESS: 'bg-gradient-to-b from-amber-400 to-orange-400',
  DONE: 'bg-gradient-to-b from-emerald-500 to-teal-400',
};

export default function TaskCard({ task, status }: TaskCardProps) {
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
  });

  const cardStatus = status ?? task.status;

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-30 border-2 border-dashed border-primary/40 min-h-[72px] rounded-xl bg-white/5"
      />
    );
  }

  return (
    <div ref={setNodeRef} style={style} className="relative group touch-manipulation">
      <div className="glass-card rounded-xl overflow-hidden flex">

        {/* Left accent bar */}
        <div className={`w-1 flex-shrink-0 ${statusBar[cardStatus]}`} />

        {/* Card content */}
        <div className="flex-1 px-3 py-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2 flex-1 min-w-0">
              {/* Drag handle */}
              <div
                {...attributes}
                {...listeners}
                className="mt-0.5 flex-shrink-0 cursor-grab active:cursor-grabbing text-muted-foreground/30 hover:text-muted-foreground/70 transition-colors"
              >
                <GripVertical size={15} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold leading-snug break-words text-foreground/90">
                  {task.title}
                </p>
                {task.description && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                    {task.description}
                  </p>
                )}
              </div>
            </div>

            {/* Delete button */}
            <button
              onClick={() => deleteTask(task.id)}
              className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-150 w-6 h-6 flex items-center justify-center rounded-md text-muted-foreground/50 hover:text-red-400 hover:bg-red-500/10 mt-0.5"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
