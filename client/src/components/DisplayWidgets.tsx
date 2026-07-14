import { BellRing, CalendarDays, CheckCircle2, Circle, Clock3, Gift, MessageSquareQuote, Users } from 'lucide-react';
import { format, isSameDay, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useMemo } from 'react';
import { useClassroomStore } from '../store/useClassroomStore';
import type { AgendaItem, LessonStatus, Priority } from '../types';
import { Badge, Card, EmptyState, cn } from './ui';

const statusLabels: Record<LessonStatus, string> = {
  aguardando: 'Aguardando início',
  'em-andamento': 'Aula em andamento',
  individual: 'Atividade individual',
  grupo: 'Atividade em grupo',
  apresentacao: 'Apresentação',
  intervalo: 'Intervalo',
  avaliacao: 'Avaliação',
  finalizada: 'Aula finalizada',
  aviso: 'Aviso importante'
};

const priorityTone: Record<Priority, 'neutral' | 'warning' | 'danger' | 'info'> = {
  baixa: 'neutral', media: 'info', alta: 'warning', urgente: 'danger'
};

export function LessonStatusBadge() {
  const status = useClassroomStore((state) => state.data.lesson.status);
  return <Badge tone={status === 'finalizada' ? 'success' : status === 'aviso' || status === 'avaliacao' ? 'danger' : 'info'}>{statusLabels[status]}</Badge>;
}

export function ActivityCard({ next = false }: { next?: boolean }) {
  const lesson = useClassroomStore((state) => state.data.lesson);
  const activity = next ? lesson.nextActivity : lesson.currentActivity;
  return (
    <Card className={cn('activity-card', next && 'next-activity')}>
      <div className="activity-icon" style={{ backgroundColor: `${activity.color}20`, color: activity.color }}>{next ? <Users /> : <Clock3 />}</div>
      <div>
        <p className="eyebrow">{next ? 'Próxima atividade' : 'Atividade atual'}</p>
        <h2>{activity.title}</h2>
        <p>{activity.description}</p>
        <span className="activity-time"><Clock3 size={16} /> {activity.startTime} — {activity.endTime}</span>
      </div>
    </Card>
  );
}

function AgendaRow({ item }: { item: AgendaItem }) {
  const Icon = item.status === 'concluida' ? CheckCircle2 : item.status === 'atual' ? Clock3 : Circle;
  return (
    <li className={cn('agenda-row', `agenda-${item.status}`)}>
      <span className="agenda-dot" style={{ color: item.color }}><Icon size={20} /></span>
      <time>{item.startTime}</time>
      <div><strong>{item.title}</strong><small>{item.description}</small></div>
      <Badge tone={item.status === 'concluida' ? 'success' : item.status === 'atual' ? 'info' : 'neutral'}>{item.durationMinutes} min</Badge>
    </li>
  );
}

export function AgendaTimeline({ limit }: { limit?: number }) {
  const agenda = useClassroomStore((state) => state.data.agenda);
  const items = typeof limit === 'number' ? agenda.slice(0, limit) : agenda;
  return (
    <Card className="agenda-card">
      <div className="section-heading"><div><p className="eyebrow">Programação</p><h2>Agenda da aula</h2></div><CalendarDays /></div>
      {items.length ? <ol className="agenda-list">{items.map((item) => <AgendaRow key={item.id} item={item} />)}</ol> : <EmptyState title="Agenda vazia" description="Adicione itens pelo painel de controle." />}
    </Card>
  );
}

export function NoticesWidget() {
  const notices = useClassroomStore((state) => state.data.notices);
  const active = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return notices.filter((notice) => notice.active && notice.startsAt <= today && notice.endsAt >= today);
  }, [notices]);
  return (
    <Card className="notices-card">
      <div className="section-heading"><div><p className="eyebrow">Comunicados</p><h2>Avisos ativos</h2></div><BellRing /></div>
      {active.length ? <div className="notice-stack">{active.slice(0, 3).map((notice) => (
        <article key={notice.id} className="notice-item" style={{ borderColor: notice.color }}>
          <div><strong>{notice.title}</strong><p>{notice.message}</p></div>
          <Badge tone={priorityTone[notice.priority]}>{notice.priority}</Badge>
        </article>
      ))}</div> : <EmptyState title="Sem avisos ativos" description="Nenhum comunicado para este período." />}
    </Card>
  );
}

export function TasksWidget() {
  const tasks = useClassroomStore((state) => state.data.tasks.filter((task) => !task.completed));
  return (
    <Card>
      <div className="section-heading"><div><p className="eyebrow">Pendências</p><h2>Tarefas</h2></div><CheckCircle2 /></div>
      {tasks.length ? <div className="task-list">{tasks.slice(0, 4).map((task) => (
        <article key={task.id} className="task-item"><div><strong>{task.title}</strong><span>{task.subject} · prazo {format(parseISO(task.dueDate), 'dd/MM')}</span></div><Badge tone={priorityTone[task.priority]}>{task.priority}</Badge></article>
      ))}</div> : <EmptyState title="Tudo em dia" description="Não há tarefas pendentes." />}
    </Card>
  );
}

export function BirthdayWidget() {
  const birthdays = useClassroomStore((state) => state.data.birthdays);
  const today = new Date();
  const todayBirthdays = birthdays.filter((birthday) => {
    const date = parseISO(birthday.birthDate);
    const currentYearDate = new Date(today.getFullYear(), date.getMonth(), date.getDate());
    return isSameDay(currentYearDate, today);
  });
  if (!todayBirthdays.length) return null;
  return (
    <Card className="birthday-card">
      <div className="section-heading"><div><p className="eyebrow">Celebração</p><h2>Aniversariantes</h2></div><Gift /></div>
      {todayBirthdays.map((birthday) => <div className="birthday-person" key={birthday.id}>{birthday.photoDataUrl ? <img src={birthday.photoDataUrl} alt={birthday.name} /> : <span>{birthday.name.charAt(0)}</span>}<div><strong>{birthday.name}</strong><p>{birthday.message}</p></div></div>)}
    </Card>
  );
}

export function DailyMessage() {
  const message = useClassroomStore((state) => state.data.display.dailyMessage);
  return <Card className="daily-message"><MessageSquareQuote /><blockquote>{message}</blockquote></Card>;
}

export function DisplayDateTime() {
  const display = useClassroomStore((state) => state.data.display);
  const now = new Date();
  const time = new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit', minute: '2-digit', second: display.showSeconds ? '2-digit' : undefined,
    hour12: display.clockFormat === '12h'
  }).format(now);
  return <div className="display-clock"><strong>{time}</strong>{display.showDate && <span>{format(now, "EEEE, d 'de' MMMM", { locale: ptBR })}</span>}</div>;
}
