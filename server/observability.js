/**
 * observability.js
 *
 * In-memory log of all chat exchanges + evaluation rules for the 3 key prompts.
 * Each log entry captures: sessionId, message, reply, latency, timestamp, and
 * if it matches an eval prompt, a scored breakdown of expected vs actual references.
 */

/** @type {Array<LogEntry>} */
const logs = [];

/**
 * @typedef {{
 *   id: number,
 *   sessionId: string,
 *   message: string,
 *   reply: string,
 *   latencyMs: number,
 *   timestamp: string,
 *   replyChars: number,
 *   error: string | null,
 *   eval: EvalResult | null
 * }} LogEntry
 *
 * @typedef {{
 *   promptId: string,
 *   promptLabel: string,
 *   checks: Array<{label: string, expected: string, found: boolean, evidence: string}>,
 *   score: number,
 *   maxScore: number,
 *   pass: boolean
 * }} EvalResult
 */

const EVAL_PROMPTS = [
  {
    id: 'repasses-bloqueio',
    label: 'Cross-entity: repasses pendentes + bloqueio por mensalidade',
    triggers: ['repasses pendentes', 'bloqueadas', 'mensalidade em atraso'],
    checks: [
      { label: 'Menciona valor total pendente', expected: '5.025', keywords: ['5.025', '5025'] },
      { label: 'Menciona valor bloqueado', expected: '1.199', keywords: ['1.199', '1199'] },
      { label: 'Identifica Lua Cheia como atrasada', expected: 'Lua Cheia', keywords: ['lua cheia'] },
      { label: 'Identifica Dona Sol como bloqueada', expected: 'Dona Sol', keywords: ['dona sol'] },
      { label: 'Relaciona bloqueio à mensalidade', expected: 'mensalidade', keywords: ['mensalidade', 'atraso'] },
    ],
  },
  {
    id: 'fechamento-junho',
    label: 'Operational synthesis: o que falta para fechar junho',
    triggers: ['fechar o mês', 'fechamento', 'falta para fechar'],
    checks: [
      { label: 'Menciona SKUs sem vínculo', expected: '3 SKUs', keywords: ['3 sku', 'sku', 'sem marca', 'sem loja'] },
      { label: 'Menciona NF-e pendentes', expected: 'NF-e', keywords: ['nf-e', 'nfe', 'nota fiscal'] },
      { label: 'Menciona mensalidades pendentes', expected: 'mensalidades', keywords: ['mensalidade', 'pendente'] },
      { label: 'Menciona emissão de repasse', expected: 'repasse', keywords: ['repasse', 'emitir', 'emissão'] },
      { label: 'Dá sequência ou priorização', expected: 'ação/sequência', keywords: ['primeiro', 'antes', 'prioridade', 'passo', 'etapa', 'ordem', 'precisa'] },
    ],
  },
  {
    id: 'margem-calculo',
    label: 'Edge case + math: margem real da loja',
    triggers: ['margem real', 'margem da loja', 'vendas brutas menos'],
    checks: [
      { label: 'Usa vendas brutas totais', expected: '34.200', keywords: ['34.200', '34200'] },
      { label: 'Subtrai repasses', expected: 'repasses', keywords: ['repasse', '16.235', '16235'] },
      { label: 'Inclui mensalidades recebidas', expected: 'mensalidades', keywords: ['mensalidade', '10.800', '7.600'] },
      { label: 'Apresenta cálculo ou fórmula', expected: 'fórmula', keywords: ['=', '+', '-', 'menos', 'mais', 'total', 'resultado'] },
      { label: 'Chega a um número final', expected: 'valor R$', keywords: ['r$', 'margem'] },
    ],
  },
];

/**
 * Match a user message against eval prompt triggers.
 * @param {string} message
 * @returns {typeof EVAL_PROMPTS[number] | null}
 */
function matchEvalPrompt(message) {
  const lower = message.toLowerCase();
  return EVAL_PROMPTS.find(ep => ep.triggers.some(t => lower.includes(t))) || null;
}

/**
 * Run evaluation checks against a reply.
 * @param {typeof EVAL_PROMPTS[number]} evalPrompt
 * @param {string} reply
 * @returns {EvalResult}
 */
function evaluate(evalPrompt, reply) {
  const lower = reply.toLowerCase();
  const checks = evalPrompt.checks.map(check => {
    const found = check.keywords.some(kw => lower.includes(kw.toLowerCase()));
    const idx = check.keywords.reduce((best, kw) => {
      const i = lower.indexOf(kw.toLowerCase());
      return i >= 0 && (best < 0 || i < best) ? i : best;
    }, -1);
    const evidence = found && idx >= 0
      ? reply.slice(Math.max(0, idx - 30), idx + 60).replace(/\n/g, ' ')
      : '';
    return { label: check.label, expected: check.expected, found, evidence };
  });

  const score = checks.filter(c => c.found).length;
  return {
    promptId: evalPrompt.id,
    promptLabel: evalPrompt.label,
    checks,
    score,
    maxScore: checks.length,
    pass: score >= Math.ceil(checks.length * 0.6),
  };
}

/**
 * Log a chat exchange. Called from the /api/chat handler.
 * @param {{sessionId: string, message: string, reply: string, latencyMs: number, error?: string}} entry
 * @returns {LogEntry}
 */
export function logExchange(entry) {
  const matched = matchEvalPrompt(entry.message);
  const evalResult = matched && !entry.error ? evaluate(matched, entry.reply) : null;

  const logEntry = {
    id: logs.length + 1,
    sessionId: entry.sessionId,
    message: entry.message,
    reply: entry.reply || '',
    latencyMs: entry.latencyMs,
    timestamp: new Date().toISOString(),
    replyChars: (entry.reply || '').length,
    error: entry.error || null,
    eval: evalResult,
  };

  logs.push(logEntry);
  if (logs.length > 500) logs.shift();
  return logEntry;
}

/**
 * Get all logs, newest first.
 * @returns {Array<LogEntry>}
 */
export function getLogs() {
  return [...logs].reverse();
}

/**
 * Get summary stats.
 */
export function getStats() {
  const total = logs.length;
  const errors = logs.filter(l => l.error).length;
  const evals = logs.filter(l => l.eval);
  const passed = evals.filter(l => l.eval?.pass).length;
  const avgLatency = total > 0 ? Math.round(logs.reduce((s, l) => s + l.latencyMs, 0) / total) : 0;
  const sessions = new Set(logs.map(l => l.sessionId)).size;

  return { total, errors, evals: evals.length, passed, failed: evals.length - passed, avgLatency, sessions };
}

/** Return the 3 eval prompt definitions for the admin UI. */
export function getEvalPrompts() {
  return EVAL_PROMPTS.map(ep => ({ id: ep.id, label: ep.label, prompt: ep.triggers[0] }));
}
