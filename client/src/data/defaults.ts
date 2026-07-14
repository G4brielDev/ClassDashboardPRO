import type { ClassroomData } from '../types';

const today = new Date();
const isoDay = today.toISOString().slice(0, 10);
const nextWeek = new Date(today.getTime() + 7 * 86400000).toISOString().slice(0, 10);
const birthdayToday = `2012-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

export const createDefaultData = (): ClassroomData => ({
  version: 1,
  revision: 1,
  lastUpdated: new Date().toISOString(),
  school: {
    schoolName: 'Escola Municipal Aprender',
    classroomName: '7º Ano A',
    teacherName: 'Professora Ana',
    subjectName: 'Ciências',
    logoDataUrl: ''
  },
  lesson: {
    title: 'Sistema Solar',
    description: 'Exploração dos planetas, movimentos e principais características do nosso sistema planetário.',
    startTime: '08:00',
    endTime: '09:40',
    status: 'em-andamento',
    currentActivity: {
      id: crypto.randomUUID(),
      title: 'Exploração guiada do Sistema Solar',
      description: 'Observe o material apresentado e registre três curiosidades no caderno.',
      startTime: '08:20',
      endTime: '08:50',
      color: '#2563eb',
      icon: 'Telescope'
    },
    nextActivity: {
      id: crypto.randomUUID(),
      title: 'Exercício em grupo',
      description: 'Formar grupos de quatro alunos para resolver o desafio proposto.',
      startTime: '08:50',
      endTime: '09:20',
      color: '#7c3aed',
      icon: 'Users'
    },
    notes: 'Reservar os últimos dez minutos para a revisão.'
  },
  agenda: [
    { id: crypto.randomUUID(), title: 'Acolhida e chamada', description: 'Organização inicial da turma.', startTime: '08:00', durationMinutes: 10, type: 'aula', status: 'concluida', color: '#64748b' },
    { id: crypto.randomUUID(), title: 'Revisão da aula anterior', description: 'Perguntas rápidas sobre o conteúdo.', startTime: '08:10', durationMinutes: 10, type: 'atividade', status: 'concluida', color: '#0ea5e9' },
    { id: crypto.randomUUID(), title: 'Sistema Solar', description: 'Apresentação principal.', startTime: '08:20', durationMinutes: 30, type: 'apresentacao', status: 'atual', color: '#2563eb' },
    { id: crypto.randomUUID(), title: 'Exercício em grupo', description: 'Desafio colaborativo.', startTime: '08:50', durationMinutes: 30, type: 'dinamica', status: 'pendente', color: '#7c3aed' },
    { id: crypto.randomUUID(), title: 'Revisão e encerramento', description: 'Síntese do aprendizado.', startTime: '09:20', durationMinutes: 20, type: 'aula', status: 'pendente', color: '#16a34a' }
  ],
  notices: [
    {
      id: crypto.randomUUID(),
      title: 'Entrega da atividade',
      message: 'Entregue a atividade de Ciências até sexta-feira.',
      category: 'tarefa',
      priority: 'alta',
      color: '#f59e0b',
      active: true,
      startsAt: isoDay,
      endsAt: nextWeek
    }
  ],
  tasks: [
    { id: crypto.randomUUID(), title: 'Mapa dos planetas', subject: 'Ciências', description: 'Construir um mapa visual com os oito planetas.', dueDate: nextWeek, priority: 'alta', completed: false },
    { id: crypto.randomUUID(), title: 'Leitura complementar', subject: 'Ciências', description: 'Ler as páginas 42 a 48.', dueDate: nextWeek, priority: 'media', completed: false }
  ],
  birthdays: [
    { id: crypto.randomUUID(), name: 'Lucas', birthDate: birthdayToday, classroom: '7º Ano A', photoDataUrl: '', message: 'Feliz aniversário! Que seu dia seja excelente.' }
  ],
  timer: {
    durationSeconds: 25 * 60,
    elapsedBeforeStart: 0,
    startedAt: null,
    pausedAt: null,
    status: 'stopped',
    warnedFiveMinutes: false,
    warnedOneMinute: false
  },
  appearance: {
    theme: 'school-blue',
    mode: 'light',
    fontScale: 1,
    radius: 'rounded',
    density: 'comfortable',
    animations: true
  },
  display: {
    layout: 'complete',
    showSeconds: true,
    clockFormat: '24h',
    showDate: true,
    showTeacher: true,
    showSubject: true,
    showAgenda: true,
    showTasks: true,
    showBirthdays: true,
    showMessage: true,
    dailyMessage: 'Aprender é descobrir novas possibilidades todos os dias.',
    rotateNotices: true,
    noticeRotationSeconds: 8,
    soundsEnabled: false,
    volume: 0.5,
    controlsAutoHideSeconds: 6,
    keepAwake: true
  },
  history: [],
  pin: {
    enabled: false,
    hash: ''
  }
});

export const DEFAULT_DATA = createDefaultData();
