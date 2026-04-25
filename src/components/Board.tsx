import { useMemo, useState } from 'react';
import { 
  DndContext, 
  DragOverlay, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors, 
  defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useTaskStore } from '../store/useTaskStore';
import type { Task, TaskStatus } from '../store/useTaskStore';
import Column from './Column';
import TaskCard from './TaskCard';

export default function Board() {
  const tasks = useTaskStore((state) => state.tasks);
  const updateTaskStatus = useTaskStore((state) => state.updateTaskStatus);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const columns = useMemo(() => {
    return {
      TODO: tasks.filter((t) => t.status === 'TODO'),
      IN_PROGRESS: tasks.filter((t) => t.status === 'IN_PROGRESS'),
      DONE: tasks.filter((t) => t.status === 'DONE'),
    };
  }, [tasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const onDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (active.data.current?.type === 'Task') {
      setActiveTask(active.data.current.task);
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;

    const isActiveTask = active.data.current?.type === 'Task';
    const isOverColumn = over.data.current?.type === 'Column';
    const isOverTask = over.data.current?.type === 'Task';

    if (isActiveTask && isOverColumn) {
      updateTaskStatus(activeId as string, over.data.current?.status as TaskStatus);
      return;
    }

    if (isActiveTask && isOverTask) {
      const overStatus = over.data.current?.task.status;
      if (active.data.current?.task.status !== overStatus) {
        updateTaskStatus(activeId as string, overStatus);
      }
    }
  };

  const dropAnimationConfig = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.4',
        },
      },
    }),
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div className="flex flex-col lg:flex-row gap-5 w-full h-full min-h-[500px]">
        <Column title="To Do" status="TODO" tasks={columns.TODO} />
        <Column title="In Progress" status="IN_PROGRESS" tasks={columns.IN_PROGRESS} />
        <Column title="Done" status="DONE" tasks={columns.DONE} />
      </div>

      <DragOverlay dropAnimation={dropAnimationConfig}>
        {activeTask ? (
          <div className="rotate-1 scale-[1.03] shadow-2xl opacity-95 drop-shadow-[0_0_24px_hsla(258,90%,60%,0.4)]">
            <TaskCard task={activeTask} status={activeTask.status} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
