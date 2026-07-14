import { z } from 'zod';

export const stateSchema = z.object({
  version: z.number().int().positive(),
  revision: z.number().int().nonnegative(),
  lastUpdated: z.string().datetime(),
  school: z.object({ schoolName: z.string(), classroomName: z.string(), teacherName: z.string(), subjectName: z.string(), logoDataUrl: z.string() }),
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
}).passthrough();

export type ClassroomState = z.infer<typeof stateSchema>;
