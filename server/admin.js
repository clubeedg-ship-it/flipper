/**
 * admin.js
 *
 * Admin routes: /admin (HTML panel), /api/admin/* (JSON endpoints).
 */

import { Router } from 'express';
import { getLogs, getStats, getEvalPrompts } from './observability.js';

const router = Router();

// JSON API
router.get('/api/admin/stats', (_req, res) => res.json(getStats()));
router.get('/api/admin/logs', (_req, res) => {
  const logs = getLogs();
  const sessionId = /** @type {string} */ (_req.query.session);
  res.json(sessionId ? logs.filter(l => l.sessionId === sessionId) : logs);
});
router.get('/api/admin/eval-prompts', (_req, res) => res.json(getEvalPrompts()));

// Admin HTML panel
router.get('/admin', (_req, res) => {
  res.type('html').send(ADMIN_HTML);
});

const ADMIN_HTML = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Flipper Admin — Chat Observability</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', system-ui, sans-serif; background: #f5f3ef; color: #111; }
  .container { max-width: 1100px; margin: 0 auto; padding: 24px 16px; }
  h1 { font-size: 22px; font-weight: 700; margin-bottom: 6px; }
  h1 span { color: #0D9488; }
  .subtitle { font-size: 13px; color: #777; margin-bottom: 24px; }
  .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; margin-bottom: 28px; }
  .stat-card { background: #fff; border: 1px solid rgba(0,0,0,0.08); border-radius: 12px; padding: 16px; }
  .stat-card .label { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #999; margin-bottom: 6px; }
  .stat-card .value { font-size: 26px; font-weight: 700; font-family: 'JetBrains Mono', monospace; }
  .stat-card .value.green { color: #16A34A; }
  .stat-card .value.red { color: #DC2626; }
  .stat-card .value.teal { color: #0D9488; }

  .section-title { font-size: 15px; font-weight: 600; margin: 24px 0 12px; display: flex; align-items: center; gap: 8px; }
  .badge { font-size: 11px; padding: 2px 8px; border-radius: 20px; font-weight: 600; }
  .badge.pass { background: rgba(22,163,74,0.12); color: #166534; }
  .badge.fail { background: rgba(220,38,38,0.1); color: #991B1B; }
  .badge.pending { background: rgba(0,0,0,0.06); color: #666; }

  .log-table { width: 100%; border-collapse: collapse; font-size: 13px; }
  .log-table th { text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #999; padding: 8px 12px; border-bottom: 1px solid rgba(0,0,0,0.08); }
  .log-table td { padding: 10px 12px; border-bottom: 1px solid rgba(0,0,0,0.05); vertical-align: top; }
  .log-table tr:hover { background: rgba(0,0,0,0.02); }
  .log-table .mono { font-family: 'JetBrains Mono', monospace; font-size: 12px; }
  .msg-cell { max-width: 280px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .msg-cell:hover { white-space: normal; word-break: break-word; }

  .eval-card { background: #fff; border: 1px solid rgba(0,0,0,0.08); border-radius: 12px; padding: 16px; margin-bottom: 12px; }
  .eval-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
  .eval-title { font-size: 14px; font-weight: 600; }
  .eval-score { font-family: 'JetBrains Mono', monospace; font-size: 13px; }
  .check-row { display: flex; align-items: flex-start; gap: 8px; padding: 4px 0; font-size: 12px; }
  .check-icon { width: 18px; text-align: center; flex-shrink: 0; font-size: 14px; }
  .check-icon.ok { color: #16A34A; }
  .check-icon.miss { color: #DC2626; }
  .evidence { font-size: 11px; color: #888; font-style: italic; margin-top: 2px; }

  .eval-prompts { display: grid; gap: 8px; margin-bottom: 20px; }
  .eval-prompt-btn { background: #fff; border: 1px solid rgba(0,0,0,0.1); border-radius: 10px; padding: 12px 16px; cursor: pointer; text-align: left; font-size: 13px; transition: all 0.15s; }
  .eval-prompt-btn:hover { border-color: #0D9488; background: rgba(13,148,136,0.04); }
  .eval-prompt-btn .ep-label { font-weight: 600; margin-bottom: 4px; }
  .eval-prompt-btn .ep-prompt { color: #0D9488; font-family: 'JetBrains Mono', monospace; font-size: 11px; }
  .eval-prompt-btn.running { opacity: 0.6; pointer-events: none; }

  .refresh-btn { background: #0D9488; color: #fff; border: none; border-radius: 8px; padding: 8px 16px; font-size: 12px; font-weight: 600; cursor: pointer; }
  .refresh-btn:hover { background: #0B7A70; }
  .toolbar { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }

  .empty { text-align: center; padding: 40px; color: #999; font-size: 14px; }
  .tabs { display: flex; gap: 4px; margin-bottom: 16px; }
  .tab { padding: 6px 14px; border-radius: 8px; font-size: 13px; font-weight: 500; cursor: pointer; background: transparent; border: none; color: #777; }
  .tab.active { background: rgba(13,148,136,0.1); color: #0D9488; }
</style>
</head>
<body>
<div class="container">
  <h1><span>Flipper</span> Admin</h1>
  <p class="subtitle">Chat Observability &amp; Evaluation Dashboard</p>

  <div id="stats" class="stats-grid"></div>

  <div class="tabs">
    <button class="tab active" onclick="showTab('logs')">Logs</button>
    <button class="tab" onclick="showTab('eval')">Evaluation</button>
  </div>

  <div id="tab-logs">
    <div class="toolbar">
      <button class="refresh-btn" onclick="load()">Atualizar</button>
      <span style="font-size:12px;color:#999" id="log-count"></span>
    </div>
    <div style="overflow-x:auto">
      <table class="log-table">
        <thead><tr>
          <th>#</th><th>Hora</th><th>Sessão</th><th>Mensagem</th><th>Resposta</th><th>Latência</th><th>Eval</th>
        </tr></thead>
        <tbody id="log-body"></tbody>
      </table>
    </div>
    <div id="log-empty" class="empty" style="display:none">Nenhuma mensagem registrada ainda. Use o chat para gerar logs.</div>
  </div>

  <div id="tab-eval" style="display:none">
    <p class="section-title">Prompts de avaliação</p>
    <p style="font-size:12px;color:#777;margin-bottom:12px">Clique para enviar o prompt ao chatbot e avaliar a resposta automaticamente.</p>
    <div id="eval-prompts" class="eval-prompts"></div>

    <p class="section-title">Resultados</p>
    <div id="eval-results"></div>
    <div id="eval-empty" class="empty" style="display:none">Nenhuma avaliação realizada. Envie um prompt acima ou use o chat com uma das 3 perguntas-chave.</div>
  </div>
</div>

<script>
let allLogs = [];

function showTab(tab) {
  document.getElementById('tab-logs').style.display = tab === 'logs' ? '' : 'none';
  document.getElementById('tab-eval').style.display = tab === 'eval' ? '' : 'none';
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.textContent.toLowerCase().includes(tab)));
}

async function load() {
  const [stats, logs, prompts] = await Promise.all([
    fetch('/api/admin/stats').then(r => r.json()),
    fetch('/api/admin/logs').then(r => r.json()),
    fetch('/api/admin/eval-prompts').then(r => r.json()),
  ]);
  allLogs = logs;
  renderStats(stats);
  renderLogs(logs);
  renderEvalPrompts(prompts);
  renderEvalResults(logs.filter(l => l.eval));
}

function renderStats(s) {
  document.getElementById('stats').innerHTML = [
    { label: 'Total mensagens', value: s.total, cls: '' },
    { label: 'Sessões', value: s.sessions, cls: '' },
    { label: 'Latência média', value: s.avgLatency + 'ms', cls: 'teal' },
    { label: 'Erros', value: s.errors, cls: s.errors > 0 ? 'red' : '' },
    { label: 'Evals executados', value: s.evals, cls: '' },
    { label: 'Evals aprovados', value: s.passed, cls: 'green' },
    { label: 'Evals reprovados', value: s.failed, cls: s.failed > 0 ? 'red' : '' },
  ].map(c => '<div class="stat-card"><div class="label">' + c.label + '</div><div class="value ' + c.cls + '">' + c.value + '</div></div>').join('');
}

function renderLogs(logs) {
  const body = document.getElementById('log-body');
  const empty = document.getElementById('log-empty');
  document.getElementById('log-count').textContent = logs.length + ' registros';
  if (!logs.length) { body.innerHTML = ''; empty.style.display = ''; return; }
  empty.style.display = 'none';
  body.innerHTML = logs.map(l => {
    const time = new Date(l.timestamp).toLocaleTimeString('pt-BR');
    const sid = l.sessionId.slice(-8);
    const evalBadge = l.eval
      ? '<span class="badge ' + (l.eval.pass ? 'pass' : 'fail') + '">' + l.eval.score + '/' + l.eval.maxScore + '</span>'
      : (l.error ? '<span class="badge fail">ERR</span>' : '—');
    return '<tr>' +
      '<td class="mono">' + l.id + '</td>' +
      '<td class="mono">' + time + '</td>' +
      '<td class="mono" title="' + esc(l.sessionId) + '">' + sid + '</td>' +
      '<td class="msg-cell">' + esc(l.message) + '</td>' +
      '<td class="msg-cell">' + esc(l.reply.slice(0, 200)) + '</td>' +
      '<td class="mono">' + (l.latencyMs / 1000).toFixed(1) + 's</td>' +
      '<td>' + evalBadge + '</td>' +
      '</tr>';
  }).join('');
}

function renderEvalPrompts(prompts) {
  document.getElementById('eval-prompts').innerHTML = prompts.map(ep =>
    '<button class="eval-prompt-btn" id="ep-' + ep.id + '" onclick="runEval(\\'' + ep.id + '\\',\\'' + esc(ep.prompt) + '\\')">' +
    '<div class="ep-label">' + esc(ep.label) + '</div>' +
    '<div class="ep-prompt">\\"' + esc(ep.prompt) + '\\"</div>' +
    '</button>'
  ).join('');
}

function renderEvalResults(evalLogs) {
  const container = document.getElementById('eval-results');
  const empty = document.getElementById('eval-empty');
  if (!evalLogs.length) { container.innerHTML = ''; empty.style.display = ''; return; }
  empty.style.display = 'none';
  container.innerHTML = evalLogs.map(l => {
    const e = l.eval;
    return '<div class="eval-card">' +
      '<div class="eval-header">' +
        '<div class="eval-title">' + esc(e.promptLabel) + '</div>' +
        '<div><span class="badge ' + (e.pass ? 'pass' : 'fail') + '">' + (e.pass ? 'PASS' : 'FAIL') + '</span> ' +
        '<span class="eval-score">' + e.score + '/' + e.maxScore + '</span></div>' +
      '</div>' +
      e.checks.map(c =>
        '<div class="check-row">' +
          '<span class="check-icon ' + (c.found ? 'ok' : 'miss') + '">' + (c.found ? '✓' : '✗') + '</span>' +
          '<div><div>' + esc(c.label) + ' <span style="color:#aaa">(' + esc(c.expected) + ')</span></div>' +
          (c.evidence ? '<div class="evidence">"…' + esc(c.evidence) + '…"</div>' : '') +
          '</div></div>'
      ).join('') +
      '<div style="margin-top:8px;font-size:11px;color:#aaa">Latência: ' + (l.latencyMs/1000).toFixed(1) + 's · ' + new Date(l.timestamp).toLocaleTimeString('pt-BR') + '</div>' +
    '</div>';
  }).join('');
}

async function runEval(id, prompt) {
  const btn = document.getElementById('ep-' + id);
  btn.classList.add('running');
  btn.innerHTML = '<div class="ep-label">Executando…</div><div class="ep-prompt">Aguardando resposta do Ollama…</div>';
  try {
    await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: prompt, sessionId: 'eval-' + id + '-' + Date.now() }),
    });
    await load();
  } catch (e) {
    btn.innerHTML = '<div class="ep-label" style="color:#DC2626">Erro: ' + e.message + '</div>';
  }
  btn.classList.remove('running');
}

function esc(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

load();
setInterval(load, 15000);
</script>
</body>
</html>`;

export default router;
