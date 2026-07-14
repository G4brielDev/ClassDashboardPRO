import { BellRing, CalendarDays, Cake, Clock3, Gauge, LockKeyhole, Menu, Palette, Presentation, Shield, X } from 'lucide-react';
import { useState } from 'react';
import { hashPin } from '../lib/crypto';
import { useClassroomStore } from '../store/useClassroomStore';
import { AppLogo } from '../components/Logo';
import { AppearanceSection, AgendaSection, BirthdaysSection, LessonSection, NoticesSection, OverviewSection, TasksSection, TimerSection } from '../components/DashboardSections';
import { Badge, Button, Card, Field, Input, cn } from '../components/ui';

type Section = 'overview' | 'lesson' | 'agenda' | 'timer' | 'notices' | 'tasks' | 'birthdays' | 'appearance';
const items: Array<{ id: Section; label: string; icon: typeof Gauge }> = [
  { id: 'overview', label: 'Visão geral', icon: Gauge }, { id: 'lesson', label: 'Aula atual', icon: Presentation },
  { id: 'agenda', label: 'Agenda', icon: CalendarDays }, { id: 'timer', label: 'Cronômetro', icon: Clock3 },
  { id: 'notices', label: 'Avisos', icon: BellRing }, { id: 'tasks', label: 'Tarefas', icon: Shield },
  { id: 'birthdays', label: 'Aniversariantes', icon: Cake }, { id: 'appearance', label: 'Aparência', icon: Palette }
];

export function DashboardPage() {
  const [section, setSection] = useState<Section>('overview');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pin, setPin] = useState('');
  const pinSettings = useClassroomStore((state) => state.data.pin);
  const locked = useClassroomStore((state) => state.dashboardLocked);
  const setLocked = useClassroomStore((state) => state.setDashboardLocked);
  const notify = useClassroomStore((state) => state.notify);
  const apiConnected = useClassroomStore((state) => state.apiConnected);

  const unlock = async () => {
    if (await hashPin(pin) === pinSettings.hash) { setLocked(false); setPin(''); notify('Painel desbloqueado.'); }
    else notify('PIN incorreto.', 'error');
  };

  if (pinSettings.enabled && locked) {
    return <div className="lock-page"><Card className="lock-card"><span className="lock-icon"><LockKeyhole /></span><p className="eyebrow">Painel protegido</p><h1>Digite o PIN</h1><p>A tela de exibição continua funcionando normalmente.</p><Field label="PIN"><Input type="password" inputMode="numeric" maxLength={8} value={pin} onChange={(event) => setPin(event.target.value.replace(/\D/g, ''))} onKeyDown={(event) => event.key === 'Enter' && void unlock()} /></Field><Button className="w-full" onClick={() => void unlock()}>Desbloquear painel</Button></Card></div>;
  }

  const render = () => {
    switch (section) {
      case 'lesson': return <LessonSection />;
      case 'agenda': return <AgendaSection />;
      case 'timer': return <TimerSection />;
      case 'notices': return <NoticesSection />;
      case 'tasks': return <TasksSection />;
      case 'birthdays': return <BirthdaysSection />;
      case 'appearance': return <AppearanceSection />;
      default: return <OverviewSection onNavigate={(next) => setSection(next as Section)} />;
    }
  };

  return <div className="dashboard-page"><button className="mobile-menu-button" onClick={() => setMobileOpen(true)} aria-label="Abrir menu"><Menu /></button><aside className={cn('dashboard-sidebar', mobileOpen && 'open')}><div className="sidebar-head"><AppLogo /><button className="sidebar-close" onClick={() => setMobileOpen(false)} aria-label="Fechar menu"><X /></button></div><div className="connection-status"><span className={apiConnected ? 'online' : ''} /><div><strong>{apiConnected ? 'API conectada' : 'Modo local'}</strong><small>{apiConnected ? 'Sincronização ativa' : 'Dados no navegador'}</small></div></div><nav>{items.map(({ id, label, icon: Icon }) => <button key={id} className={section === id ? 'active' : ''} onClick={() => { setSection(id); setMobileOpen(false); }}><Icon size={19} /><span>{label}</span>{id === 'notices' && <Badge tone="warning">!</Badge>}</button>)}</nav>{pinSettings.enabled && <button className="sidebar-lock" onClick={() => setLocked(true)}><LockKeyhole size={17} /> Bloquear painel</button>}</aside><section className="dashboard-content">{render()}</section>{mobileOpen && <button className="sidebar-overlay" onClick={() => setMobileOpen(false)} aria-label="Fechar menu" />}</div>;
}
