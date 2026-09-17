import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, CheckCircle2, AlertTriangle, AlertCircle, Clock, ArrowRight } from 'lucide-react';
import { emailThreadSummaries } from '../engine/emailSummary';
import { emailThreads } from '../data/emails';
import { getPersonName } from '../data/people';

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const fadeUp = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

export default function EmailThreads() {
  const [expandedThread, setExpandedThread] = useState<string | null>(null);

  const statusStyles: Record<string, { icon: typeof CheckCircle2; color: string; glow: string; dot: string; pillBg: string }> = {
    'resolved': { icon: CheckCircle2, color: 'text-[var(--color-green)]', glow: 'var(--color-green-glow)', dot: 'glow-dot-green', pillBg: 'bg-[var(--color-green-glow)] text-[var(--color-green)]' },
    'pending': { icon: Clock, color: 'text-[var(--color-amber)]', glow: 'var(--color-amber-glow)', dot: 'glow-dot-amber', pillBg: 'bg-[var(--color-amber-glow)] text-[var(--color-amber)]' },
    'at-risk': { icon: AlertTriangle, color: 'text-[var(--color-red)]', glow: 'var(--color-red-glow)', dot: 'glow-dot-red', pillBg: 'bg-[var(--color-red-glow)] text-[var(--color-red)]' },
    'escalating': { icon: AlertCircle, color: 'text-[var(--color-red)]', glow: 'var(--color-red-glow)', dot: 'glow-dot-red', pillBg: 'bg-[var(--color-red-glow)] text-[var(--color-red)]' },
  };

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4">
      {emailThreadSummaries.map(summary => {
        const isExpanded = expandedThread === summary.threadId;
        const thread = emailThreads.find(t => t.id === summary.threadId);
        const st = statusStyles[summary.status] || statusStyles['pending'];
        const StatusIcon = st.icon;

        return (
          <motion.div
            key={summary.threadId}
            variants={fadeUp}
            className="card card-glow overflow-hidden"
          >
            <button
              onClick={() => setExpandedThread(isExpanded ? null : summary.threadId)}
              className="w-full flex items-start gap-4 p-5 sm:p-6 text-left group"
            >
              <div className="p-2.5 rounded-xl shrink-0" style={{ backgroundColor: st.glow }}>
                <StatusIcon className={`w-5 h-5 ${st.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap mb-1.5">
                  <span className="text-xl">{summary.icon}</span>
                  <h3 className="text-[14px] font-bold text-[var(--color-text-0)]">{summary.subject}</h3>
                  <span className={`pill ${st.pillBg}`}>
                    <span className={`glow-dot ${st.dot}`} />
                    {summary.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-[13px] text-[var(--color-text-1)] leading-relaxed">
                  {summary.latestStatus}
                </p>
                <p className="text-[11px] text-[var(--color-text-3)] mt-2">
                  <span className="font-semibold">Waiting on:</span> {summary.waitingOn}
                </p>
              </div>
              <div className={`shrink-0 text-[var(--color-text-3)] transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                <ChevronDown className="w-5 h-5" />
              </div>
            </button>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 sm:px-6 pb-6 space-y-5 border-t border-[var(--color-border-primary)] pt-5">
                    {/* Key Points */}
                    <div>
                      <h4 className="text-[10px] font-bold text-[var(--color-text-3)] uppercase tracking-widest mb-3">Key Points</h4>
                      <ul className="space-y-2">
                        {summary.keyPoints.map((point, j) => (
                          <li key={j} className="flex items-start gap-2.5 text-[13px] text-[var(--color-text-1)]">
                            <ArrowRight className="w-3.5 h-3.5 mt-1 shrink-0 text-[var(--color-brand-light)]" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Timeline */}
                    <div>
                      <h4 className="text-[10px] font-bold text-[var(--color-text-3)] uppercase tracking-widest mb-3">Timeline</h4>
                      <div className="space-y-0">
                        {summary.timeline.map((entry, j) => (
                          <div key={j} className="flex items-start gap-3 group/tl">
                            <div className="flex flex-col items-center">
                              <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-brand)] mt-1.5 shadow-sm shadow-[var(--color-brand)]/40" />
                              {j < summary.timeline.length - 1 && (
                                <div className="w-px flex-1 bg-[var(--color-surface-4)] min-h-[20px]" />
                              )}
                            </div>
                            <div className="pb-3">
                              <span className="text-[10px] font-bold text-[var(--color-text-3)]">{entry.date}</span>
                              <p className="text-[12px] text-[var(--color-text-1)] mt-0.5">{entry.event}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Full Thread */}
                    {thread && (
                      <div>
                        <h4 className="text-[10px] font-bold text-[var(--color-text-3)] uppercase tracking-widest mb-3">
                          Full Thread — {thread.emails.length} emails
                        </h4>
                        <div className="space-y-2">
                          {thread.emails.map(email => (
                            <div key={email.id} className="p-4 rounded-xl bg-[var(--color-surface-3)] border border-[var(--color-border-primary)]">
                              <div className="flex items-center justify-between mb-2 flex-wrap gap-1">
                                <span className="text-[12px] font-bold text-[var(--color-text-0)]">
                                  {getPersonName(email.from)}
                                </span>
                                <span className="text-[10px] text-[var(--color-text-3)] font-medium">
                                  {email.date} • {email.time}
                                </span>
                              </div>
                              <p className="text-[12px] text-[var(--color-text-1)] leading-relaxed">
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
    </motion.div>
  );
}
