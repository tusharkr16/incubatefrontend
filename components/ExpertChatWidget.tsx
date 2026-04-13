'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2, Sparkles, RotateCcw } from 'lucide-react';
import { clsx } from 'clsx';
import { matchResponse } from '@/lib/chat-knowledge';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  streaming?: boolean;
}

const SUGGESTED = [
  'Am I eligible for SISFS?',
  'What documents do I need for BIRAC BIG?',
  'How to apply for DPIIT recognition?',
  'Which grants suit an AgriTech startup?',
  'What is TIDE 2.0 and who can apply?',
  'How to prepare a Utilisation Certificate?',
];

const GREETING = "Hi! I'm **GrantsGPT**, your AI grant consultant for Indian government schemes.\n\nAsk me anything about eligibility, application steps, required documents, or which grants suit your startup — I'm here to help.";

/** Stream text char-by-char with a typewriter effect */
function useTypewriter() {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stream = useCallback(
    (
      fullText: string,
      onChunk: (partial: string) => void,
      onDone: () => void,
    ) => {
      let i = 0;
      // chunk size varies for more natural feel
      function tick() {
        if (i >= fullText.length) { onDone(); return; }
        const step = Math.floor(Math.random() * 4) + 2; // 2–5 chars per tick
        i = Math.min(i + step, fullText.length);
        onChunk(fullText.slice(0, i));
        timerRef.current = setTimeout(tick, 12 + Math.random() * 15);
      }
      tick();
    },
    [],
  );

  const cancel = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  return { stream, cancel };
}

/** Simple markdown-like renderer: bold (**text**), bullets, line breaks */
function RenderMarkdown({ text }: { text: string }) {
  const lines = text.split('\n');
  return (
    <div className="space-y-1 leading-relaxed">
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-1" />;

        // Render inline bold
        const rendered = line.split(/\*\*(.+?)\*\*/g).map((part, j) =>
          j % 2 === 1 ? <strong key={j} className="font-semibold">{part}</strong> : <span key={j}>{part}</span>,
        );

        // Detect list items
        if (/^[-•*]\s/.test(line.trimStart()) || /^\d+\.\s/.test(line.trimStart())) {
          return (
            <div key={i} className="flex gap-2">
              <span className="text-violet-400 flex-shrink-0 mt-0.5">
                {/^\d+\./.test(line.trimStart()) ? line.match(/^\d+\./)?.[0] : '•'}
              </span>
              <span>{rendered}</span>
            </div>
          );
        }

        // Detect headings (lines ending with **)
        if (line.startsWith('#')) {
          return <p key={i} className="font-bold text-slate-900 mt-2">{rendered}</p>;
        }

        return <p key={i}>{rendered}</p>;
      })}
    </div>
  );
}

export function ExpertChatWidget() {
  const [open, setOpen]         = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput]       = useState('');
  const [loading, setLoading]   = useState(false);
  const bottomRef               = useRef<HTMLDivElement>(null);
  const inputRef                = useRef<HTMLTextAreaElement>(null);
  const { stream, cancel }      = useTypewriter();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (open && messages.length === 0) {
      // Stream the greeting on first open
      setMessages([{ role: 'assistant', content: '', streaming: true }]);
      stream(
        GREETING,
        (partial) => setMessages([{ role: 'assistant', content: partial, streaming: true }]),
        () => setMessages([{ role: 'assistant', content: GREETING, streaming: false }]),
      );
    }
    if (open) setTimeout(() => inputRef.current?.focus(), 150);
    if (!open) cancel();
  }, [open]);

  function send(text: string) {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: 'user', content: text.trim() };
    const history = [...messages.filter((m) => !m.streaming), userMsg];

    setMessages([...history, { role: 'assistant', content: '', streaming: true }]);
    setInput('');
    setLoading(true);

    // Get answer from knowledge base
    const answer = matchResponse(text);

    // Small fake thinking delay, then stream the answer
    setTimeout(() => {
      stream(
        answer,
        (partial) =>
          setMessages((prev) => {
            const next = [...prev];
            next[next.length - 1] = { role: 'assistant', content: partial, streaming: true };
            return next;
          }),
        () => {
          setMessages((prev) => {
            const next = [...prev];
            next[next.length - 1] = { role: 'assistant', content: answer, streaming: false };
            return next;
          });
          setLoading(false);
        },
      );
    }, 400 + Math.random() * 300);
  }

  function reset() {
    cancel();
    setLoading(false);
    setInput('');
    setMessages([]);
    // Re-trigger greeting
    setTimeout(() => {
      setMessages([{ role: 'assistant', content: '', streaming: true }]);
      stream(
        GREETING,
        (partial) => setMessages([{ role: 'assistant', content: partial, streaming: true }]),
        () => setMessages([{ role: 'assistant', content: GREETING, streaming: false }]),
      );
    }, 50);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  const userMessages = messages.filter((m) => m.role === 'user');
  const showSuggested = userMessages.length === 0;

  return (
    <>
      {/* Floating trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={clsx(
          'fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-200',
          open
            ? 'bg-slate-800 hover:bg-slate-700'
            : 'bg-violet-600 hover:bg-violet-700 shadow-violet-500/40',
        )}
        aria-label="Toggle GrantsGPT"
      >
        {open ? <X size={20} className="text-white" /> : <MessageCircle size={22} className="text-white" />}
      </button>

      {/* Chat panel */}
      {open && (
        <div className={clsx(
          'fixed bottom-24 right-6 z-50 w-[400px] max-h-[600px] flex flex-col',
          'bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden',
        )}>
          {/* Header */}
          <div className="bg-gradient-to-r from-violet-600 to-violet-700 px-4 py-3.5 flex items-center gap-3 flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <Sparkles size={17} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm leading-none">GrantsGPT</p>
              <p className="text-violet-200 text-xs mt-0.5">AI Grant Consultant · IncubatX</p>
            </div>
            <button
              onClick={reset}
              title="New conversation"
              className="text-white/60 hover:text-white transition-colors mr-1"
            >
              <RotateCcw size={15} />
            </button>
            <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0"
            style={{ maxHeight: 430 }}
          >
            {messages.map((msg, i) => (
              <div key={i} className={clsx('flex gap-2.5', msg.role === 'user' ? 'flex-row-reverse' : 'flex-row')}>
                {/* Avatar */}
                <div className={clsx(
                  'w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5',
                  msg.role === 'assistant' ? 'bg-violet-100 text-violet-600' : 'bg-slate-200 text-slate-600',
                )}>
                  {msg.role === 'assistant' ? <Bot size={14} /> : <User size={14} />}
                </div>

                {/* Bubble */}
                <div className={clsx(
                  'max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm',
                  msg.role === 'user'
                    ? 'bg-violet-600 text-white rounded-tr-sm'
                    : 'bg-slate-50 text-slate-800 rounded-tl-sm border border-slate-100',
                )}>
                  {msg.content
                    ? (msg.role === 'assistant'
                      ? <RenderMarkdown text={msg.content} />
                      : <p className="leading-relaxed">{msg.content}</p>)
                    : (msg.streaming && (
                      <span className="flex items-center gap-1.5 text-slate-400">
                        <Loader2 size={12} className="animate-spin" /> Thinking…
                      </span>
                    ))}
                  {msg.streaming && msg.content && (
                    <span className="inline-block w-0.5 h-4 bg-violet-400 animate-pulse ml-0.5 align-middle rounded-sm" />
                  )}
                </div>
              </div>
            ))}

            {/* Suggested prompts */}
            {showSuggested && !loading && (
              <div className="space-y-2 pt-1">
                <p className="text-xs text-slate-400 font-medium">Try asking:</p>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="text-xs bg-violet-50 text-violet-700 border border-violet-200 rounded-full px-2.5 py-1 hover:bg-violet-100 transition-colors text-left"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input area */}
          <div className="px-3 pb-3 pt-2 border-t border-slate-100 flex gap-2 items-end flex-shrink-0">
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              placeholder="Ask about grants, eligibility, process…"
              className={clsx(
                'flex-1 resize-none text-sm border border-slate-200 rounded-xl px-3 py-2.5',
                'focus:outline-none focus:ring-2 focus:ring-violet-400 placeholder:text-slate-400',
                'disabled:bg-slate-50 disabled:text-slate-400 max-h-28 leading-relaxed',
              )}
              style={{ fieldSizing: 'content' } as any}
            />
            <button
              onClick={() => send(input)}
              disabled={loading || !input.trim()}
              className={clsx(
                'w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all',
                loading || !input.trim()
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-violet-600 hover:bg-violet-700 text-white shadow-sm',
              )}
            >
              {loading
                ? <Loader2 size={15} className="animate-spin" />
                : <Send size={15} />}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
