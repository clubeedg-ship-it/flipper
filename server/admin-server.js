#!/usr/bin/env node
/**
 * Standalone admin server — runs on a separate port.
 * Proxies /api/chat to the main backend and serves the admin panel.
 */

import express from 'express';
import adminRouter from './admin.js';
import { logExchange } from './observability.js';
import { chat } from './chat.js';

const app = express();
const PORT = process.env.ADMIN_PORT || 3008;

app.use(express.json());
app.get('/', (_req, res) => res.redirect('/admin'));
app.use(adminRouter);

app.post('/api/chat', async (req, res) => {
  const { message, sessionId } = req.body ?? {};
  if (typeof message !== 'string' || message.trim() === '') {
    res.status(400).json({ error: 'Campo "message" é obrigatório.' });
    return;
  }
  const sid = typeof sessionId === 'string' && sessionId.trim() !== ''
    ? sessionId.trim()
    : `eval-${Date.now()}`;
  const t0 = Date.now();
  try {
    const reply = await chat(sid, message.trim());
    logExchange({ sessionId: sid, message: message.trim(), reply, latencyMs: Date.now() - t0 });
    res.json({ reply, sessionId: sid });
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    logExchange({ sessionId: sid, message: message.trim(), reply: '', latencyMs: Date.now() - t0, error: detail });
    res.status(502).json({ error: detail });
  }
});

app.listen(PORT, () => {
  console.log(`Flipper Admin running on port ${PORT}`);
});
