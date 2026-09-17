import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Send,
  Loader2,
  ChevronDown,
  ChevronUp,
  FileText,
  Mail,
  Mic,
  Calendar,
  ShieldCheck,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { api, type BriefingDto, type AiQueryResponse } from '../services/api';

const weekDays = [
  { day: 'Mon', date: '2026-09-21', label: 'Mon 21 Sep' },
  { day: 'Tue', date: '2026-09-22', label: 'Tue 22 Sep' },
  { day: 'Wed', date: '2026-09-23', label: 'Wed 23 Sep' },
  { day: 'Thu', date: '2026-09-24', label: 'Thu 24 Sep' },
  { day: 'Fri', date: '2026-09-25', label: 'Fri 25 Sep' },
];

const quickQueries = [
  'What needs my attention today?',
  'What am I late on?',
  'What did I promise Raghav?',
  'Why is the Mumbai lease renewal critical?',
  'What changed regarding the campaign deck?',
  'What do I need before board prep?',
  'Show me everything about Meridian Logistics',
  'Who is waiting on me?',
];

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  response?: AiQueryResponse;
  timestamp: string;
}

export default function DailyBriefingChat({ initialQuery }: { initialQuery?: string }) {
  const [selectedDayIdx, setSelectedDayIdx] = useState(2); // Wednesday default
  const [briefing, setBriefing] = useState<BriefingDto | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'agent',
      text: "Good day Arjun. I am your executive productivity agent, strictly grounded in Veridian Corp's week of 21–25 September 2026.\n\nAsk me any question regarding your commitments, schedule, team deliverables, or urgent risks.",
      timestamp: 'Now',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [expandedSources, setExpandedSources] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentDay = weekDays[selectedDayIdx];

  useEffect(() => {
    api.getBriefing(currentDay.date).then(setBriefing).catch(console.error);
  }, [selectedDayIdx]);

  useEffect(() => {
    if (initialQuery) {
      handleSend(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (queryText?: string) => {
    const q = (queryText || input).trim();
    if (!q || loading) return;

    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const resp = await api.queryAi(q, currentDay.date);
      const agentMsg: ChatMessage = {
        id: 'agent-' + Date.now(),
        sender: 'agent',
        text: resp.answer,
        response: resp,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, agentMsg]);
      setExpandedSources((prev) => ({ ...prev, [agentMsg.id]: true }));
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: 'error-' + Date.now(),
          sender: 'agent',
          text: "I encountered an issue querying the intelligence engine. Please retry.",
          timestamp: 'Now',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleSource = (id: string) => {
    setExpandedSources((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const renderSourceIcon = (docType: string) => {
    switch (docType) {
      case 'EMAIL':
        return <Mail className="w-3.5 h-3.5 text-blue-400" />;
      case 'VOICE_NOTE':
        return <Mic className="w-3.5 h-3.5 text-amber-400" />;
      case 'CALENDAR':
        return <Calendar className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-purple-400" />;
    }
  };

  return (
    <div className="w-full space-y-6 max-w-5xl mx-auto">
      {/* 1. Day Selector Strip (Minimal & Clean) */}
      <div className="flex items-center justify-between gap-2 p-1.5 rounded-2xl bg-[var(--color-surface-1)] border border-[var(--color-border-primary)] shadow-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full">
          {weekDays.map((d, idx) => (
            <button
              key={d.date}
              onClick={() => setSelectedDayIdx(idx)}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all whitespace-nowrap text-center ${
                idx === selectedDayIdx
                  ? 'bg-gradient-to-r from-[var(--color-brand)] to-purple-600 text-white shadow-md'
                  : 'text-[var(--color-text-2)] hover:text-white hover:bg-[var(--color-hover)]'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Executive Briefing Card (Clean & Focused) */}
      <div className="rounded-2xl border border-[var(--color-brand)]/25 bg-gradient-to-br from-[var(--color-brand)]/10 via-[var(--color-surface-1)] to-purple-950/20 p-6 sm:p-7 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[var(--color-brand)] to-purple-500 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-brand-light)]">
                Daily Intelligence
              </span>
              <h2 className="text-lg font-bold text-white leading-tight">
                {briefing?.dayLabel || currentDay.label}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/25">
              <AlertTriangle className="w-3 h-3" />
              {briefing?.criticalCount || 2} Critical Attention Items
            </span>
          </div>
        </div>

        <p className="text-sm text-[var(--color-text-1)] leading-relaxed mt-2">
          {briefing?.executiveSummary}
        </p>

        {/* 2 Focused Alert Pills */}
        <div className="mt-5 pt-4 border-t border-[var(--color-border-primary)]/60 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              <span className="text-red-200 font-semibold">Vendor List to Raghav (Overdue)</span>
            </div>
            <button
              onClick={() => handleSend('What did I promise Raghav?')}
              className="text-[11px] font-bold text-red-300 hover:text-white underline"
            >
              Details
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-amber-200 font-semibold">Mumbai Lease (Unassigned Friday EOD)</span>
            </div>
            <button
              onClick={() => handleSend('Why is the Mumbai lease renewal considered critical?')}
              className="text-[11px] font-bold text-amber-300 hover:text-white underline"
            >
              Details
            </button>
          </div>
        </div>
      </div>

      {/* 3. The Conversational AI Assistant (The Hero Experience) */}
      <div className="rounded-2xl border border-[var(--color-border-primary)] bg-[var(--color-surface-1)] shadow-xl overflow-hidden flex flex-col h-[560px]">
        {/* Chat Header */}
        <div className="px-5 py-3.5 border-b border-[var(--color-border-primary)] bg-[var(--color-surface-2)]/50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[var(--color-brand-light)]" />
            <span className="text-sm font-bold text-white">Ask Your Executive Agent</span>
            <span className="text-[11px] text-[var(--color-text-3)] ml-2 hidden sm:inline">
              Grounded in 21–25 Sep 2026 data
            </span>
          </div>

          <button
            onClick={() =>
              setMessages([
                {
                  id: 'welcome-reset',
                  sender: 'agent',
                  text: 'Conversation reset. How can I assist your executive planning?',
                  timestamp: 'Now',
                },
              ])
            }
            className="flex items-center gap-1 text-xs text-[var(--color-text-3)] hover:text-white"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear</span>
          </button>
        </div>

        {/* Quick Query Chips */}
        <div className="px-5 py-2.5 border-b border-[var(--color-border-primary)] bg-[var(--color-surface-1)] overflow-x-auto shrink-0 flex gap-2">
          {quickQueries.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              disabled={loading}
              className="shrink-0 text-xs px-3 py-1 rounded-full bg-[var(--color-surface-2)] hover:bg-[var(--color-surface-3)] text-[var(--color-text-2)] hover:text-white border border-[var(--color-border-primary)] transition-all"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-2 mb-1 px-1">
                <span className="text-[10px] font-semibold text-[var(--color-text-3)]">
                  {msg.sender === 'user' ? 'Arjun Malhotra' : 'Executive Agent'}
                </span>
                <span className="text-[9px] text-[var(--color-text-3)] opacity-60">
                  {msg.timestamp}
                </span>
              </div>

              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3.5 text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-[var(--color-brand)] to-purple-600 text-white rounded-tr-none'
                    : 'bg-[var(--color-surface-2)] text-[var(--color-text-0)] border border-[var(--color-border-primary)] rounded-tl-none shadow-sm'
                }`}
              >
                <div className="whitespace-pre-wrap">
                  {msg.text.split('\n').map((line, lIdx) => {
                    if (line.startsWith('• ') || line.startsWith('- ')) {
                      return (
                        <div key={lIdx} className="flex items-start gap-1.5 my-0.5">
                          <span className="text-[var(--color-brand-light)] font-bold">•</span>
                          <span>{line.substring(2)}</span>
                        </div>
                      );
                    }
                    return <p key={lIdx} className={lIdx > 0 ? 'mt-1.5' : ''}>{line}</p>;
                  })}
                </div>

                {/* Grounded Sources Accordion */}
                {msg.response?.sources && msg.response.sources.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-[var(--color-border-primary)]">
                    <button
                      onClick={() => toggleSource(msg.id)}
                      className="flex items-center justify-between w-full text-[11px] font-semibold text-[var(--color-brand-light)] hover:text-white"
                    >
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        Grounded Sources ({msg.response.sources.length})
                      </span>
                      {expandedSources[msg.id] ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <AnimatePresence>
                      {expandedSources[msg.id] && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-2 space-y-1.5 overflow-hidden"
                        >
                          {msg.response.sources.map((src, sIdx) => (
                            <div
                              key={sIdx}
                              className="p-2 rounded-lg bg-[var(--color-surface-3)]/60 border border-[var(--color-border-primary)] text-[11px] text-[var(--color-text-2)]"
                            >
                              <div className="flex items-center gap-1.5 font-medium text-[var(--color-text-1)]">
                                {renderSourceIcon(src.documentType)}
                                <span>{src.title}</span>
                              </div>
                              <p className="italic text-[var(--color-text-1)] mt-0.5 pl-4">
                                "{src.excerpt}"
                              </p>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Footer Info */}
                {msg.sender === 'agent' && (
                  <div className="mt-2.5 pt-1.5 flex items-center justify-between text-[10px] text-[var(--color-text-3)] border-t border-[var(--color-border-primary)]/40">
                    <span>{msg.response?.provider || 'Grounded Veridian Engine'}</span>
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="flex items-center gap-1 hover:text-white"
                    >
                      {copiedId === msg.id ? (
                        <span className="text-emerald-400 font-semibold">Copied</span>
                      ) : (
                        <span>Copy</span>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-[var(--color-surface-2)] text-xs text-[var(--color-text-2)] w-fit border border-[var(--color-border-primary)]">
              <Loader2 className="w-3.5 h-3.5 text-[var(--color-brand)] animate-spin" />
              <span>Synthesizing grounded facts...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 border-t border-[var(--color-border-primary)] bg-[var(--color-surface-2)]/60 flex items-center gap-2 shrink-0"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your executive agent..."
            disabled={loading}
            className="flex-1 bg-[var(--color-surface-0)] border border-[var(--color-border-primary)] focus:border-[var(--color-brand)] text-xs sm:text-sm rounded-xl px-4 py-2.5 text-white placeholder-[var(--color-text-3)] focus:outline-none transition-all"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="w-10 h-10 rounded-xl bg-gradient-to-r from-[var(--color-brand)] to-purple-600 text-white flex items-center justify-center disabled:opacity-40 hover:opacity-90 transition-all shadow-md shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
