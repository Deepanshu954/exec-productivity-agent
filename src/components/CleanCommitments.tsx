import { useState, useEffect } from 'react';
import { CheckCircle2, ArrowRight, UserCheck } from 'lucide-react';
import { api, type CommitmentDto } from '../services/api';

export default function CleanCommitments({ onAskAi }: { onAskAi?: (prompt: string) => void }) {
  const [commitments, setCommitments] = useState<CommitmentDto[]>([]);

  useEffect(() => {
    api.getCommitments().then(setCommitments).catch(console.error);
  }, []);

  const arjunCommitments = commitments.filter(
    (c) => c.owner?.name === 'Arjun Malhotra' || c.owner?.user === true
  );
  const teamDeliverables = commitments.filter(
    (c) => c.owner?.name !== 'Arjun Malhotra' && !c.owner?.user
  );

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--color-border-primary)] pb-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Commitments & Deliverables</h2>
          <p className="text-xs text-[var(--color-text-2)] mt-0.5">
            Strict distinction between Arjun's personal commitments and incoming team deliverables.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/25">
            1 Overdue on Arjun
          </span>
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/25">
            1 Unassigned Risk
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column 1: Arjun's Commitments */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <UserCheck className="w-4 h-4 text-[var(--color-brand-light)]" />
            <span>My Commitments (Arjun Malhotra)</span>
          </div>

          <div className="space-y-3.5">
            {arjunCommitments.map((c) => (
              <div
                key={c.id}
                className={`p-5 rounded-2xl border transition-all ${
                  c.status === 'OVERDUE'
                    ? 'bg-red-500/10 border-red-500/30'
                    : 'bg-[var(--color-surface-1)] border-[var(--color-border-primary)]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-sm font-bold text-white leading-snug">{c.title}</h3>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md border shrink-0 ${
                      c.status === 'OVERDUE'
                        ? 'bg-red-500/20 text-red-300 border-red-500/40'
                        : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                    }`}
                  >
                    {c.status}
                  </span>
                </div>

                <p className="text-xs text-[var(--color-text-2)] mt-2 leading-relaxed">
                  {c.whyItMatters}
                </p>

                {c.delayCount > 0 && (
                  <div className="mt-3 p-2.5 rounded-xl bg-red-500/15 border border-red-500/25 text-[11px] text-red-300">
                    <span className="font-bold">Delay History:</span> Slipped {c.delayCount} times across Mon, Tue, and Wed. Counterparty ({c.counterparty?.name}) sent 3 follow-ups.
                  </div>
                )}

                <div className="mt-4 pt-3 border-t border-[var(--color-border-primary)]/60 flex items-center justify-between text-[11px]">
                  <span className="text-[var(--color-text-3)]">
                    Target: <strong className="text-white font-semibold">{c.currentDeadline}</strong>
                  </span>
                  {onAskAi && (
                    <button
                      onClick={() => onAskAi(`What is the status of ${c.title}?`)}
                      className="flex items-center gap-1 text-[var(--color-brand-light)] hover:text-white font-semibold"
                    >
                      <span>Ask AI</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Team Deliverables */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Incoming Team Deliverables</span>
          </div>

          <div className="space-y-3.5">
            {teamDeliverables.map((c) => (
              <div
                key={c.id}
                className={`p-5 rounded-2xl border transition-all ${
                  c.status === 'AT_RISK'
                    ? 'bg-amber-500/10 border-amber-500/30'
                    : 'bg-[var(--color-surface-1)] border-[var(--color-border-primary)]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-white leading-snug">{c.title}</h3>
                    <p className="text-[11px] text-[var(--color-text-3)] mt-0.5">
                      Owner: <strong className="text-[var(--color-text-1)]">{c.owner?.name || 'UNASSIGNED (Critical Risk)'}</strong>
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md border shrink-0 ${
                      c.status === 'AT_RISK'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    }`}
                  >
                    {c.status}
                  </span>
                </div>

                <p className="text-xs text-[var(--color-text-2)] mt-2 leading-relaxed">
                  {c.description}
                </p>

                <div className="mt-4 pt-3 border-t border-[var(--color-border-primary)]/60 flex items-center justify-between text-[11px]">
                  <span className="text-[var(--color-text-3)]">
                    Deadline: <strong className="text-white font-semibold">{c.currentDeadline}</strong>
                  </span>
                  {onAskAi && (
                    <button
                      onClick={() => onAskAi(`Give me full details on ${c.title}`)}
                      className="flex items-center gap-1 text-[var(--color-brand-light)] hover:text-white font-semibold"
                    >
                      <span>Ask AI</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
