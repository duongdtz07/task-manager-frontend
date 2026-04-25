import type { Task, TaskStatus } from '../store/useTaskStore';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || `HTTP ${res.status}`);
  }

  // 204 No Content — no body to parse
  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}

export const taskApi = {
  /** GET /tasks */
  getAll(): Promise<Task[]> {
    return request<Task[]>('/tasks');
  },

  /** GET /tasks/:id */
  getOne(id: string): Promise<Task> {
    return request<Task>(`/tasks/${id}`);
  },

  /** POST /tasks */
  create(payload: { title: string; description?: string; status?: TaskStatus }): Promise<Task> {
    return request<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /** PATCH /tasks/:id */
  update(
    id: string,
    payload: Partial<{ title: string; description: string; status: TaskStatus }>,
  ): Promise<Task> {
    return request<Task>(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  /** DELETE /tasks/:id */
  delete(id: string): Promise<void> {
    return request<void>(`/tasks/${id}`, { method: 'DELETE' });
  },
};
