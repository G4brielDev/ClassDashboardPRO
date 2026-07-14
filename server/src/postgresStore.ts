import { Pool } from 'pg';
import { createDefaultState } from './defaultState.js';
import { stateSchema, type ClassroomState } from './schema.js';
import type { StateStore } from './store.js';

const STATE_ID = 1;

export class PostgresStateStore implements StateStore {
  private readonly pool: Pool;

  constructor(connectionString: string) {
    this.pool = new Pool({ connectionString });
  }

  async read(): Promise<ClassroomState> {
    const result = await this.pool.query<{ data: unknown }>(
      'SELECT data FROM classroom_state WHERE id = $1',
      [STATE_ID]
    );

    if (result.rowCount) return stateSchema.parse(result.rows[0].data);
    return this.write(stateSchema.parse(createDefaultState()));
  }

  async write(state: ClassroomState): Promise<ClassroomState> {
    const valid = stateSchema.parse(state);
    const result = await this.pool.query<{ data: unknown }>(
      `INSERT INTO classroom_state (id, data, updated_at)
       VALUES ($1, $2::jsonb, NOW())
       ON CONFLICT (id) DO UPDATE
       SET data = EXCLUDED.data, updated_at = NOW()
       RETURNING data`,
      [STATE_ID, JSON.stringify(valid)]
    );
    return stateSchema.parse(result.rows[0].data);
  }

  async reset(): Promise<ClassroomState> {
    return this.write(stateSchema.parse(createDefaultState()));
  }
}
