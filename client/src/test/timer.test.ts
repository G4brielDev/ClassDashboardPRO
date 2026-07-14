import { describe, expect, it } from 'vitest';
import { formatDuration, getRemainingSeconds, timerProgress } from '../lib/timer';
import type { TimerState } from '../types';

const timer: TimerState = {
  durationSeconds: 600,
  elapsedBeforeStart: 120,
  startedAt: null,
  pausedAt: null,
  status: 'paused',
  warnedFiveMinutes: false,
  warnedOneMinute: false
};

describe('cronômetro', () => {
  it('calcula o tempo restante', () => expect(getRemainingSeconds(timer)).toBe(480));
  it('formata minutos e segundos', () => expect(formatDuration(480)).toBe('08:00'));
  it('calcula o progresso', () => expect(timerProgress(timer)).toBe(20));
});
