import { randomUUID } from 'node:crypto';

export function createDefaultState() {
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const nextWeek = new Date(now.getTime() + 7 * 86400000).toISOString().slice(0, 10);
  const birthday = `2012-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  return {
    version: 1,
    revision: 1,
    lastUpdated: now.toISOString(),
    school: { schoolName: 'Escola Municipal Aprender', classroomName: '7º Ano A', teacherName: 'Professora Ana', subjectName: 'Ciências', logoDataUrl: '' },
    lesson: {
      title: 'Sistema Solar', description: 'Exploração dos planetas, movimentos e principais características.', startTime: '08:00', endTime: '09:40', status: 'em-andamento', notes: '',
      currentActivity: { id: randomUUID(), title: 'Exploração guiada do Sistema Solar', description: 'Observe o material e registre três curiosidades.', startTime: '08:20', endTime: '08:50', color: '#2563eb', icon: 'Telescope' },
      nextActivity: { id: randomUUID(), title: 'Exercício em grupo', description: 'Formar grupos de quatro alunos.', startTime: '08:50', endTime: '09:20', color: '#7c3aed', icon: 'Users' }
    },
    agenda: [
      { id: randomUUID(), title: 'Acolhida e chamada', description: 'Organização inicial.', startTime: '08:00', durationMinutes: 10, type: 'aula', status: 'concluida', color: '#64748b' },
      { id: randomUUID(), title: 'Sistema Solar', description: 'Apresentação principal.', startTime: '08:20', durationMinutes: 30, type: 'apresentacao', status: 'atual', color: '#2563eb' },
      { id: randomUUID(), title: 'Exercício em grupo', description: 'Desafio colaborativo.', startTime: '08:50', durationMinutes: 30, type: 'dinamica', status: 'pendente', color: '#7c3aed' }
    ],
    notices: [{ id: randomUUID(), title: 'Entrega da atividade', message: 'Entregue a atividade até sexta-feira.', category: 'tarefa', priority: 'alta', color: '#f59e0b', active: true, startsAt: today, endsAt: nextWeek }],
    tasks: [{ id: randomUUID(), title: 'Mapa dos planetas', subject: 'Ciências', description: 'Construir um mapa visual.', dueDate: nextWeek, priority: 'alta', completed: false }],
    birthdays: [{ id: randomUUID(), name: 'Lucas', birthDate: birthday, classroom: '7º Ano A', photoDataUrl: '', message: 'Feliz aniversário!' }],
    timer: { durationSeconds: 1500, elapsedBeforeStart: 0, startedAt: null, pausedAt: null, status: 'stopped', warnedFiveMinutes: false, warnedOneMinute: false },
    appearance: { theme: 'school-blue', mode: 'light', fontScale: 1, radius: 'rounded', density: 'comfortable', animations: true },
    display: { layout: 'complete', showSeconds: true, clockFormat: '24h', showDate: true, showTeacher: true, showSubject: true, showAgenda: true, showTasks: true, showBirthdays: true, showMessage: true, dailyMessage: 'Aprender é descobrir novas possibilidades todos os dias.', rotateNotices: true, noticeRotationSeconds: 8, soundsEnabled: false, volume: .5, controlsAutoHideSeconds: 6, keepAwake: true },
    history: [],
    pin: { enabled: false, hash: '' }
  };
}
