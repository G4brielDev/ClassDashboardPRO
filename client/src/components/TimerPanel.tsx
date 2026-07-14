import { Minus, Pause, Play, Plus, RotateCcw, TimerReset } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { formatDuration, getRemainingSeconds, timerProgress } from '../lib/timer';
import { useClassroomStore } from '../store/useClassroomStore';
import { Button, Card, cn } from './ui';

function beep(volume: number) {
  const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return;
  const context = new AudioContextClass();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.frequency.value = 880;
  gain.gain.value = Math.max(0, Math.min(1, volume));
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.18);
}

export function TimerPanel({ displayMode = false, compact = false }: { displayMode?: boolean; compact?: boolean }) {
  const timer = useClassroomStore((state) => state.data.timer);
  const display = useClassroomStore((state) => state.data.display);
  const startTimer = useClassroomStore((state) => state.startTimer);
  const pauseTimer = useClassroomStore((state) => state.pauseTimer);
  const resetTimer = useClassroomStore((state) => state.resetTimer);
  const adjustTimer = useClassroomStore((state) => state.adjustTimer);
  const finishTimer = useClassroomStore((state) => state.finishTimer);
  const notify = useClassroomStore((state) => state.notify);
  const [now, setNow] = useState(Date.now());

  const remaining = useMemo(() => getRemainingSeconds(timer, now), [timer, now]);
  const progress = useMemo(() => timerProgress(timer, now), [timer, now]);

  useEffect(() => {
    if (timer.status !== 'running') return;
    const interval = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(interval);
  }, [timer.status]);

  useEffect(() => {
    if (timer.status === 'running' && remaining <= 0) {
      finishTimer();
      if (display.soundsEnabled) beep(display.volume);
      notify('Cronômetro concluído.', 'info');
    }
  }, [remaining, timer.status, finishTimer, display.soundsEnabled, display.volume, notify]);

  const tone = remaining <= 60 ? 'timer-danger' : remaining <= 300 ? 'timer-warning' : '';

  return (
    <Card className={cn('timer-panel', displayMode && 'display-timer', compact && 'timer-compact', tone)}>
      <div className="section-heading">
        <div>
          <p className="eyebrow">Cronômetro</p>
          <h2>{timer.status === 'finished' ? 'Tempo encerrado' : 'Tempo da atividade'}</h2>
        </div>
        <span className="timer-status">{timer.status === 'running' ? 'Em andamento' : timer.status === 'paused' ? 'Pausado' : timer.status === 'finished' ? 'Concluído' : 'Pronto'}</span>
      </div>
      <div className="timer-value" aria-live="polite">{formatDuration(remaining)}</div>
      <div className="progress-track" aria-label={`Progresso do cronômetro: ${Math.round(progress)}%`}>
        <span style={{ width: `${progress}%` }} />
      </div>
      <div className="timer-actions">
        <Button variant="secondary" size="sm" onClick={() => adjustTimer(-60)} aria-label="Remover um minuto"><Minus size={17} /> 1 min</Button>
        {timer.status === 'running' ? (
          <Button size="lg" onClick={pauseTimer}><Pause size={20} /> Pausar</Button>
        ) : (
          <Button size="lg" onClick={startTimer}><Play size={20} /> {timer.status === 'paused' ? 'Continuar' : 'Iniciar'}</Button>
        )}
        <Button variant="secondary" size="sm" onClick={() => adjustTimer(60)} aria-label="Adicionar um minuto"><Plus size={17} /> 1 min</Button>
        <Button variant="ghost" size="sm" onClick={() => resetTimer()}><RotateCcw size={17} /> Reiniciar</Button>
      </div>
      {!displayMode && (
        <div className="timer-presets">
          {[5, 10, 15, 25, 45].map((minutes) => (
            <button key={minutes} type="button" onClick={() => resetTimer(minutes * 60)}><TimerReset size={14} /> {minutes} min</button>
          ))}
        </div>
      )}
    </Card>
  );
}
