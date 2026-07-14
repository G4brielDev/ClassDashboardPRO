import { z } from 'zod';
import type { ClassroomData } from '../types';

const classroomImportSchema = z.object({
  version: z.number(),
  revision: z.number(),
  lastUpdated: z.string(),
  school: z.object({
    schoolName: z.string(), classroomName: z.string(), teacherName: z.string(), subjectName: z.string(), logoDataUrl: z.string()
  }),
  lesson: z.record(z.any()),
  agenda: z.array(z.record(z.any())),
  notices: z.array(z.record(z.any())),
  tasks: z.array(z.record(z.any())),
  birthdays: z.array(z.record(z.any())),
  timer: z.record(z.any()),
  appearance: z.record(z.any()),
  display: z.record(z.any()),
  history: z.array(z.record(z.any())),
  pin: z.record(z.any())
});

export function exportData(data: ClassroomData): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `tela-de-sala-${new Date().toISOString().slice(0, 10)}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export async function importData(file: File): Promise<ClassroomData> {
  if (!file.name.toLowerCase().endsWith('.json')) throw new Error('Selecione um arquivo JSON.');
  if (file.size > 5 * 1024 * 1024) throw new Error('O arquivo deve ter no máximo 5 MB.');
  const text = await file.text();
  const parsed = JSON.parse(text);
  return classroomImportSchema.parse(parsed) as ClassroomData;
}
