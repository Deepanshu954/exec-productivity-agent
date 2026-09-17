import { useState, useRef, useEffect } from 'react';
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
  RotateCcw,
  Check,
  Copy,
  Info
} from 'lucide-react';
import { api, type AiQueryResponse } from '../services/api';

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  response?: AiQueryResponse;
  timestamp: string;
}

const suggestedPrompts = [
  'What needs my attention today?',
  'What am I late on?',
  'What commitments of mine are still pending?',
  'Why is the Mumbai lease renewal considered critical?',
  'What did I promise Raghav?',
  'What changed regarding the campaign deck?',
  'What do I need to prepare before board prep?',
  'Show me everything related to Meridian Logistics',
  'Who is waiting on me?',
  'Which commitments were completed?',
  'Summarize the important updates from my emails',
  'What meetings do I have today?',
];

export default function AiAssistant({ initialQuery }: { initialQuery?: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'agent',
      text: "Hello Arjun. I am your executive productivity agent, grounded in your week's meetings, emails, voice notes, and team schedules (21–25 September 2026).\n\nAsk me anything about your commitments, schedule, team deliverables, or urgent risks.",
      timestamp: 'Now',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [expandedSources, setExpandedSources] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    if (initialQuery) {
      handleSend(initialQuery);
    }
  }, [initialQuery]);

  const handleSend = async (queryToSend?: string) => {
    const query = (queryToSend || input).trim();
    if (!query || loading) return;

    const userMsgId = 'user-' + Date.now();
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await api.queryAi(query);
      const agentMsg: ChatMessage = {
        id: 'agent-' + Date.now(),
        sender: 'agent',
        text: response.answer,
        response: response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, agentMsg]);
      // Auto-expand sources for informative visibility
      setExpandedSources((prev) => ({ ...prev, [agentMsg.id]: true }));
    } catch (e) {
      const errorMsg: ChatMessage = {
        id: 'error-' + Date.now(),
        sender: 'agent',
        text: "I couldn't process that query right now. Please try again or check the backend connection.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const toggleSources = (id: string) => {
    setExpandedSources((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'agent',
        text: "Chat cleared. What would you like to review next?",
        timestamp: 'Now',
      },
    ]);
  };

  const renderSourceIcon = (docType: string) => {
    switch (docType) {
      case 'EMAIL':
        return <Mail className="w-3.5 h-3.5 text-blue-400" />;
      case 'VOICE_NOTE':
        return <Mic className="w-3.5 h-3.5 text-amber-400" />;
      case 'CALENDAR':
        return <Calendar className="w-3.5 h-3.5 text-emerald-400" />;
      case 'MEETING':
      default:
        return <FileText className="w-3.5 h-3.5 text-purple-400" />;
    }
  };

  return (
    <div className="flex flex-col h-[740px] max-h-[85vh] rounded-2xl border border-[var(--color-border-primary)] bg-[var(--color-surface-1)] shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border-primary)] bg-[var(--color-surface-2)]/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[var(--color-brand)] via-purple-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-[var(--color-brand)]/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[var(--color-text-0)]">
                AI Executive Assistant
              </h2>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <ShieldCheck className="w-3 h-3" /> Grounded Truth
              </span>
            </div>
            <p className="text-[12px] text-[var(--color-text-2)]">
              Real-time reasoning over Veridian Corp assignment data
            </p>
          </div>
        </div>

        <button
          onClick={clearChat}
          title="Reset conversation"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--color-text-3)] hover:text-[var(--color-text-1)] hover:bg-[var(--color-hover)] transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-6 py-3 border-b border-[var(--color-border-primary)] bg-[var(--color-surface-1)]">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-3)] mb-2">
          Suggested Executive Queries
        </p>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-zinc-700">
          {suggestedPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              disabled={loading}
              className="shrink-0 text-xs px-3 py-1.5 rounded-full bg-[var(--color-surface-3)] hover:bg-[var(--color-surface-4)] text-[var(--color-text-1)] hover:text-white border border-[var(--color-border-primary)] transition-all text-left"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            {/* Sender Label */}
            <div className="flex items-center gap-2 mb-1.5 px-1">
              <span className="text-[11px] font-semibold text-[var(--color-text-3)]">
                {msg.sender === 'user' ? 'You (Arjun Malhotra)' : 'Executive Agent'}
              </span>
              <span className="text-[10px] text-[var(--color-text-3)] opacity-60">
                {msg.timestamp}
              </span>
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[85%] rounded-2xl px-5 py-4 text-[14px] leading-relaxed shadow-md ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-[var(--color-brand)] to-purple-600 text-white rounded-tr-sm'
                  : 'bg-[var(--color-surface-2)] text-[var(--color-text-0)] border border-[var(--color-border-primary)] rounded-tl-sm'
              }`}
            >
              {/* Message Text with simple formatting */}
              <div className="whitespace-pre-wrap">
                {msg.text.split('\n').map((line, lIdx) => {
                  if (line.startsWith('• ') || line.startsWith('- ')) {
                    return (
                      <div key={lIdx} className="flex items-start gap-2 my-1">
                        <span className="text-[var(--color-brand-light)] font-bold">•</span>
                        <span>{line.substring(2)}</span>
                      </div>
                    );
                  }
                  return <p key={lIdx} className={lIdx > 0 ? 'mt-2' : ''}>{line}</p>;
                })}
              </div>

              {/* Referenced Entities */}
              {msg.response?.entities && msg.response.entities.length > 0 && (
                <div className="mt-4 pt-3 border-t border-[var(--color-border-primary)]">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-3)] mb-1.5 flex items-center gap-1">
                    <Info className="w-3 h-3" /> Referenced Commitments
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.response.entities.map((ent) => (
                      <span
                        key={ent.id}
                        className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-md border ${
                          ent.status === 'OVERDUE'
                            ? 'bg-red-500/10 border-red-500/30 text-red-400'
                            : ent.status === 'AT_RISK'
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                            : ent.status === 'RESOLVED' || ent.status === 'COMPLETED'
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        <span className="font-semibold">{ent.title}</span>
                        <span className="opacity-75 text-[10px]">({ent.status})</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Grounded Evidence & Sources Accordion */}
              {msg.response?.sources && msg.response.sources.length > 0 && (
                <div className="mt-3 pt-3 border-t border-[var(--color-border-primary)]">
                  <button
                    onClick={() => toggleSources(msg.id)}
                    className="flex items-center justify-between w-full text-[12px] font-semibold text-[var(--color-brand-light)] hover:text-white transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      Supporting Evidence ({msg.response.sources.length} sources)
                    </span>
                    {expandedSources[msg.id] ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>

                  <AnimatePresence>
                    {expandedSources[msg.id] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mt-2.5 space-y-2 overflow-hidden"
                      >
                        {msg.response.sources.map((src, sIdx) => (
                          <div
                            key={sIdx}
                            className="p-2.5 rounded-xl bg-[var(--color-surface-3)]/60 border border-[var(--color-border-primary)] text-xs text-[var(--color-text-2)]"
                          >
                            <div className="flex items-center gap-1.5 font-medium text-[var(--color-text-0)] mb-1">
                              {renderSourceIcon(src.documentType)}
                              <span>{src.title}</span>
                              {src.timestamp && (
                                <span className="ml-auto text-[10px] text-[var(--color-text-3)]">
                                  {src.timestamp}
                                </span>
                              )}
                            </div>
                            <p className="italic text-[var(--color-text-1)] pl-5">
                              "{src.excerpt}"
                            </p>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Footer info: provider & copy */}
              {msg.sender === 'agent' && (
                <div className="mt-3 pt-2 flex items-center justify-between text-[10px] text-[var(--color-text-3)] border-t border-[var(--color-border-primary)]/50">
                  <span>Engine: {msg.response?.provider || 'Grounded Veridian Engine'}</span>
                  <button
                    onClick={() => handleCopy(msg.id, msg.text)}
                    className="flex items-center gap-1 hover:text-[var(--color-text-1)] transition-colors"
                  >
                    {copiedId === msg.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 p-4 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border-primary)] text-xs text-[var(--color-text-2)] w-fit"
          >
            <Loader2 className="w-4 h-4 text-[var(--color-brand)] animate-spin" />
            <span>Reasoning across meetings, emails, calendars, and voice notes...</span>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-4 border-t border-[var(--color-border-primary)] bg-[var(--color-surface-2)]/80 backdrop-blur-md">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Arjun's agent (e.g. 'What needs my attention today?')..."
            disabled={loading}
            className="flex-1 bg-[var(--color-surface-0)] border border-[var(--color-border-primary)] focus:border-[var(--color-brand)] text-sm rounded-xl px-4 py-3 text-[var(--color-text-0)] placeholder-[var(--color-text-3)] focus:outline-none transition-all"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-r from-[var(--color-brand)] to-purple-600 text-white disabled:opacity-40 hover:opacity-90 active:scale-95 transition-all shadow-md shadow-[var(--color-brand)]/20"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  );
}
