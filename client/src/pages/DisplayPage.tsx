import { Eye, EyeOff, Fullscreen, LayoutDashboard, Maximize2, Minimize2, Moon, Sun } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useClassroomStore } from '../store/useClassroomStore';
import { ActivityCard, AgendaTimeline, BirthdayWidget, DailyMessage, DisplayDateTime, LessonStatusBadge, NoticesWidget, TasksWidget } from '../components/DisplayWidgets';
import { TimerPanel } from '../components/TimerPanel';
import { AppLogo } from '../components/Logo';
import { cn } from '../components/ui';

export function DisplayPage() {
  const data = useClassroomStore((state) => state.data);
  const updateDisplay = useClassroomStore((state) => state.updateDisplay);
  const updateAppearance = useClassroomStore((state) => state.updateAppearance);
  const startTimer = useClassroomStore((state) => state.startTimer);
  const pauseTimer = useClassroomStore((state) => state.pauseTimer);
  const resetTimer = useClassroomStore((state) => state.resetTimer);
  const adjustTimer = useClassroomStore((state) => state.adjustTimer);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [fullscreen, setFullscreen] = useState(Boolean(document.fullscreenElement));
  const [, setTick] = useState(0);
  const hideTimer = useRef<number | null>(null);
  const wakeLock = useRef<any>(null);

  const revealControls = useCallback(() => {
    setControlsVisible(true);
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setControlsVisible(false), data.display.controlsAutoHideSeconds * 1000);
  }, [data.display.controlsAutoHideSeconds]);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
    else await document.exitFullscreen();
  };

  useEffect(() => {
    const interval = window.setInterval(() => setTick((value) => value + 1), 1000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const onFullscreen = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onFullscreen);
    return () => document.removeEventListener('fullscreenchange', onFullscreen);
  }, []);

  useEffect(() => {
    const requestLock = async () => {
      if (data.display.keepAwake && 'wakeLock' in navigator) {
        try { wakeLock.current = await (navigator as any).wakeLock.request('screen'); } catch { wakeLock.current = null; }
      }
    };
    void requestLock();
    return () => { if (wakeLock.current) void wakeLock.current.release(); };
  }, [data.display.keepAwake]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLSelectElement) return;
      const key = event.key.toLowerCase();
      if (key === 'f') void toggleFullscreen();
      else if (key === ' ') { event.preventDefault(); data.timer.status === 'running' ? pauseTimer() : startTimer(); }
      else if (key === 'r' && confirm('Reiniciar o cronômetro?')) resetTimer();
      else if (event.key === 'ArrowUp') adjustTimer(60);
      else if (event.key === 'ArrowDown') adjustTimer(-60);
      else if (key === 'h') setControlsVisible((value) => !value);
      else if (key === 'l') updateDisplay({ layout: data.display.layout === 'complete' ? 'focus' : data.display.layout === 'focus' ? 'agenda' : 'complete' });
      revealControls();
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('mousemove', revealControls);
    revealControls();
    return () => { window.removeEventListener('keydown', onKeyDown); window.removeEventListener('mousemove', revealControls); if (hideTimer.current) window.clearTimeout(hideTimer.current); };
  }, [data.timer.status, data.display.layout, startTimer, pauseTimer, resetTimer, adjustTimer, updateDisplay, revealControls]);

  const { layout } = data.display;
  return <main className={cn('display-page', `display-layout-${layout}`, !controlsVisible && 'controls-hidden')}>
    <header className="display-header"><AppLogo /><div className="display-school"><strong>{data.school.schoolName}</strong><span>{data.school.classroomName}{data.display.showSubject ? ` · ${data.school.subjectName}` : ''}{data.display.showTeacher ? ` · ${data.school.teacherName}` : ''}</span></div><LessonStatusBadge /><DisplayDateTime /></header>
    <section className="display-grid">
      <div className="display-primary"><ActivityCard /><TimerPanel displayMode compact={layout === 'agenda'} />{layout !== 'focus' && <ActivityCard next />}</div>
      {layout === 'focus' ? <div className="display-secondary"><ActivityCard next /><NoticesWidget />{data.display.showMessage && <DailyMessage />}</div> : layout === 'agenda' ? <div className="display-secondary wide"><AgendaTimeline /><NoticesWidget /></div> : <div className="display-secondary">{data.display.showAgenda && <AgendaTimeline limit={5} />}<NoticesWidget /></div>}
      {layout === 'complete' && <div className="display-tertiary">{data.display.showTasks && <TasksWidget />}{data.display.showBirthdays && <BirthdayWidget />}{data.display.showMessage && <DailyMessage />}</div>}
    </section>
    <div className="display-controls" aria-hidden={!controlsVisible}><button onClick={() => setControlsVisible((value) => !value)} aria-label="Ocultar controles">{controlsVisible ? <EyeOff /> : <Eye />}</button><button onClick={() => updateDisplay({ layout: layout === 'complete' ? 'focus' : layout === 'focus' ? 'agenda' : 'complete' })} aria-label="Alternar layout"><LayoutDashboard /></button><button onClick={() => updateAppearance({ mode: data.appearance.mode === 'dark' ? 'light' : 'dark' })} aria-label="Alternar tema">{data.appearance.mode === 'dark' ? <Sun /> : <Moon />}</button><button onClick={() => void toggleFullscreen()} aria-label="Tela cheia">{fullscreen ? <Minimize2 /> : <Maximize2 />}</button></div>
    <div className="display-shortcuts"><Fullscreen size={16} /> F tela cheia · Espaço iniciar/pausar · H controles · L layout</div>
  </main>;
}
