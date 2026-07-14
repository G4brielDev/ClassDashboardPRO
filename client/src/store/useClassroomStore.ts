import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { createDefaultData } from '../data/defaults';
import { getElapsedSeconds, getRemainingSeconds } from '../lib/timer';
import type {
  AgendaItem,
  AppearanceSettings,
  Birthday,
  ClassroomData,
  ClassroomTask,
  DisplaySettings,
  Lesson,
  Notice,
  SchoolSettings
} from '../types';

type ToastKind = 'success' | 'error' | 'info';
interface ToastState { message: string; kind: ToastKind }

interface ClassroomStore {
  data: ClassroomData;
  hydrated: boolean;
  apiConnected: boolean;
  dashboardLocked: boolean;
  toast: ToastState | null;
  setHydrated: (value: boolean) => void;
  setApiConnected: (value: boolean) => void;
  setDashboardLocked: (value: boolean) => void;
  notify: (message: string, kind?: ToastKind) => void;
  clearToast: () => void;
  replaceData: (data: ClassroomData) => void;
  updateSchool: (patch: Partial<SchoolSettings>) => void;
  updateLesson: (patch: Partial<Lesson>) => void;
  upsertAgenda: (item: AgendaItem) => void;
  removeAgenda: (id: string) => void;
  toggleAgenda: (id: string) => void;
  moveAgenda: (id: string, direction: -1 | 1) => void;
  upsertNotice: (notice: Notice) => void;
  removeNotice: (id: string) => void;
  toggleNotice: (id: string) => void;
  upsertTask: (task: ClassroomTask) => void;
  removeTask: (id: string) => void;
  toggleTask: (id: string) => void;
  upsertBirthday: (birthday: Birthday) => void;
  removeBirthday: (id: string) => void;
  updateAppearance: (patch: Partial<AppearanceSettings>) => void;
  updateDisplay: (patch: Partial<DisplaySettings>) => void;
  setPin: (enabled: boolean, hash: string) => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: (durationSeconds?: number) => void;
  adjustTimer: (seconds: number) => void;
  finishTimer: () => void;
  finishLesson: () => void;
  resetAll: () => void;
}

function stamp(data: ClassroomData): ClassroomData {
  return {
    ...data,
    revision: data.revision + 1,
    lastUpdated: new Date().toISOString()
  };
}

export const useClassroomStore = create<ClassroomStore>()(
  persist(
    (set) => ({
      data: createDefaultData(),
      hydrated: false,
      apiConnected: false,
      dashboardLocked: false,
      toast: null,
      setHydrated: (hydrated) => set({ hydrated }),
      setApiConnected: (apiConnected) => set({ apiConnected }),
      setDashboardLocked: (dashboardLocked) => set({ dashboardLocked }),
      notify: (message, kind = 'success') => set({ toast: { message, kind } }),
      clearToast: () => set({ toast: null }),
      replaceData: (data) => set({ data }),
      updateSchool: (patch) => set((state) => ({ data: stamp({ ...state.data, school: { ...state.data.school, ...patch } }) })),
      updateLesson: (patch) => set((state) => ({ data: stamp({ ...state.data, lesson: { ...state.data.lesson, ...patch } }) })),
      upsertAgenda: (item) => set((state) => {
        const exists = state.data.agenda.some((entry) => entry.id === item.id);
        const agenda = exists ? state.data.agenda.map((entry) => entry.id === item.id ? item : entry) : [...state.data.agenda, item];
        return { data: stamp({ ...state.data, agenda }) };
      }),
      removeAgenda: (id) => set((state) => ({ data: stamp({ ...state.data, agenda: state.data.agenda.filter((entry) => entry.id !== id) }) })),
      toggleAgenda: (id) => set((state) => ({
        data: stamp({
          ...state.data,
          agenda: state.data.agenda.map((entry) => entry.id === id ? { ...entry, status: entry.status === 'concluida' ? 'pendente' : 'concluida' } : entry)
        })
      })),
      moveAgenda: (id, direction) => set((state) => {
        const agenda = [...state.data.agenda];
        const index = agenda.findIndex((entry) => entry.id === id);
        const nextIndex = index + direction;
        if (index < 0 || nextIndex < 0 || nextIndex >= agenda.length) return state;
        [agenda[index], agenda[nextIndex]] = [agenda[nextIndex], agenda[index]];
        return { data: stamp({ ...state.data, agenda }) };
      }),
      upsertNotice: (notice) => set((state) => {
        const exists = state.data.notices.some((entry) => entry.id === notice.id);
        const notices = exists ? state.data.notices.map((entry) => entry.id === notice.id ? notice : entry) : [...state.data.notices, notice];
        return { data: stamp({ ...state.data, notices }) };
      }),
      removeNotice: (id) => set((state) => ({ data: stamp({ ...state.data, notices: state.data.notices.filter((entry) => entry.id !== id) }) })),
      toggleNotice: (id) => set((state) => ({ data: stamp({ ...state.data, notices: state.data.notices.map((entry) => entry.id === id ? { ...entry, active: !entry.active } : entry) }) })),
      upsertTask: (task) => set((state) => {
        const exists = state.data.tasks.some((entry) => entry.id === task.id);
        const tasks = exists ? state.data.tasks.map((entry) => entry.id === task.id ? task : entry) : [...state.data.tasks, task];
        return { data: stamp({ ...state.data, tasks }) };
      }),
      removeTask: (id) => set((state) => ({ data: stamp({ ...state.data, tasks: state.data.tasks.filter((entry) => entry.id !== id) }) })),
      toggleTask: (id) => set((state) => ({ data: stamp({ ...state.data, tasks: state.data.tasks.map((entry) => entry.id === id ? { ...entry, completed: !entry.completed } : entry) }) })),
      upsertBirthday: (birthday) => set((state) => {
        const exists = state.data.birthdays.some((entry) => entry.id === birthday.id);
        const birthdays = exists ? state.data.birthdays.map((entry) => entry.id === birthday.id ? birthday : entry) : [...state.data.birthdays, birthday];
        return { data: stamp({ ...state.data, birthdays }) };
      }),
      removeBirthday: (id) => set((state) => ({ data: stamp({ ...state.data, birthdays: state.data.birthdays.filter((entry) => entry.id !== id) }) })),
      updateAppearance: (patch) => set((state) => ({ data: stamp({ ...state.data, appearance: { ...state.data.appearance, ...patch } }) })),
      updateDisplay: (patch) => set((state) => ({ data: stamp({ ...state.data, display: { ...state.data.display, ...patch } }) })),
      setPin: (enabled, hash) => set((state) => ({ data: stamp({ ...state.data, pin: { enabled, hash } }), dashboardLocked: enabled })),
      startTimer: () => set((state) => {
        const timer = state.data.timer;
        const remaining = getRemainingSeconds(timer);
        const elapsedBeforeStart = remaining === 0 ? 0 : timer.elapsedBeforeStart;
        return {
          data: stamp({
            ...state.data,
            timer: {
              ...timer,
              elapsedBeforeStart,
              startedAt: Date.now(),
              pausedAt: null,
              status: 'running',
              warnedFiveMinutes: remaining === 0 ? false : timer.warnedFiveMinutes,
              warnedOneMinute: remaining === 0 ? false : timer.warnedOneMinute
            }
          })
        };
      }),
      pauseTimer: () => set((state) => {
        if (state.data.timer.status !== 'running') return state;
        const elapsed = getElapsedSeconds(state.data.timer);
        return {
          data: stamp({
            ...state.data,
            timer: { ...state.data.timer, elapsedBeforeStart: elapsed, startedAt: null, pausedAt: Date.now(), status: 'paused' }
          })
        };
      }),
      resetTimer: (durationSeconds) => set((state) => ({
        data: stamp({
          ...state.data,
          timer: {
            ...state.data.timer,
            durationSeconds: durationSeconds ?? state.data.timer.durationSeconds,
            elapsedBeforeStart: 0,
            startedAt: null,
            pausedAt: null,
            status: 'stopped',
            warnedFiveMinutes: false,
            warnedOneMinute: false
          }
        })
      })),
      adjustTimer: (seconds) => set((state) => {
        const timer = state.data.timer;
        const nextDuration = Math.max(60, Math.min(6 * 3600, timer.durationSeconds + seconds));
        const elapsed = Math.min(getElapsedSeconds(timer), Math.max(0, nextDuration - 1));
        return {
          data: stamp({
            ...state.data,
            timer: {
              ...timer,
              durationSeconds: nextDuration,
              elapsedBeforeStart: timer.status === 'running' ? timer.elapsedBeforeStart : elapsed
            }
          })
        };
      }),
      finishTimer: () => set((state) => ({
        data: stamp({
          ...state.data,
          timer: { ...state.data.timer, elapsedBeforeStart: state.data.timer.durationSeconds, startedAt: null, pausedAt: null, status: 'finished' }
        })
      })),
      finishLesson: () => set((state) => {
        const now = new Date();
        const started = new Date();
        const [hours, minutes] = state.data.lesson.startTime.split(':').map(Number);
        started.setHours(hours, minutes, 0, 0);
        const historyEntry = {
          id: crypto.randomUUID(),
          date: now.toISOString().slice(0, 10),
          classroom: state.data.school.classroomName,
          subject: state.data.school.subjectName,
          teacher: state.data.school.teacherName,
          startedAt: state.data.lesson.startTime,
          endedAt: now.toTimeString().slice(0, 5),
          durationMinutes: Math.max(0, Math.round((now.getTime() - started.getTime()) / 60000)),
          completedActivities: state.data.agenda.filter((entry) => entry.status === 'concluida').length,
          notes: state.data.lesson.notes
        };
        return {
          data: stamp({
            ...state.data,
            lesson: { ...state.data.lesson, status: 'finalizada' },
            history: [historyEntry, ...state.data.history].slice(0, 50)
          })
        };
      }),
      resetAll: () => set({ data: createDefaultData(), dashboardLocked: false }),
    }),
    {
      name: 'tela-de-sala-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ data: state.data }),
      onRehydrateStorage: () => (state) => state?.setHydrated(true)
    }
  )
);
