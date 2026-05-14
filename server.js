import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { chat } from './server/chat.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3005;

app.use(express.json());
app.use(express.static(join(__dirname, 'dist')));

// ---------------------------------------------------------------------------
// POST /api/chat
// Body:     { message: string, sessionId: string }
// Response: { reply: string, sessionId: string }
// ---------------------------------------------------------------------------
app.post('/api/chat', async (req, res) => {
  const { message, sessionId } = req.body ?? {};

  if (typeof message !== 'string' || message.trim() === '') {
    res.status(400).json({ error: 'Campo "message" é obrigatório e deve ser uma string não vazia.' });
    return;
  }

  const sid = typeof sessionId === 'string' && sessionId.trim() !== ''
    ? sessionId.trim()
    : `session-${Date.now()}-${Math.random().toString(36).slice(2)}`;

  try {
    const reply = await chat(sid, message.trim());
    res.json({ reply, sessionId: sid });
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    console.error('[/api/chat] Erro ao processar mensagem:', detail);
    res.status(502).json({
      error: 'Não foi possível obter resposta do assistente.',
      detail,
    });
  }
});

app.get('*', (_req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Flipper running on port ${PORT}`);
});
