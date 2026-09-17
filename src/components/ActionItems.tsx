import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  FileText,
  ChevronDown,
  ChevronUp,
  ShieldCheck
} from 'lucide-react';
import { api, type CommitmentDto } from '../services/api';

export default function ActionItems() {
  const [commitments, setCommitments] = useState<CommitmentDto[]>([]);
  const [filterOwner, setFilterOwner] = useState<'all' | 'arjun' | 'team'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'overdue' | 'at-risk' | 'completed'>('all');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await api.getCommitments();
      setCommitments(data);
    } catch (e) {
      console.error('Failed to load commitments:', e);
    }
  };

  const filtered = commitments.filter((item) => {
    // Owner filter
    if (filterOwner === 'arjun' && item.owner?.name !== 'Arjun Malhotra') return false;
    if (filterOwner === 'team' && item.owner?.name === 'Arjun Malhotra') return false;

    // Status filter
    if (filterStatus === 'open' && (item.status === 'COMPLETED' || item.status === 'RESOLVED')) return false;
    if (filterStatus === 'overdue' && item.status !== 'OVERDUE') return false;
    if (filterStatus === 'at-risk' && item.status !== 'AT_RISK') return false;
    if (filterStatus === 'completed' && item.status !== 'COMPLETED' && item.status !== 'RESOLVED') return false;

    return true;
  });

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const counts = {
    all: commitments.length,
    arjun: commitments.filter((c) => c.owner?.name === 'Arjun Malhotra').length,
    overdue: commitments.filter((c) => c.status === 'OVERDUE').length,
    atRisk: commitments.filter((c) => c.status === 'AT_RISK').length,
    completed: commitments.filter((c) => c.status === 'COMPLETED' || c.status === 'RESOLVED').length,
  };

  return (
    <div className="space-y-6">
      {/* 1. Summary Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { label: 'Total Tracked', value: counts.all, color: 'text-white', border: 'border-[var(--color-border-primary)]' },
          { label: "Arjun's Commitments", value: counts.arjun, color: 'text-[var(--color-brand-light)]', border: 'border-[var(--color-brand)]/30' },
          { label: 'Overdue Delays', value: counts.overdue, color: 'text-red-400', border: 'border-red-500/30' },
          { label: 'Unassigned Risks', value: counts.atRisk, color: 'text-amber-400', border: 'border-amber-500/30' },
          { label: 'Resolved / Done', value: counts.completed, color: 'text-emerald-400', border: 'border-emerald-500/30' },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`p-4 rounded-xl bg-[var(--color-surface-1)] border ${stat.border} shadow-sm text-center`}
          >
            <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
            <p className="text-[11px] font-semibold text-[var(--color-text-3)] mt-1 uppercase tracking-wider">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* 2. Controls & Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-[var(--color-surface-1)] border border-[var(--color-border-primary)]">
        {/* Owner Segment */}
        <div className="flex items-center gap-1 bg-[var(--color-surface-2)] p-1 rounded-xl border border-[var(--color-border-primary)]">
          {[
            { id: 'all', label: 'All Items' },
            { id: 'arjun', label: "Arjun's Own" },
            { id: 'team', label: 'Team Items' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterOwner(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterOwner === tab.id
                  ? 'bg-gradient-to-r from-[var(--color-brand)] to-purple-600 text-white shadow-sm'
                  : 'text-[var(--color-text-2)] hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Status Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: 'All' },
            { id: 'open', label: 'Open' },
            { id: 'overdue', label: 'Overdue' },
            { id: 'at-risk', label: 'At Risk' },
            { id: 'completed', label: 'Completed' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filterStatus === tab.id
                  ? 'bg-[var(--color-surface-3)] text-white border border-[var(--color-border-active)]'
                  : 'text-[var(--color-text-3)] hover:text-[var(--color-text-1)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Deliverables List */}
      <div className="space-y-4">
        {filtered.map((item) => {
          const isExpanded = expandedId === item.id;
          const isArjunOwner = item.owner?.name === 'Arjun Malhotra';
          const isUnassigned = !item.owner;

          return (
            <div
              key={item.id}
              className={`rounded-2xl border transition-all overflow-hidden ${
                item.status === 'OVERDUE'
                  ? 'bg-[var(--color-surface-1)] border-red-500/30'
                  : item.status === 'AT_RISK'
                  ? 'bg-[var(--color-surface-1)] border-amber-500/30'
                  : item.status === 'RESOLVED' || item.status === 'COMPLETED'
                  ? 'bg-[var(--color-surface-1)] border-emerald-500/20 opacity-90'
                  : 'bg-[var(--color-surface-1)] border-[var(--color-border-primary)] hover:border-[var(--color-border-active)]'
              }`}
            >
              <div className="p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold text-white">{item.title}</h3>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          item.status === 'OVERDUE'
                            ? 'bg-red-500/15 border-red-500/30 text-red-400'
                            : item.status === 'AT_RISK'
                            ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                            : item.status === 'RESOLVED' || item.status === 'COMPLETED'
                            ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                            : 'bg-blue-500/15 border-blue-500/30 text-blue-400'
                        }`}
                      >
                        {item.status}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--color-surface-3)] text-[var(--color-text-2)] border border-[var(--color-border-primary)]">
                        {item.category}
                      </span>
                      {item.delayCount > 0 && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-950/60 text-red-300 border border-red-500/40">
                          Delayed {item.delayCount}x
                        </span>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-[var(--color-text-2)] leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Owner Badge */}
                  <div className="shrink-0 flex items-center sm:flex-col sm:items-end gap-1.5 text-right">
                    <span className="text-[10px] uppercase font-bold text-[var(--color-text-3)]">
                      Owner
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                        isArjunOwner
                          ? 'bg-[var(--color-brand)]/15 border-[var(--color-brand)]/40 text-[var(--color-brand-light)]'
                          : isUnassigned
                          ? 'bg-red-500/15 border-red-500/40 text-red-400 font-extrabold animate-pulse'
                          : 'bg-[var(--color-surface-3)] border-[var(--color-border-primary)] text-[var(--color-text-1)]'
                      }`}
                    >
                      {isArjunOwner ? 'Arjun Malhotra (You)' : isUnassigned ? 'UNASSIGNED (Risk)' : item.owner?.name}
                    </span>
                  </div>
                </div>

                {/* Meta details strip */}
                <div className="mt-4 pt-4 border-t border-[var(--color-border-primary)] flex flex-wrap items-center justify-between gap-3 text-xs text-[var(--color-text-2)]">
                  <div className="flex flex-wrap items-center gap-4">
                    <span>
                      <strong className="text-[var(--color-text-1)]">Deadline:</strong>{' '}
                      {item.currentDeadline}
                    </span>
                    {item.counterparty && (
                      <span>
                        <strong className="text-[var(--color-text-1)]">Recipient:</strong>{' '}
                        {item.counterparty.name}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => toggleExpand(item.id)}
                    className="flex items-center gap-1 text-[var(--color-brand-light)] hover:text-white font-medium transition-colors"
                  >
                    <span>{isExpanded ? 'Hide Evidence' : 'Show Source & Evidence'}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Expandable Evidence Drawer */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="mt-4 pt-4 border-t border-[var(--color-border-primary)] space-y-3 overflow-hidden text-xs"
                    >
                      <div className="p-3.5 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border-primary)]">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-3)] mb-1">
                          Why It Matters
                        </p>
                        <p className="text-[var(--color-text-1)]">{item.whyItMatters}</p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border-primary)]">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-3)] mb-1 flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-purple-400" />
                          Source Ground Truth & Exact Quote
                        </p>
                        <p className="text-[var(--color-text-0)] font-medium mb-1">
                          Document: <span className="text-[var(--color-brand-light)]">{item.sourceDocument}</span>
                        </p>
                        <p className="italic text-[var(--color-text-2)] bg-[var(--color-surface-3)] p-2.5 rounded-lg border border-[var(--color-border-primary)]">
                          "{item.sourceQuote}"
                        </p>
                      </div>

                      {item.resolutionNotes && (
                        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-1 flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5" /> Resolution / Current Progress
                          </p>
                          <p>{item.resolutionNotes}</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
