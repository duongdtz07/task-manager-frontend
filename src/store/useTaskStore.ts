import { create } from 'zustand';

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: Date;
}

interface TaskState {
  tasks: Task[];
  addTask: (title: string, description: string) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  deleteTask: (id: string) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [
    { id: '1', title: 'Research competitors', description: 'Look into similar minimalist dev tools', status: 'DONE', createdAt: new Date() },
    { id: '2', title: 'Design System setup', description: 'Configure Tailwind and basic variables', status: 'IN_PROGRESS', createdAt: new Date() },
    { id: '3', title: 'Implement DnD', description: 'Use @dnd-kit to make board columns functional', status: 'TODO', createdAt: new Date() },
  ],
  addTask: (title, description) => set((state) => ({
    tasks: [...state.tasks, {
      id: crypto.randomUUID(),
      title,  
      description,
      status: 'TODO',
      createdAt: new Date()
    }]
  })),
  updateTaskStatus: (id, status) => set((state) => ({
    tasks: state.tasks.map((task) => task.id === id ? { ...task, status } : task)
  })),
  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter((task) => task.id !== id)
  })),
}));
