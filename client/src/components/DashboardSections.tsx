import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowDown, ArrowUp, BellRing, CalendarDays, Check, CirclePlus, Clock3, Edit3, Eye,
  Gift, MonitorPlay, Palette, Play, RotateCcw, Save, Settings2, Trash2
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { agendaSchema, birthdaySchema, lessonSchema, noticeSchema, taskSchema } from '../lib/schemas';
import { formatDuration, getRemainingSeconds } from '../lib/timer';
import { useClassroomStore } from '../store/useClassroomStore';
import type { AgendaItem, Birthday, ClassroomTask, Notice, ThemeName } from '../types';
import { TimerPanel } from './TimerPanel';
import { Badge, Button, Card, EmptyState, Field, Input, Modal, Select, Switch, Textarea } from './ui';

type LessonForm = z.infer<typeof lessonSchema>;
type AgendaForm = z.infer<typeof agendaSchema>;
type NoticeForm = z.infer<typeof noticeSchema>;
type TaskForm = z.infer<typeof taskSchema>;
type BirthdayForm = z.infer<typeof birthdaySchema>;

export function OverviewSection({ onNavigate }: { onNavigate: (section: string) => void }) {
  const data = useClassroomStore((state) => state.data);
  const startTimer = useClassroomStore((state) => state.startTimer);
  const finishLesson = useClassroomStore((state) => state.finishLesson);
  const notify = useClassroomStore((state) => state.notify);
  const pendingTasks = data.tasks.filter((task) => !task.completed).length;
  const activeNotices = data.notices.filter((notice) => notice.active).length;
  const remaining = getRemainingSeconds(data.timer);

  return (
    <div className="dashboard-stack">
      <div className="page-heading">
        <div><p className="eyebrow">Visão geral</p><h1>Olá, {data.school.teacherName}</h1><p>Acompanhe a aula e altere o que aparece na tela da turma.</p></div>
        <div className="heading-actions"><a className="btn btn-secondary btn-md" href="/exibicao" target="_blank" rel="noreferrer"><MonitorPlay size={18} /> Abrir exibição</a><Button onClick={() => { startTimer(); notify('Cronômetro iniciado.'); }}><Play size={18} /> Iniciar aula</Button></div>
      </div>
      <div className="metric-grid">
        <Card><span className="metric-icon"><Clock3 /></span><strong>{formatDuration(remaining)}</strong><small>tempo restante</small></Card>
        <Card><span className="metric-icon"><CalendarDays /></span><strong>{data.agenda.length}</strong><small>itens na agenda</small></Card>
        <Card><span className="metric-icon"><BellRing /></span><strong>{activeNotices}</strong><small>avisos ativos</small></Card>
        <Card><span className="metric-icon"><Check /></span><strong>{pendingTasks}</strong><small>tarefas pendentes</small></Card>
      </div>
      <div className="overview-grid">
        <Card className="overview-current">
          <div className="section-heading"><div><p className="eyebrow">Agora</p><h2>{data.lesson.currentActivity.title}</h2></div><Badge tone="info">{data.lesson.status.replace('-', ' ')}</Badge></div>
          <p>{data.lesson.currentActivity.description}</p>
          <div className="overview-meta"><span><Clock3 size={16} /> {data.lesson.currentActivity.startTime} — {data.lesson.currentActivity.endTime}</span><span>{data.school.subjectName} · {data.school.classroomName}</span></div>
          <div className="card-actions"><Button variant="secondary" onClick={() => onNavigate('lesson')}><Edit3 size={17} /> Editar aula</Button><Button variant="ghost" onClick={() => onNavigate('timer')}>Controlar cronômetro</Button></div>
        </Card>
        <Card>
          <div className="section-heading"><div><p className="eyebrow">A seguir</p><h2>{data.lesson.nextActivity.title}</h2></div><Eye /></div>
          <p>{data.lesson.nextActivity.description}</p>
          <div className="quick-list">{data.agenda.slice(0, 4).map((item) => <div key={item.id}><time>{item.startTime}</time><span>{item.title}</span><Badge tone={item.status === 'concluida' ? 'success' : item.status === 'atual' ? 'info' : 'neutral'}>{item.status}</Badge></div>)}</div>
        </Card>
      </div>
      <Card className="danger-zone-inline"><div><strong>Encerrar aula</strong><p>Salva um registro no histórico e altera o status da aula.</p></div><Button variant="danger" onClick={() => { finishLesson(); notify('Aula finalizada e adicionada ao histórico.'); }}>Finalizar aula</Button></Card>
    </div>
  );
}

export function LessonSection() {
  const lesson = useClassroomStore((state) => state.data.lesson);
  const updateLesson = useClassroomStore((state) => state.updateLesson);
  const notify = useClassroomStore((state) => state.notify);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<LessonForm>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: lesson.title, description: lesson.description, startTime: lesson.startTime, endTime: lesson.endTime,
      status: lesson.status, currentActivityTitle: lesson.currentActivity.title,
      currentActivityDescription: lesson.currentActivity.description, nextActivityTitle: lesson.nextActivity.title,
      nextActivityDescription: lesson.nextActivity.description, notes: lesson.notes
    }
  });

  useEffect(() => {
    reset({
      title: lesson.title, description: lesson.description, startTime: lesson.startTime, endTime: lesson.endTime,
      status: lesson.status, currentActivityTitle: lesson.currentActivity.title,
      currentActivityDescription: lesson.currentActivity.description, nextActivityTitle: lesson.nextActivity.title,
      nextActivityDescription: lesson.nextActivity.description, notes: lesson.notes
    });
  }, [lesson, reset]);

  const submit = (values: LessonForm) => {
    updateLesson({
      title: values.title, description: values.description, startTime: values.startTime, endTime: values.endTime,
      status: values.status, notes: values.notes ?? '',
      currentActivity: { ...lesson.currentActivity, title: values.currentActivityTitle, description: values.currentActivityDescription },
      nextActivity: { ...lesson.nextActivity, title: values.nextActivityTitle, description: values.nextActivityDescription }
    });
    notify('Aula atualizada com sucesso.');
  };

  return (
    <div className="dashboard-stack"><div className="page-heading"><div><p className="eyebrow">Aula atual</p><h1>Conteúdo da exibição</h1><p>As alterações aparecem automaticamente na tela aberta em outra aba.</p></div></div>
      <form className="form-card" onSubmit={handleSubmit(submit)}>
        <div className="form-grid cols-2">
          <Field label="Título da aula" error={errors.title?.message}><Input {...register('title')} /></Field>
          <Field label="Estado da aula" error={errors.status?.message}><Select {...register('status')}><option value="aguardando">Aguardando início</option><option value="em-andamento">Aula em andamento</option><option value="individual">Atividade individual</option><option value="grupo">Atividade em grupo</option><option value="apresentacao">Apresentação</option><option value="intervalo">Intervalo</option><option value="avaliacao">Avaliação</option><option value="finalizada">Finalizada</option><option value="aviso">Aviso importante</option></Select></Field>
          <Field label="Início" error={errors.startTime?.message}><Input type="time" {...register('startTime')} /></Field>
          <Field label="Término" error={errors.endTime?.message}><Input type="time" {...register('endTime')} /></Field>
        </div>
        <Field label="Descrição" error={errors.description?.message}><Textarea {...register('description')} /></Field>
        <div className="form-section"><h2>Atividade atual</h2><div className="form-grid cols-2"><Field label="Título" error={errors.currentActivityTitle?.message}><Input {...register('currentActivityTitle')} /></Field><Field label="Descrição" error={errors.currentActivityDescription?.message}><Input {...register('currentActivityDescription')} /></Field></div></div>
        <div className="form-section"><h2>Próxima atividade</h2><div className="form-grid cols-2"><Field label="Título" error={errors.nextActivityTitle?.message}><Input {...register('nextActivityTitle')} /></Field><Field label="Descrição" error={errors.nextActivityDescription?.message}><Input {...register('nextActivityDescription')} /></Field></div></div>
        <Field label="Observações" error={errors.notes?.message}><Textarea {...register('notes')} /></Field>
        <div className="form-actions"><Button variant="secondary" onClick={() => reset()}>Cancelar alterações</Button><Button type="submit" disabled={isSubmitting}><Save size={18} /> Salvar aula</Button></div>
      </form>
    </div>
  );
}

export function AgendaSection() {
  const agenda = useClassroomStore((state) => state.data.agenda);
  const upsert = useClassroomStore((state) => state.upsertAgenda);
  const remove = useClassroomStore((state) => state.removeAgenda);
  const toggle = useClassroomStore((state) => state.toggleAgenda);
  const move = useClassroomStore((state) => state.moveAgenda);
  const notify = useClassroomStore((state) => state.notify);
  const [editing, setEditing] = useState<AgendaItem | null>(null);
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<AgendaForm>({ resolver: zodResolver(agendaSchema) });

  const openForm = (item?: AgendaItem) => {
    setEditing(item ?? null);
    reset(item ? { title: item.title, description: item.description, startTime: item.startTime, durationMinutes: item.durationMinutes, type: item.type, color: item.color } : { title: '', description: '', startTime: '08:00', durationMinutes: 20, type: 'atividade', color: '#2563eb' });
    setOpen(true);
  };
  const submit = (values: AgendaForm) => {
    upsert({ id: editing?.id ?? crypto.randomUUID(), status: editing?.status ?? 'pendente', ...values });
    setOpen(false); notify(editing ? 'Item atualizado.' : 'Item adicionado à agenda.');
  };

  return <div className="dashboard-stack"><div className="page-heading"><div><p className="eyebrow">Agenda</p><h1>Linha do tempo da aula</h1><p>Organize horários, atividades, intervalos e avaliações.</p></div><Button onClick={() => openForm()}><CirclePlus size={18} /> Adicionar item</Button></div>
    <Card>{agenda.length ? <div className="manager-list">{agenda.map((item, index) => <article key={item.id} className="manager-row"><div className="manager-order"><button aria-label="Mover para cima" disabled={index === 0} onClick={() => move(item.id, -1)}><ArrowUp /></button><button aria-label="Mover para baixo" disabled={index === agenda.length - 1} onClick={() => move(item.id, 1)}><ArrowDown /></button></div><span className="manager-color" style={{ background: item.color }} /><time>{item.startTime}</time><div className="manager-main"><strong>{item.title}</strong><small>{item.description} · {item.durationMinutes} minutos</small></div><Badge tone={item.status === 'concluida' ? 'success' : item.status === 'atual' ? 'info' : 'neutral'}>{item.status}</Badge><div className="row-actions"><button aria-label="Marcar como concluído" onClick={() => toggle(item.id)}><Check /></button><button aria-label="Editar" onClick={() => openForm(item)}><Edit3 /></button><button aria-label="Excluir" onClick={() => { if (confirm('Excluir este item?')) { remove(item.id); notify('Item removido.', 'info'); } }}><Trash2 /></button></div></article>)}</div> : <EmptyState title="Agenda vazia" description="Adicione o primeiro item para montar a linha do tempo." />}</Card>
    <Modal open={open} title={editing ? 'Editar item da agenda' : 'Novo item da agenda'} onClose={() => setOpen(false)}><form onSubmit={handleSubmit(submit)} className="modal-form"><Field label="Título" error={errors.title?.message}><Input {...register('title')} /></Field><Field label="Descrição" error={errors.description?.message}><Textarea {...register('description')} /></Field><div className="form-grid cols-2"><Field label="Horário" error={errors.startTime?.message}><Input type="time" {...register('startTime')} /></Field><Field label="Duração em minutos" error={errors.durationMinutes?.message}><Input type="number" {...register('durationMinutes')} /></Field><Field label="Tipo" error={errors.type?.message}><Select {...register('type')}><option value="aula">Aula</option><option value="atividade">Atividade</option><option value="intervalo">Intervalo</option><option value="avaliacao">Avaliação</option><option value="apresentacao">Apresentação</option><option value="dinamica">Dinâmica</option><option value="aviso">Aviso</option><option value="outro">Outro</option></Select></Field><Field label="Cor" error={errors.color?.message}><Input type="color" {...register('color')} /></Field></div><div className="form-actions"><Button variant="secondary" onClick={() => setOpen(false)}>Cancelar</Button><Button type="submit"><Save size={17} /> Salvar</Button></div></form></Modal>
  </div>;
}

export function NoticesSection() {
  const notices = useClassroomStore((state) => state.data.notices);
  const upsert = useClassroomStore((state) => state.upsertNotice);
  const remove = useClassroomStore((state) => state.removeNotice);
  const toggle = useClassroomStore((state) => state.toggleNotice);
  const notify = useClassroomStore((state) => state.notify);
  const [editing, setEditing] = useState<Notice | null>(null);
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<NoticeForm>({ resolver: zodResolver(noticeSchema) });
  const openForm = (item?: Notice) => { setEditing(item ?? null); reset(item ?? { title: '', message: '', category: 'informacao', priority: 'media', color: '#0ea5e9', active: true, startsAt: new Date().toISOString().slice(0, 10), endsAt: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10) }); setOpen(true); };
  const submit = (values: NoticeForm) => { upsert({ id: editing?.id ?? crypto.randomUUID(), ...values }); setOpen(false); notify(editing ? 'Aviso atualizado.' : 'Aviso criado.'); };
  return <div className="dashboard-stack"><div className="page-heading"><div><p className="eyebrow">Avisos</p><h1>Comunicados da turma</h1><p>Defina prioridade, período de exibição e categoria.</p></div><Button onClick={() => openForm()}><CirclePlus size={18} /> Novo aviso</Button></div><div className="card-grid">{notices.map((notice) => <Card key={notice.id} className="manager-card" ><div className="manager-card-accent" style={{ background: notice.color }} /><div className="section-heading"><div><Badge tone={notice.priority === 'urgente' ? 'danger' : notice.priority === 'alta' ? 'warning' : 'info'}>{notice.priority}</Badge><h2>{notice.title}</h2></div><Switch checked={notice.active} onChange={() => toggle(notice.id)} label="Ativo" /></div><p>{notice.message}</p><small>{notice.startsAt.split('-').reverse().join('/')} até {notice.endsAt.split('-').reverse().join('/')}</small><div className="card-actions"><Button variant="secondary" size="sm" onClick={() => openForm(notice)}><Edit3 size={16} /> Editar</Button><Button variant="ghost" size="sm" onClick={() => { if (confirm('Excluir este aviso?')) remove(notice.id); }}><Trash2 size={16} /> Excluir</Button></div></Card>)}</div>{!notices.length && <EmptyState title="Nenhum aviso" description="Crie um comunicado para a turma." />}
    <Modal open={open} title={editing ? 'Editar aviso' : 'Novo aviso'} onClose={() => setOpen(false)}><form onSubmit={handleSubmit(submit)} className="modal-form"><Field label="Título" error={errors.title?.message}><Input {...register('title')} /></Field><Field label="Mensagem" error={errors.message?.message}><Textarea {...register('message')} /></Field><div className="form-grid cols-2"><Field label="Categoria" error={errors.category?.message}><Select {...register('category')}><option value="informacao">Informação</option><option value="atencao">Atenção</option><option value="urgente">Urgente</option><option value="tarefa">Tarefa</option><option value="evento">Evento</option><option value="lembrete">Lembrete</option></Select></Field><Field label="Prioridade" error={errors.priority?.message}><Select {...register('priority')}><option value="baixa">Baixa</option><option value="media">Média</option><option value="alta">Alta</option><option value="urgente">Urgente</option></Select></Field><Field label="Data inicial" error={errors.startsAt?.message}><Input type="date" {...register('startsAt')} /></Field><Field label="Data final" error={errors.endsAt?.message}><Input type="date" {...register('endsAt')} /></Field><Field label="Cor" error={errors.color?.message}><Input type="color" {...register('color')} /></Field><Field label="Visibilidade"><label className="checkbox-line"><input type="checkbox" {...register('active')} /> Aviso ativo</label></Field></div><div className="form-actions"><Button variant="secondary" onClick={() => setOpen(false)}>Cancelar</Button><Button type="submit"><Save size={17} /> Salvar</Button></div></form></Modal>
  </div>;
}

export function TasksSection() {
  const tasks = useClassroomStore((state) => state.data.tasks);
  const upsert = useClassroomStore((state) => state.upsertTask);
  const remove = useClassroomStore((state) => state.removeTask);
  const toggle = useClassroomStore((state) => state.toggleTask);
  const notify = useClassroomStore((state) => state.notify);
  const [editing, setEditing] = useState<ClassroomTask | null>(null);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const visible = useMemo(() => tasks.filter((task) => filter === 'all' || (filter === 'completed' ? task.completed : !task.completed)).sort((a, b) => a.dueDate.localeCompare(b.dueDate)), [tasks, filter]);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<TaskForm>({ resolver: zodResolver(taskSchema) });
  const openForm = (item?: ClassroomTask) => { setEditing(item ?? null); reset(item ?? { title: '', subject: '', description: '', dueDate: new Date().toISOString().slice(0, 10), priority: 'media' }); setOpen(true); };
  const submit = (values: TaskForm) => { upsert({ id: editing?.id ?? crypto.randomUUID(), completed: editing?.completed ?? false, ...values }); setOpen(false); notify(editing ? 'Tarefa atualizada.' : 'Tarefa criada.'); };
  return <div className="dashboard-stack"><div className="page-heading"><div><p className="eyebrow">Tarefas</p><h1>Atividades e prazos</h1><p>Acompanhe entregas e marque o que foi concluído.</p></div><Button onClick={() => openForm()}><CirclePlus size={18} /> Nova tarefa</Button></div><div className="filter-bar"><button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>Todas</button><button className={filter === 'pending' ? 'active' : ''} onClick={() => setFilter('pending')}>Pendentes</button><button className={filter === 'completed' ? 'active' : ''} onClick={() => setFilter('completed')}>Concluídas</button></div><Card>{visible.length ? <div className="manager-list">{visible.map((task) => <article key={task.id} className={`manager-row ${task.completed ? 'row-completed' : ''}`}><button className="task-check" onClick={() => toggle(task.id)} aria-label="Alternar conclusão">{task.completed && <Check />}</button><div className="manager-main"><strong>{task.title}</strong><small>{task.subject} · {task.description}</small></div><time>{task.dueDate.split('-').reverse().join('/')}</time><Badge tone={task.priority === 'urgente' ? 'danger' : task.priority === 'alta' ? 'warning' : 'info'}>{task.priority}</Badge><div className="row-actions"><button aria-label="Editar" onClick={() => openForm(task)}><Edit3 /></button><button aria-label="Excluir" onClick={() => { if (confirm('Excluir esta tarefa?')) remove(task.id); }}><Trash2 /></button></div></article>)}</div> : <EmptyState title="Nenhuma tarefa encontrada" description="Ajuste o filtro ou adicione uma nova tarefa." />}</Card>
    <Modal open={open} title={editing ? 'Editar tarefa' : 'Nova tarefa'} onClose={() => setOpen(false)}><form onSubmit={handleSubmit(submit)} className="modal-form"><Field label="Título" error={errors.title?.message}><Input {...register('title')} /></Field><div className="form-grid cols-2"><Field label="Disciplina" error={errors.subject?.message}><Input {...register('subject')} /></Field><Field label="Prazo" error={errors.dueDate?.message}><Input type="date" {...register('dueDate')} /></Field></div><Field label="Descrição" error={errors.description?.message}><Textarea {...register('description')} /></Field><Field label="Prioridade" error={errors.priority?.message}><Select {...register('priority')}><option value="baixa">Baixa</option><option value="media">Média</option><option value="alta">Alta</option><option value="urgente">Urgente</option></Select></Field><div className="form-actions"><Button variant="secondary" onClick={() => setOpen(false)}>Cancelar</Button><Button type="submit"><Save size={17} /> Salvar</Button></div></form></Modal>
  </div>;
}

export function BirthdaysSection() {
  const birthdays = useClassroomStore((state) => state.data.birthdays);
  const upsert = useClassroomStore((state) => state.upsertBirthday);
  const remove = useClassroomStore((state) => state.removeBirthday);
  const notify = useClassroomStore((state) => state.notify);
  const [editing, setEditing] = useState<Birthday | null>(null);
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<BirthdayForm>({ resolver: zodResolver(birthdaySchema) });
  const openForm = (item?: Birthday) => { setEditing(item ?? null); reset(item ?? { name: '', birthDate: '', classroom: '', message: 'Feliz aniversário! Que seu dia seja excelente.' }); setOpen(true); };
  const submit = (values: BirthdayForm) => { upsert({ id: editing?.id ?? crypto.randomUUID(), photoDataUrl: editing?.photoDataUrl ?? '', ...values }); setOpen(false); notify(editing ? 'Aniversariante atualizado.' : 'Aniversariante cadastrado.'); };
  return <div className="dashboard-stack"><div className="page-heading"><div><p className="eyebrow">Aniversariantes</p><h1>Datas especiais</h1><p>O bloco aparece automaticamente quando houver aniversariante no dia.</p></div><Button onClick={() => openForm()}><Gift size={18} /> Cadastrar</Button></div><div className="card-grid">{birthdays.map((birthday) => <Card key={birthday.id} className="person-card"><span className="person-avatar">{birthday.name.charAt(0)}</span><div><h2>{birthday.name}</h2><p>{birthday.classroom}</p><small>{birthday.birthDate.split('-').reverse().join('/')}</small></div><div className="row-actions"><button onClick={() => openForm(birthday)} aria-label="Editar"><Edit3 /></button><button onClick={() => { if (confirm('Excluir este cadastro?')) remove(birthday.id); }} aria-label="Excluir"><Trash2 /></button></div></Card>)}</div>
    <Modal open={open} title={editing ? 'Editar aniversariante' : 'Novo aniversariante'} onClose={() => setOpen(false)}><form onSubmit={handleSubmit(submit)} className="modal-form"><Field label="Nome" error={errors.name?.message}><Input {...register('name')} /></Field><div className="form-grid cols-2"><Field label="Data de nascimento" error={errors.birthDate?.message}><Input type="date" {...register('birthDate')} /></Field><Field label="Turma" error={errors.classroom?.message}><Input {...register('classroom')} /></Field></div><Field label="Mensagem" error={errors.message?.message}><Textarea {...register('message')} /></Field><div className="form-actions"><Button variant="secondary" onClick={() => setOpen(false)}>Cancelar</Button><Button type="submit"><Save size={17} /> Salvar</Button></div></form></Modal>
  </div>;
}

const themes: Array<{ value: ThemeName; name: string; colors: string[] }> = [
  { value: 'school-blue', name: 'Azul escolar', colors: ['#2563eb', '#0f172a', '#dbeafe'] },
  { value: 'modern-green', name: 'Verde moderno', colors: ['#059669', '#064e3b', '#d1fae5'] },
  { value: 'creative-purple', name: 'Roxo criativo', colors: ['#7c3aed', '#312e81', '#ede9fe'] },
  { value: 'energetic-orange', name: 'Laranja energético', colors: ['#ea580c', '#7c2d12', '#ffedd5'] },
  { value: 'professional-dark', name: 'Escuro profissional', colors: ['#38bdf8', '#020617', '#1e293b'] },
  { value: 'high-contrast', name: 'Alto contraste', colors: ['#facc15', '#000000', '#ffffff'] },
  { value: 'kids', name: 'Infantil colorido', colors: ['#ec4899', '#4f46e5', '#fef3c7'] },
  { value: 'minimal', name: 'Minimalista claro', colors: ['#334155', '#f8fafc', '#e2e8f0'] }
];

export function AppearanceSection() {
  const appearance = useClassroomStore((state) => state.data.appearance);
  const display = useClassroomStore((state) => state.data.display);
  const updateAppearance = useClassroomStore((state) => state.updateAppearance);
  const updateDisplay = useClassroomStore((state) => state.updateDisplay);
  return <div className="dashboard-stack"><div className="page-heading"><div><p className="eyebrow">Aparência</p><h1>Personalização visual</h1><p>Escolha um tema e ajuste o layout exibido na sala.</p></div><Palette size={30} /></div><Card><div className="section-heading"><div><p className="eyebrow">Temas</p><h2>Identidade visual</h2></div></div><div className="theme-grid">{themes.map((theme) => <button key={theme.value} className={appearance.theme === theme.value ? 'theme-option active' : 'theme-option'} onClick={() => updateAppearance({ theme: theme.value })}><span>{theme.colors.map((color) => <i key={color} style={{ background: color }} />)}</span><strong>{theme.name}</strong>{appearance.theme === theme.value && <Check size={18} />}</button>)}</div></Card><div className="settings-grid"><Card><div className="section-heading"><div><p className="eyebrow">Interface</p><h2>Leitura e densidade</h2></div><Settings2 /></div><Switch checked={appearance.mode === 'dark'} onChange={(checked) => updateAppearance({ mode: checked ? 'dark' : 'light' })} label="Modo escuro" /><Switch checked={appearance.animations} onChange={(animations) => updateAppearance({ animations })} label="Animações" /><Field label="Escala da fonte"><input className="range" type="range" min="0.9" max="1.2" step="0.05" value={appearance.fontScale} onChange={(event) => updateAppearance({ fontScale: Number(event.target.value) })} /></Field><Field label="Arredondamento"><Select value={appearance.radius} onChange={(event) => updateAppearance({ radius: event.target.value as typeof appearance.radius })}><option value="compact">Compacto</option><option value="rounded">Arredondado</option><option value="soft">Suave</option></Select></Field></Card><Card><div className="section-heading"><div><p className="eyebrow">Modo de exibição</p><h2>Layout principal</h2></div><MonitorPlay /></div><div className="layout-options">{(['complete', 'focus', 'agenda'] as const).map((layout) => <button className={display.layout === layout ? 'active' : ''} key={layout} onClick={() => updateDisplay({ layout })}>{layout === 'complete' ? 'Painel completo' : layout === 'focus' ? 'Foco na atividade' : 'Agenda em destaque'}</button>)}</div><Switch checked={display.showAgenda} onChange={(showAgenda) => updateDisplay({ showAgenda })} label="Mostrar agenda" /><Switch checked={display.showTasks} onChange={(showTasks) => updateDisplay({ showTasks })} label="Mostrar tarefas" /><Switch checked={display.showMessage} onChange={(showMessage) => updateDisplay({ showMessage })} label="Mostrar mensagem do dia" /></Card></div></div>;
}

export function TimerSection() {
  return <div className="dashboard-stack"><div className="page-heading"><div><p className="eyebrow">Cronômetro</p><h1>Controle de tempo</h1><p>O tempo é calculado pelo relógio real e permanece correto em segundo plano.</p></div><RotateCcw /></div><TimerPanel /></div>;
}
