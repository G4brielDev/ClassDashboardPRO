import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createDefaultState } from './defaultState.js';
import { stateSchema, type ClassroomState } from './schema.js';

export interface StateStore {
  read(): Promise<ClassroomState>;
  write(state: ClassroomState): Promise<ClassroomState>;
  reset(): Promise<ClassroomState>;
}

export class JsonStateStore implements StateStore {
  constructor(private readonly filePath: string) {}

  async read(): Promise<ClassroomState> {
    try {
      const raw = await readFile(this.filePath, 'utf8');
      return stateSchema.parse(JSON.parse(raw));
    } catch {
      const initial = stateSchema.parse(createDefaultState());
      await this.write(initial);
      return initial;
    }
  }

  async write(state: ClassroomState): Promise<ClassroomState> {
    const valid = stateSchema.parse(state);
    await mkdir(path.dirname(this.filePath), { recursive: true });
    const tempPath = `${this.filePath}.tmp`;
    await writeFile(tempPath, JSON.stringify(valid, null, 2), 'utf8');
    await rename(tempPath, this.filePath);
    return valid;
  }

  async reset(): Promise<ClassroomState> {
    const state = stateSchema.parse(createDefaultState());
    return this.write(state);
  }
}
