import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  ChevronDown,
  ChevronUp,
  Clock,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { api, type EmailThreadDto } from '../services/api';

export default function EmailThreads() {
  const [threads, setThreads] = useState<EmailThreadDto[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(1); // Default open Vendor List thread

  useEffect(() => {
    loadThreads();
  }, []);

  const loadThreads = async () => {
    try {
      const data = await api.getEmailThreads();
      setThreads(data);
    } catch (e) {
      console.error('Failed to load email threads:', e);
    }
  };

  const toggleThread = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getStatusBadge = (waitingOn: string) => {
    if (waitingOn.toLowerCase().includes('arjun') && !waitingOn.toLowerCase().includes('review')) {
      return (
        <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-red-500/15 text-red-400 border border-red-500/30 flex items-center gap-1">
          <Clock className="w-3 h-3" /> Waiting on Arjun
        </span>
      );
    }
    if (waitingOn.toLowerCase().includes('unassigned')) {
      return (
        <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" /> Unassigned Risk
        </span>
      );
    }
    if (waitingOn.toLowerCase().includes('review')) {
      return (
        <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-blue-500/15 text-blue-400 border border-blue-500/30 flex items-center gap-1">
          <Clock className="w-3 h-3" /> Arjun Review Pending
        </span>
      );
    }
    return (
      <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
        <CheckCircle2 className="w-3 h-3" /> {waitingOn}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="p-5 rounded-2xl bg-[var(--color-surface-1)] border border-[var(--color-border-primary)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white">Email Intelligence (25 Messages • 5 Threads)</h2>
          <p className="text-xs text-[var(--color-text-2)] mt-0.5">
            Cross-referenced communication trails from Raghav, Neha, Divya, Priya, and Facilities.
          </p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[var(--color-surface-2)] text-[var(--color-text-2)] border border-[var(--color-border-primary)]">
          5 Verified Scenarios
        </span>
      </div>

      {/* Threads List */}
      <div className="space-y-4">
        {threads.map((thread) => {
          const isExpanded = expandedId === thread.id;

          return (
            <div
              key={thread.id}
              className="rounded-2xl bg-[var(--color-surface-1)] border border-[var(--color-border-primary)] overflow-hidden transition-all shadow-sm"
            >
              {/* Thread Header Banner */}
              <div
                onClick={() => toggleThread(thread.id)}
                className="p-5 sm:p-6 cursor-pointer hover:bg-[var(--color-hover)]/40 transition-colors flex items-start justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border-primary)] text-[var(--color-brand-light)]">
                      <Mail className="w-4 h-4" />
                    </div>
                    <h3 className="text-base font-bold text-white">
                      {thread.subject}
                    </h3>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[var(--color-surface-3)] text-[var(--color-text-2)] border border-[var(--color-border-primary)]">
                      {thread.category}
                    </span>
                    {getStatusBadge(thread.waitingOn)}
                  </div>

                  <p className="text-xs sm:text-sm text-[var(--color-text-2)] leading-relaxed">
                    {thread.statusSummary}
                  </p>
                </div>

                <button className="p-2 text-[var(--color-text-3)] hover:text-white shrink-0">
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </div>

              {/* Message Timeline */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-[var(--color-border-primary)] p-5 sm:p-6 bg-[var(--color-surface-2)]/30 space-y-4"
                  >
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-3)] mb-2">
                      Full Message Trail ({thread.messages?.length || 0} messages)
                    </p>

                    <div className="space-y-3">
                      {thread.messages?.map((msg, idx) => {
                        const isFromArjun = msg.sender?.name === 'Arjun Malhotra' || msg.senderRaw?.includes('Arjun');

                        return (
                          <div
                            key={msg.id || idx}
                            className={`p-4 rounded-xl border transition-all ${
                              isFromArjun
                                ? 'bg-gradient-to-r from-[var(--color-brand)]/10 to-transparent border-[var(--color-brand)]/30 ml-4 sm:ml-8'
                                : 'bg-[var(--color-surface-2)] border-[var(--color-border-primary)] mr-4 sm:mr-8'
                            }`}
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                              <div className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-[var(--color-surface-4)] text-[10px] font-bold flex items-center justify-center text-[var(--color-text-2)]">
                                  {msg.sequenceNumber}
                                </span>
                                <span className="text-xs font-bold text-white">
                                  {msg.sender?.name || msg.senderRaw}
                                </span>
                                {isFromArjun && (
                                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[var(--color-brand)]/20 text-[var(--color-brand-light)]">
                                    You
                                  </span>
                                )}
                                <span className="text-[11px] text-[var(--color-text-3)]">
                                  to {msg.recipient}
                                </span>
                              </div>

                              <span className="text-[11px] font-semibold text-[var(--color-text-3)]">
                                {msg.timestamp}
                              </span>
                            </div>

                            <p className="text-xs sm:text-sm text-[var(--color-text-1)] italic leading-relaxed pl-7">
                              "{msg.body}"
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
