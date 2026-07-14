import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createApp } from './app.js';
import { PostgresStateStore } from './postgresStore.js';
import { JsonStateStore } from './store.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT ?? 3333);
const dataFile = process.env.DATA_FILE ?? path.resolve(__dirname, '../data/classroom-state.json');
const store = process.env.DATABASE_URL
  ? new PostgresStateStore(process.env.DATABASE_URL)
  : new JsonStateStore(dataFile);

async function start() {
  await store.read();
  const app = createApp(store);
  app.listen(port, '0.0.0.0', () => {
    console.log(`Tela de Sala API disponível em http://localhost:${port}`);
  });
}

start().catch((error) => {
  console.error('Não foi possível iniciar a aplicação.', error);
  process.exit(1);
});
