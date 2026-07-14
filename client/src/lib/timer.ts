import type { TimerState } from '../types';

export function getElapsedSeconds(timer: TimerState, now = Date.now()): number {
  if (timer.status === 'running' && timer.startedAt) {
    return timer.elapsedBeforeStart + Math.max(0, Math.floor((now - timer.startedAt) / 1000));
  }
  return timer.elapsedBeforeStart;
}

export function getRemainingSeconds(timer: TimerState, now = Date.now()): number {
  return Math.max(0, timer.durationSeconds - getElapsedSeconds(timer, now));
}

export function formatDuration(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;
  if (hours > 0) {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function timerProgress(timer: TimerState, now = Date.now()): number {
  if (timer.durationSeconds <= 0) return 100;
  const elapsed = timer.durationSeconds - getRemainingSeconds(timer, now);
  return Math.min(100, Math.max(0, (elapsed / timer.durationSeconds) * 100));
}
