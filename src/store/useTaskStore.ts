import { create } from 'zustand';
import { taskApi } from '../api/taskApi';

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
  loading: boolean;
  error: string | null;

  fetchTasks: () => Promise<void>;
  addTask: (title: string, description: string) => Promise<void>;
  updateTaskStatus: (id: string, status: TaskStatus) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  loading: false,
  error: null,

  fetchTasks: async () => {
    set({ loading: true, error: null });
    try {
      const tasks = await taskApi.getAll();
      set({ tasks, loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  addTask: async (title, description) => {
    try {
      const newTask = await taskApi.create({ title, description, status: 'TODO' });
      set((state) => ({ tasks: [...state.tasks, newTask] }));
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  updateTaskStatus: async (id, status) => {
    // Optimistic update
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, status } : t)),
    }));
    try {
      await taskApi.update(id, { status });
    } catch (err) {
      // Revert by re-fetching on failure
      set({ error: (err as Error).message });
      const tasks = await taskApi.getAll();
      set({ tasks });
    }
  },

  deleteTask: async (id) => {
    // Optimistic update
    set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }));
    try {
      await taskApi.delete(id);
    } catch (err) {
      set({ error: (err as Error).message });
      const tasks = await taskApi.getAll();
      set({ tasks });
    }
  },
}));
