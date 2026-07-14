import cors from 'cors';
import express, { type Response } from 'express';
import helmet from 'helmet';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ZodError } from 'zod';
import { stateSchema } from './schema.js';
import type { StateStore } from './store.js';

export function createApp(store: StateStore) {
  const app = express();
  const clients = new Set<Response>();
  const allowedOrigins = (process.env.CORS_ORIGIN ?? '').split(',').map((value) => value.trim()).filter(Boolean);

  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.use(cors({ origin: allowedOrigins.length ? allowedOrigins : true }));
  app.use(express.json({ limit: '6mb' }));

  app.get('/api/health', (_request, response) => response.json({ status: 'ok', service: 'tela-de-sala-api', timestamp: new Date().toISOString() }));
  app.get('/api/state', async (_request, response, next) => { try { response.json(await store.read()); } catch (error) { next(error); } });
  app.put('/api/state', async (request, response, next) => {
    try {
      const current = await store.read();
      const incoming = stateSchema.parse(request.body);
      if (incoming.revision < current.revision) return response.status(409).json({ error: 'A versão enviada está desatualizada.', current });
      const saved = await store.write(incoming);
      for (const client of clients) client.write(`event: state-updated\ndata: ${JSON.stringify({ revision: saved.revision, lastUpdated: saved.lastUpdated })}\n\n`);
      response.json(saved);
    } catch (error) { next(error); }
  });
  app.post('/api/reset', async (_request, response, next) => {
    try {
      const state = await store.reset();
      for (const client of clients) client.write(`event: state-updated\ndata: ${JSON.stringify({ revision: state.revision })}\n\n`);
      response.json(state);
    } catch (error) { next(error); }
  });
  app.get('/api/events', (request, response) => {
    response.setHeader('Content-Type', 'text/event-stream');
    response.setHeader('Cache-Control', 'no-cache');
    response.setHeader('Connection', 'keep-alive');
    response.flushHeaders();
    response.write(`event: connected\ndata: ${JSON.stringify({ connected: true })}\n\n`);
    clients.add(response);
    const heartbeat = setInterval(() => response.write(': heartbeat\n\n'), 25000);
    request.on('close', () => { clearInterval(heartbeat); clients.delete(response); });
  });

  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const clientDist = path.resolve(__dirname, '../../client/dist');
  app.use('/assets', express.static(path.join(clientDist, 'assets'), { maxAge: '1y', immutable: true }));
  app.use(express.static(clientDist, { maxAge: '1h' }));
  app.get('*', (request, response, next) => {
    if (request.path.startsWith('/api/')) return next();
    response.sendFile(path.join(clientDist, 'index.html'), (error) => error && next(error));
  });

  app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
    void _next;
    if (error instanceof ZodError) return response.status(400).json({ error: 'Dados inválidos.', details: error.flatten() });
    console.error(error);
    response.status(500).json({ error: 'Erro interno do servidor.' });
  });

  return app;
}
