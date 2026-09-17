import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, CheckCircle2, AlertTriangle, AlertCircle, Clock, ArrowRight } from 'lucide-react';
import { emailThreadSummaries } from '../engine/emailSummary';
import { emailThreads } from '../data/emails';
import { getPersonName } from '../data/people';

export default function EmailThreads() {
  const [expandedThread, setExpandedThread] = useState<string | null>(null);

  const statusStyles: Record<string, { icon: typeof CheckCircle2; color: string; bg: string }> = {
    'resolved': { icon: CheckCircle2, color: 'text-[var(--color-success)]', bg: 'bg-[var(--color-success-subtle)]' },
    'pending': { icon: Clock, color: 'text-[var(--color-warning)]', bg: 'bg-[var(--color-warning-subtle)]' },
    'at-risk': { icon: AlertTriangle, color: 'text-[var(--color-error)]', bg: 'bg-[var(--color-error-subtle)]' },
    'escalating': { icon: AlertCircle, color: 'text-[var(--color-error)]', bg: 'bg-[var(--color-error-subtle)]' },
  };

  return (
    <div className="space-y-4">
      {emailThreadSummaries.map((summary, i) => {
        const isExpanded = expandedThread === summary.threadId;
        const thread = emailThreads.find(t => t.id === summary.threadId);
        const st = statusStyles[summary.status] || statusStyles['pending'];
        const StatusIcon = st.icon;

        return (
          <motion.div
            key={summary.threadId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-xl overflow-hidden hover:border-[var(--color-accent)]/20 transition-all"
          >
            {/* Thread Header */}
            <button
              onClick={() => setExpandedThread(isExpanded ? null : summary.threadId)}
              className="w-full flex items-start gap-4 p-5 text-left"
            >
              <div className={`p-2 rounded-lg ${st.bg} shrink-0`}>
                <StatusIcon className={`w-5 h-5 ${st.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-lg">{summary.icon}</span>
                  <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">{summary.subject}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${st.bg} ${st.color}`}>
                    {summary.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-[var(--color-text-secondary)] mt-1.5 leading-relaxed">
                  {summary.latestStatus}
                </p>
                <p className="text-xs text-[var(--color-text-muted)] mt-2">
                  <span className="font-medium">Waiting on:</span> {summary.waitingOn}
                </p>
              </div>
              <div className="shrink-0 text-[var(--color-text-muted)]">
                {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
            </button>

            {/* Expanded Detail */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 space-y-4 border-t border-[var(--color-border-subtle)] pt-4">
                    {/* Key Points */}
                    <div>
                      <h4 className="text-xs font-semibold text-[var(--color-text-muted)] uppercase mb-2">Key Points</h4>
                      <ul className="space-y-1.5">
                        {summary.keyPoints.map((point, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-[var(--color-text-secondary)]">
                            <ArrowRight className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[var(--color-accent)]" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Timeline */}
                    <div>
                      <h4 className="text-xs font-semibold text-[var(--color-text-muted)] uppercase mb-2">Timeline</h4>
                      <div className="space-y-2">
                        {summary.timeline.map((entry, j) => (
                          <div key={j} className="flex items-start gap-3">
                            <div className="flex flex-col items-center">
                              <div className="w-2 h-2 rounded-full bg-[var(--color-accent)] mt-1.5" />
                              {j < summary.timeline.length - 1 && (
                                <div className="w-px flex-1 bg-[var(--color-border)] min-h-[16px]" />
                              )}
                            </div>
                            <div className="pb-2">
                              <span className="text-[10px] font-medium text-[var(--color-text-muted)]">{entry.date}</span>
                              <p className="text-xs text-[var(--color-text-secondary)]">{entry.event}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Full Email Thread */}
                    {thread && (
                      <div>
                        <h4 className="text-xs font-semibold text-[var(--color-text-muted)] uppercase mb-2">Full Thread ({thread.emails.length} emails)</h4>
                        <div className="space-y-2">
                          {thread.emails.map(email => (
                            <div key={email.id} className="p-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border-subtle)]">
                              <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1">
                                <span className="text-xs font-semibold text-[var(--color-text-primary)]">
                                  {getPersonName(email.from)}
                                </span>
                                <span className="text-[10px] text-[var(--color-text-muted)]">
                                  {email.date} {email.time}
                                </span>
                              </div>
                              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                                {email.body}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
