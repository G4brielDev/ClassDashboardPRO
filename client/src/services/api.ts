import type { ClassroomData } from '../types';

// Use IPv4 explicitly in development so an unrelated IPv6 localhost service
// cannot receive classroom requests when both use the same port.
const API_BASE = import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? 'http://127.0.0.1:3333' : '');

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {})
    }
  });
  if (!response.ok) {
    throw new Error(`Falha na API: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export const classroomApi = {
  getState: () => request<ClassroomData>('/api/state'),
  saveState: (data: ClassroomData) => request<ClassroomData>('/api/state', { method: 'PUT', body: JSON.stringify(data) }),
  reset: () => request<ClassroomData>('/api/reset', { method: 'POST' }),
  health: () => request<{ status: string }>('/api/health'),
  eventUrl: `${API_BASE}/api/events`
};
