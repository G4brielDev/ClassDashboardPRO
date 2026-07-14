export type LessonStatus =
  | 'aguardando'
  | 'em-andamento'
  | 'individual'
  | 'grupo'
  | 'apresentacao'
  | 'intervalo'
  | 'avaliacao'
  | 'finalizada'
  | 'aviso';

export type AgendaType = 'aula' | 'atividade' | 'intervalo' | 'avaliacao' | 'apresentacao' | 'dinamica' | 'aviso' | 'outro';
export type AgendaStatus = 'pendente' | 'atual' | 'concluida';
export type Priority = 'baixa' | 'media' | 'alta' | 'urgente';
export type TimerStatus = 'stopped' | 'running' | 'paused' | 'finished';
export type DisplayLayout = 'complete' | 'focus' | 'agenda';
export type ThemeName = 'school-blue' | 'modern-green' | 'creative-purple' | 'energetic-orange' | 'professional-dark' | 'high-contrast' | 'kids' | 'minimal';

export interface SchoolSettings {
  schoolName: string;
  classroomName: string;
  teacherName: string;
  subjectName: string;
  logoDataUrl: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  color: string;
  icon: string;
}

export interface Lesson {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  status: LessonStatus;
  currentActivity: Activity;
  nextActivity: Activity;
  notes: string;
}

export interface AgendaItem {
  id: string;
  title: string;
  description: string;
  startTime: string;
  durationMinutes: number;
  type: AgendaType;
  status: AgendaStatus;
  color: string;
}

export interface Notice {
  id: string;
  title: string;
  message: string;
  category: 'informacao' | 'atencao' | 'urgente' | 'tarefa' | 'evento' | 'lembrete';
  priority: Priority;
  color: string;
  active: boolean;
  startsAt: string;
  endsAt: string;
}

export interface ClassroomTask {
  id: string;
  title: string;
  subject: string;
  description: string;
  dueDate: string;
  priority: Priority;
  completed: boolean;
}

export interface Birthday {
  id: string;
  name: string;
  birthDate: string;
  classroom: string;
  photoDataUrl: string;
  message: string;
}

export interface TimerState {
  durationSeconds: number;
  elapsedBeforeStart: number;
  startedAt: number | null;
  pausedAt: number | null;
  status: TimerStatus;
  warnedFiveMinutes: boolean;
  warnedOneMinute: boolean;
}

export interface AppearanceSettings {
  theme: ThemeName;
  mode: 'light' | 'dark';
  fontScale: number;
  radius: 'compact' | 'rounded' | 'soft';
  density: 'comfortable' | 'compact';
  animations: boolean;
}

export interface DisplaySettings {
  layout: DisplayLayout;
  showSeconds: boolean;
  clockFormat: '12h' | '24h';
  showDate: boolean;
  showTeacher: boolean;
  showSubject: boolean;
  showAgenda: boolean;
  showTasks: boolean;
  showBirthdays: boolean;
  showMessage: boolean;
  dailyMessage: string;
  rotateNotices: boolean;
  noticeRotationSeconds: number;
  soundsEnabled: boolean;
  volume: number;
  controlsAutoHideSeconds: number;
  keepAwake: boolean;
}

export interface HistoryEntry {
  id: string;
  date: string;
  classroom: string;
  subject: string;
  teacher: string;
  startedAt: string;
  endedAt: string;
  durationMinutes: number;
  completedActivities: number;
  notes: string;
}

export interface PinSettings {
  enabled: boolean;
  hash: string;
}

export interface ClassroomData {
  version: number;
  revision: number;
  lastUpdated: string;
  school: SchoolSettings;
  lesson: Lesson;
  agenda: AgendaItem[];
  notices: Notice[];
  tasks: ClassroomTask[];
  birthdays: Birthday[];
  timer: TimerState;
  appearance: AppearanceSettings;
  display: DisplaySettings;
  history: HistoryEntry[];
  pin: PinSettings;
}
