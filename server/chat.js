/**
 * chat.js
 *
 * Manages per-session conversation history and handles Ollama requests.
 * Sessions are stored in-process memory (Map). Each session keeps an ordered
 * array of { role, content } messages as required by the Ollama chat API.
 *
 * Critical: Ollama requests MUST include "think": false for qwen3 models,
 * otherwise the model produces no visible output.
 */

import { dataContext } from './context.js';

const OLLAMA_URL   = 'http://127.0.0.1:11434/api/chat';
const OLLAMA_MODEL = 'qwen3.6:27b';

const SYSTEM_PROMPT = `Você é o Assistente Flipper, um assistente virtual integrado ao painel financeiro Flipper.

O Flipper é uma plataforma de gestão de marcas parceiras em lojas multi-marcas. Você tem acesso completo aos dados operacionais do sistema: vendas brutas, repasses, mensalidades, NF-e, catálogo de produtos e status de cada marca.

Seus dados de referência estão abaixo. Responda sempre em português brasileiro, seja objetivo e preciso. Quando apresentar valores financeiros, use o formato R$ X.XXX. Quando não souber algo que não está nos dados fornecidos, diga claramente que a informação não está disponível no sistema.

${dataContext}`;

/** @type {Map<string, Array<{role: string, content: string}>>} */
const sessions = new Map();

/**
 * Returns (or creates) the message history for a session.
 * @param {string} sessionId
 * @returns {Array<{role: string, content: string}>}
 */
function getSession(sessionId) {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, []);
  }
  return /** @type {Array<{role: string, content: string}>} */ (sessions.get(sessionId));
}

/**
 * Sends a user message to Ollama and returns the assistant reply.
 * Conversation history is appended and persisted in-memory per session.
 *
 * @param {string} sessionId  - Unique session identifier from the client
 * @param {string} userMessage - The user's natural language question
 * @returns {Promise<string>} The assistant's reply text
 */
export async function chat(sessionId, userMessage) {
  const history = getSession(sessionId);

  history.push({ role: 'user', content: userMessage });

  const requestBody = {
    model: OLLAMA_MODEL,
    think: false,          // REQUIRED: qwen3 produces no output without this
    stream: false,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history,
    ],
  };

  let response;
  try {
    response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });
  } catch (err) {
    // Network-level failure (Ollama not running, connection refused, etc.)
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Ollama unreachable: ${message}`);
  }

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`Ollama returned HTTP ${response.status}: ${body}`);
  }

  /** @type {any} */
  const data = await response.json();

  const reply = data?.message?.content;
  if (typeof reply !== 'string' || reply.trim() === '') {
    throw new Error('Ollama returned an empty or malformed response');
  }

  history.push({ role: 'assistant', content: reply });

  return reply;
}
