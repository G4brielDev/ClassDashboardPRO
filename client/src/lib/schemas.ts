import { z } from 'zod';

export const lessonSchema = z.object({
  title: z.string().min(2, 'Informe o título da aula.'),
  description: z.string().min(3, 'Informe uma descrição.'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Horário inválido.'),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, 'Horário inválido.'),
  status: z.enum(['aguardando', 'em-andamento', 'individual', 'grupo', 'apresentacao', 'intervalo', 'avaliacao', 'finalizada', 'aviso']),
  currentActivityTitle: z.string().min(2, 'Informe a atividade atual.'),
  currentActivityDescription: z.string().min(2, 'Informe a descrição da atividade.'),
  nextActivityTitle: z.string().min(2, 'Informe a próxima atividade.'),
  nextActivityDescription: z.string().min(2, 'Informe a descrição da próxima atividade.'),
  notes: z.string().optional()
}).refine((value) => value.endTime > value.startTime, {
  message: 'O horário final deve ser posterior ao inicial.',
  path: ['endTime']
});

export const agendaSchema = z.object({
  title: z.string().min(2, 'Informe o título.'),
  description: z.string().min(2, 'Informe a descrição.'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Horário inválido.'),
  durationMinutes: z.coerce.number().int().min(1, 'A duração deve ser maior que zero.').max(480),
  type: z.enum(['aula', 'atividade', 'intervalo', 'avaliacao', 'apresentacao', 'dinamica', 'aviso', 'outro']),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Cor inválida.')
});

export const noticeSchema = z.object({
  title: z.string().min(2, 'Informe o título.'),
  message: z.string().min(3, 'Informe a mensagem.'),
  category: z.enum(['informacao', 'atencao', 'urgente', 'tarefa', 'evento', 'lembrete']),
  priority: z.enum(['baixa', 'media', 'alta', 'urgente']),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Cor inválida.'),
  active: z.boolean(),
  startsAt: z.string().min(1, 'Informe a data inicial.'),
  endsAt: z.string().min(1, 'Informe a data final.')
}).refine((value) => value.endsAt >= value.startsAt, {
  message: 'A data final deve ser igual ou posterior à inicial.',
  path: ['endsAt']
});

export const taskSchema = z.object({
  title: z.string().min(2, 'Informe o título.'),
  subject: z.string().min(2, 'Informe a disciplina.'),
  description: z.string().min(2, 'Informe a descrição.'),
  dueDate: z.string().min(1, 'Informe o prazo.'),
  priority: z.enum(['baixa', 'media', 'alta', 'urgente'])
});

export const birthdaySchema = z.object({
  name: z.string().min(2, 'Informe o nome.'),
  birthDate: z.string().min(1, 'Informe a data de nascimento.'),
  classroom: z.string().min(1, 'Informe a turma.'),
  message: z.string().min(2, 'Informe uma mensagem.')
});

export const schoolSchema = z.object({
  schoolName: z.string().min(2, 'Informe o nome da escola.'),
  classroomName: z.string().min(1, 'Informe a turma.'),
  teacherName: z.string().min(2, 'Informe o professor.'),
  subjectName: z.string().min(2, 'Informe a disciplina.')
});
