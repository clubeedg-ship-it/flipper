import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

interface ChatPanelProps {
  onClose: () => void;
}

function LoadingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="block rounded-full"
          style={{ width: 7, height: 7, background: 'var(--text-tertiary)' }}
          animate={{ y: [0, -5, 0] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.15,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

function getOrCreateSessionId(): string {
  const key = 'flipper-chat-session';
  const existing = sessionStorage.getItem(key);
  if (existing) return existing;
  const id = `sess-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  sessionStorage.setItem(key, id);
  return id;
}

const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  role: 'assistant',
  text: 'Olá! Sou o assistente do Flipper. Pergunte sobre vendas, repasses, marcas parceiras ou qualquer dado do painel.',
};

export default function ChatPanel({ onClose }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sessionId = useRef<string>(getOrCreateSessionId());

  // Auto-scroll to bottom when messages change or loading state changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Focus input when panel opens
  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 150);
    return () => clearTimeout(timer);
  }, []);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: 'user',
      text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, sessionId: sessionId.current }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as { reply: string; sessionId: string };

      const assistantMsg: Message = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        text: data.reply,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        text: 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  }, [input, loading]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void sendMessage();
    }
  };

  return (
    <div
      className="chat-panel flex flex-col overflow-hidden h-full"
      role="dialog"
      aria-label="Assistente Flipper"
      aria-modal="false"
      style={{
        background: 'var(--bg-content)',
        borderRadius: 'var(--radius-xl)',
        backdropFilter: 'blur(var(--blur))',
        WebkitBackdropFilter: 'blur(var(--blur))',
        border: '1px solid var(--border-glass)',
        boxShadow: 'var(--shadow-glass)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 shrink-0"
        style={{
          height: 56,
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
            style={{ background: 'var(--accent)' }}
            aria-hidden="true"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div>
            <p className="font-subheading" style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.2 }}>
              Assistente Flipper
            </p>
            <p className="font-caption" style={{ color: 'var(--text-tertiary)' }}>
              Suporte ao painel
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer border-none"
          style={{ background: 'rgba(0,0,0,0.04)', color: 'var(--text-tertiary)' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.08)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.04)'; }}
          aria-label="Fechar chat"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Message list */}
      <div
        className="flex-1 overflow-y-auto px-4 py-3"
        style={{ minHeight: 0 }}
        role="log"
        aria-live="polite"
        aria-label="Mensagens do chat"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex mb-3"
              style={{ justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}
            >
              <div
                className="font-body"
                style={{
                  maxWidth: '82%',
                  fontSize: 13,
                  lineHeight: 1.55,
                  borderRadius: msg.role === 'user'
                    ? '14px 14px 4px 14px'
                    : '14px 14px 14px 4px',
                  padding: '8px 12px',
                  background: msg.role === 'user'
                    ? 'var(--accent)'
                    : 'rgba(0,0,0,0.05)',
                  color: msg.role === 'user'
                    ? 'white'
                    : 'var(--text-primary)',
                  wordBreak: 'break-word',
                }}
              >
                {msg.role === 'assistant' ? (
                  <div className="markdown-content">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.text}
                    </ReactMarkdown>
                  </div>
                ) : (
                  msg.text
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading indicator */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex mb-3"
              style={{ justifyContent: 'flex-start' }}
              aria-label="Aguardando resposta"
            >
              <div
                style={{
                  borderRadius: '14px 14px 14px 4px',
                  background: 'rgba(0,0,0,0.05)',
                }}
              >
                <LoadingDots />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div
        className="px-3 pb-3 pt-2 shrink-0"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        <div
          className="flex items-center gap-2 rounded-xl px-3 py-2"
          style={{
            background: 'rgba(0,0,0,0.04)',
            border: '1px solid var(--border)',
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Pergunte ao assistente…"
            disabled={loading}
            className="flex-1 border-none outline-none font-body bg-transparent"
            style={{
              fontSize: 13,
              color: 'var(--text-primary)',
              minWidth: 0,
            }}
            aria-label="Digite sua mensagem"
            aria-disabled={loading}
          />
          <button
            onClick={() => { void sendMessage(); }}
            disabled={loading || !input.trim()}
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors cursor-pointer border-none"
            style={{
              background: loading || !input.trim() ? 'rgba(0,0,0,0.08)' : 'var(--accent)',
              color: loading || !input.trim() ? 'var(--text-tertiary)' : 'white',
            }}
            aria-label="Enviar mensagem"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
