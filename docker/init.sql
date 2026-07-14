CREATE TABLE IF NOT EXISTS classroom_state (
  id INTEGER PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO classroom_state (id, data)
VALUES (
  1,
  jsonb_build_object(
    'version', 1,
    'revision', 1,
    'lastUpdated', to_char(CURRENT_TIMESTAMP AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'),
    'school', jsonb_build_object(
      'schoolName', 'Escola Docker',
      'classroomName', '8º Ano A',
      'teacherName', 'Professora Marina',
      'subjectName', 'Tecnologia',
      'logoDataUrl', ''
    ),
    'lesson', jsonb_build_object(
      'title', 'Introdução à Programação',
      'description', 'Aula prática com dados mock carregados pelo PostgreSQL.',
      'startTime', '08:00',
      'endTime', '09:40',
      'status', 'em-andamento',
      'notes', 'Ambiente iniciado pelo Docker Compose.',
      'currentActivity', jsonb_build_object(
        'id', '00000000-0000-4000-8000-000000000001',
        'title', 'Lógica e algoritmos',
        'description', 'Resolver o primeiro desafio em duplas.',
        'startTime', '08:20',
        'endTime', '08:50',
        'color', '#2563eb',
        'icon', 'Code2'
      ),
      'nextActivity', jsonb_build_object(
        'id', '00000000-0000-4000-8000-000000000002',
        'title', 'Apresentação das soluções',
        'description', 'Cada dupla apresenta seu algoritmo.',
        'startTime', '08:50',
        'endTime', '09:20',
        'color', '#7c3aed',
        'icon', 'Users'
      )
    ),
    'agenda', jsonb_build_array(
      jsonb_build_object('id', '00000000-0000-4000-8000-000000000011', 'title', 'Acolhida', 'description', 'Organização da turma.', 'startTime', '08:00', 'durationMinutes', 20, 'type', 'aula', 'status', 'concluida', 'color', '#64748b'),
      jsonb_build_object('id', '00000000-0000-4000-8000-000000000012', 'title', 'Lógica e algoritmos', 'description', 'Atividade prática.', 'startTime', '08:20', 'durationMinutes', 30, 'type', 'atividade', 'status', 'atual', 'color', '#2563eb'),
      jsonb_build_object('id', '00000000-0000-4000-8000-000000000013', 'title', 'Apresentações', 'description', 'Compartilhamento das soluções.', 'startTime', '08:50', 'durationMinutes', 30, 'type', 'apresentacao', 'status', 'pendente', 'color', '#7c3aed')
    ),
    'notices', jsonb_build_array(
      jsonb_build_object('id', '00000000-0000-4000-8000-000000000021', 'title', 'Ambiente Docker ativo', 'message', 'Este aviso foi inserido pelo script docker/init.sql.', 'category', 'informacao', 'priority', 'alta', 'color', '#0ea5e9', 'active', true, 'startsAt', to_char(CURRENT_DATE, 'YYYY-MM-DD'), 'endsAt', to_char(CURRENT_DATE + 7, 'YYYY-MM-DD'))
    ),
    'tasks', jsonb_build_array(
      jsonb_build_object('id', '00000000-0000-4000-8000-000000000031', 'title', 'Criar um algoritmo', 'subject', 'Tecnologia', 'description', 'Escrever um algoritmo com cinco etapas.', 'dueDate', to_char(CURRENT_DATE + 7, 'YYYY-MM-DD'), 'priority', 'alta', 'completed', false)
    ),
    'birthdays', jsonb_build_array(
      jsonb_build_object('id', '00000000-0000-4000-8000-000000000041', 'name', 'Alex', 'birthDate', '2012-07-13', 'classroom', '8º Ano A', 'photoDataUrl', '', 'message', 'Feliz aniversário!')
    ),
    'timer', jsonb_build_object('durationSeconds', 1500, 'elapsedBeforeStart', 0, 'startedAt', NULL, 'pausedAt', NULL, 'status', 'stopped', 'warnedFiveMinutes', false, 'warnedOneMinute', false),
    'appearance', jsonb_build_object('theme', 'school-blue', 'mode', 'light', 'fontScale', 1, 'radius', 'rounded', 'density', 'comfortable', 'animations', true),
    'display', jsonb_build_object('layout', 'complete', 'showSeconds', true, 'clockFormat', '24h', 'showDate', true, 'showTeacher', true, 'showSubject', true, 'showAgenda', true, 'showTasks', true, 'showBirthdays', true, 'showMessage', true, 'dailyMessage', 'Aprender, testar e compartilhar.', 'rotateNotices', true, 'noticeRotationSeconds', 8, 'soundsEnabled', false, 'volume', 0.5, 'controlsAutoHideSeconds', 6, 'keepAwake', true),
    'history', jsonb_build_array(),
    'pin', jsonb_build_object('enabled', false, 'hash', '')
  )
)
ON CONFLICT (id) DO NOTHING;
