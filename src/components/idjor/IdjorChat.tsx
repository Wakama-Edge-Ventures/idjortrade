"use client";

import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';
import Link from 'next/link';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

/** Renders basic markdown bold (**text**) into React nodes */
function renderMarkdown(text: string): React.ReactNode[] {
  return text.split('\n').map((line, i, arr) => {
    const parts: React.ReactNode[] = [];
    const regex = /\*\*(.+?)\*\*/g;
    let last = 0;
    let match;
    while ((match = regex.exec(line)) !== null) {
      if (match.index > last) parts.push(line.slice(last, match.index));
      parts.push(<strong key={match.index} className="font-bold text-white">{match[1]}</strong>);
      last = match.index + match[0].length;
    }
    if (last < line.length) parts.push(line.slice(last));
    return (
      <span key={i}>
        {parts.length > 0 ? parts : line}
        {i < arr.length - 1 && <br />}
      </span>
    );
  });
}

interface QuotaInfo {
  used: number;
  limit: number;
}

interface IdjorChatProps {
  initialMessages: Message[];
  quickPrompts: string[];
}

export default function IdjorChat({ initialMessages, quickPrompts }: IdjorChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [quotaInfo, setQuotaInfo] = useState<QuotaInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Track whether history has been loaded to avoid showing welcome msg if history exists
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load message history from the API on mount
  useEffect(() => {
    fetch('/api/idjor/history')
      .then((r) => r.json())
      .then((history: Array<{ id: string; role: string; content: string }>) => {
        if (history.length > 0) {
          setMessages(
            history.map((m) => ({
              id: m.id,
              role: m.role as 'user' | 'assistant',
              content: m.content,
            }))
          );
        }
        setHistoryLoaded(true);
      })
      .catch(() => setHistoryLoaded(true));
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  async function sendMessage(content: string) {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    setError(null);

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      let userProfile = null;
      try {
        const stored = localStorage.getItem('idjor_profile');
        if (stored) userProfile = JSON.parse(stored);
      } catch { /* ignore */ }

      const res = await fetch('/api/idjor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          userProfile,
        }),
      });

      if (res.status === 429) {
        const data = await res.json() as { error: string; quotaInfo?: QuotaInfo };
        setError(data.error);
        if (data.quotaInfo) setQuotaInfo(data.quotaInfo);
        return;
      }

      if (!res.ok) throw new Error('Erreur API');

      const data = await res.json() as { content: string; quotaInfo?: QuotaInfo };

      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: 'assistant', content: data.content },
      ]);

      if (data.quotaInfo) setQuotaInfo(data.quotaInfo);
    } catch {
      setError('Erreur de connexion. Réessaie.');
    } finally {
      setIsLoading(false);
    }
  }

  function handleSend() {
    sendMessage(input);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  // Quota bar rendering
  const showQuota = quotaInfo && quotaInfo.limit !== Infinity && quotaInfo.limit < 9999;
  const quotaPct = showQuota ? Math.min((quotaInfo.used / quotaInfo.limit) * 100, 100) : 0;
  const quotaColor = quotaPct >= 100 ? '#FF3B5C' : quotaPct >= 80 ? '#F5A623' : '#00FF88';
  const quotaReached = !!(showQuota && quotaInfo && quotaInfo.used >= quotaInfo.limit);

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Show skeleton while loading history */}
        {!historyLoaded && (
          <div className="flex justify-center py-4">
            <span className="text-xs" style={{ color: 'var(--on-surface-dim)' }}>Chargement de l'historique…</span>
          </div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' ? (
              <div className="max-w-[85%] space-y-2">
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #F5A623, #E8940F)' }}
                  >
                    <Sparkles size={12} color="white" />
                  </div>
                  <span className="text-xs font-semibold" style={{ color: '#F5A623' }}>Idjor</span>
                </div>
                <div
                  className="px-4 py-3 text-sm leading-relaxed"
                  style={{
                    background: 'linear-gradient(135deg, #2A1F0A, #141928)',
                    border: '1px solid rgba(245,166,35,0.2)',
                    borderRadius: '12px 12px 12px 2px',
                    color: 'var(--on-surface)',
                  }}
                >
                  {renderMarkdown(msg.content)}
                </div>
              </div>
            ) : (
              <div
                className="max-w-[80%] px-4 py-3 text-sm leading-relaxed"
                style={{
                  background: 'linear-gradient(135deg, #1A2F1E, #141928)',
                  border: '1px solid rgba(0,255,136,0.15)',
                  borderRadius: '12px 12px 2px 12px',
                  color: 'var(--on-surface)',
                }}
              >
                {msg.content}
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[85%] space-y-2">
              <div className="flex items-center gap-1.5">
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #F5A623, #E8940F)' }}
                >
                  <Sparkles size={12} color="white" />
                </div>
                <span className="text-xs font-semibold" style={{ color: '#F5A623' }}>Idjor</span>
              </div>
              <div
                className="px-4 py-3 flex items-center gap-1.5"
                style={{
                  background: 'linear-gradient(135deg, #2A1F0A, #141928)',
                  border: '1px solid rgba(245,166,35,0.2)',
                  borderRadius: '12px 12px 12px 2px',
                }}
              >
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-2 h-2 rounded-full inline-block"
                    style={{
                      background: '#F5A623',
                      animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick prompts */}
      <div className="px-4 pb-2 flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden">
        {quickPrompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => sendMessage(prompt)}
            disabled={isLoading}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
            style={{
              background: 'var(--surface-highest)',
              color: 'var(--on-surface-dim)',
              border: '1px solid var(--outline)',
              opacity: isLoading ? 0.5 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer',
            }}
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Quota bar */}
      {showQuota && (
        <div className="px-4 pb-2 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs" style={{ color: 'var(--on-surface-dim)' }}>
              {quotaInfo.used}/{quotaInfo.limit === Infinity ? '∞' : quotaInfo.limit} messages aujourd&apos;hui
            </span>
            {quotaReached && (
              <Link href="/plans" className="text-xs font-semibold" style={{ color: '#00FF88' }}>
                Passer à Pro →
              </Link>
            )}
          </div>
          <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--surface-highest)' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${quotaPct}%`, background: quotaColor }}
            />
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="px-4 pb-2">
          <p
            className="text-xs font-semibold px-3 py-2 rounded-xl"
            style={{
              background: 'rgba(255,59,92,0.08)',
              color: '#FF3B5C',
              border: '1px solid rgba(255,59,92,0.2)',
            }}
          >
            {error}
          </p>
        </div>
      )}

      {/* Input bar */}
      <div
        className="flex items-end gap-2 p-3 border-t"
        style={{ borderColor: 'rgba(255,255,255,0.05)' }}
      >
        <textarea
          ref={textareaRef}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading || quotaReached}
          placeholder={quotaReached ? 'Quota atteint — passez à Pro' : 'Pose ta question en français…'}
          className="flex-1 resize-none rounded-xl px-3 py-2.5 text-sm outline-none transition-colors"
          style={{
            background: 'var(--surface-highest)',
            border: '1px solid var(--outline)',
            color: 'var(--on-surface)',
            maxHeight: '120px',
            opacity: quotaReached ? 0.5 : 1,
            cursor: quotaReached ? 'not-allowed' : 'text',
          }}
          onInput={(e) => {
            const t = e.currentTarget;
            t.style.height = 'auto';
            t.style.height = Math.min(t.scrollHeight, 120) + 'px';
          }}
          onFocus={(e) => { if (!quotaReached) e.currentTarget.style.borderColor = 'rgba(245,166,35,0.4)'; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--outline)'; }}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isLoading || quotaReached}
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
          style={{
            background: input.trim() && !isLoading && !quotaReached ? '#F5A623' : 'var(--surface-highest)',
            color: input.trim() && !isLoading && !quotaReached ? '#0A0E1A' : 'var(--on-surface-dim)',
          }}
        >
          <Send size={16} />
        </button>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}
