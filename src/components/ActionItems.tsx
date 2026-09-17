import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Clock, ArrowUpCircle, User, FileText, Mic, Mail } from 'lucide-react';
import { actionItems, type ActionStatus, type ActionPriority } from '../engine/actionItems';

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const fadeUp = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

export default function ActionItems() {
  const [statusFilter, setStatusFilter] = useState<ActionStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<ActionPriority | 'all'>('all');

  const filtered = actionItems.filter(item => {
    if (statusFilter !== 'all' && item.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && item.priority !== priorityFilter) return false;
    return true;
  });

  const statusIcon = (status: ActionStatus) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-5 h-5 text-[var(--color-green)]" />;
      case 'overdue': return <AlertCircle className="w-5 h-5 text-[var(--color-red)]" />;
      case 'at-risk': return <ArrowUpCircle className="w-5 h-5 text-[var(--color-amber)]" />;
      default: return <Clock className="w-5 h-5 text-[var(--color-text-3)]" />;
    }
  };

  const statusConfig: Record<ActionStatus, { text: string; dot: string; pill: string }> = {
    'pending': { text: 'Pending', dot: 'glow-dot-amber', pill: 'bg-[var(--color-amber-glow)] text-[var(--color-amber)]' },
    'in-progress': { text: 'In Progress', dot: 'glow-dot-blue', pill: 'bg-[var(--color-blue-glow)] text-[var(--color-blue)]' },
    'completed': { text: 'Done', dot: 'glow-dot-green', pill: 'bg-[var(--color-green-glow)] text-[var(--color-green)]' },
    'overdue': { text: 'Overdue', dot: 'glow-dot-red', pill: 'bg-[var(--color-red-glow)] text-[var(--color-red)]' },
    'at-risk': { text: 'At Risk', dot: 'glow-dot-red', pill: 'bg-[var(--color-red-glow)] text-[var(--color-red)]' },
  };

  const priorityConfig: Record<ActionPriority, { text: string; dot: string; pill: string }> = {
    'critical': { text: 'CRITICAL', dot: 'glow-dot-red', pill: 'bg-[var(--color-red)] text-white' },
    'high': { text: 'HIGH', dot: 'glow-dot-amber', pill: 'bg-[var(--color-amber)] text-black' },
    'medium': { text: 'MEDIUM', dot: 'glow-dot-blue', pill: 'bg-[var(--color-blue-glow)] text-[var(--color-blue)]' },
    'low': { text: 'LOW', dot: 'glow-dot-brand', pill: 'bg-[var(--color-surface-4)] text-[var(--color-text-2)]' },
  };

  const sourceIcon = (source: string) => {
    switch (source) {
      case 'meeting': return <FileText className="w-3 h-3" />;
      case 'email': return <Mail className="w-3 h-3" />;
      case 'voice-note': return <Mic className="w-3 h-3" />;
      default: return null;
    }
  };

  const counts = {
    all: actionItems.length,
    critical: actionItems.filter(a => a.priority === 'critical').length,
    pending: actionItems.filter(a => a.status !== 'completed').length,
    completed: actionItems.filter(a => a.status === 'completed').length,
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Items', value: counts.all, gradient: 'from-[var(--color-brand)]/10 to-transparent', color: 'text-[var(--color-brand-light)]' },
          { label: 'Critical', value: counts.critical, gradient: 'from-[var(--color-red)]/10 to-transparent', color: 'text-[var(--color-red)]' },
          { label: 'Open', value: counts.pending, gradient: 'from-[var(--color-amber)]/10 to-transparent', color: 'text-[var(--color-amber)]' },
          { label: 'Completed', value: counts.completed, gradient: 'from-[var(--color-green)]/10 to-transparent', color: 'text-[var(--color-green)]' },
        ].map(stat => (
          <div key={stat.label} className={`card bg-gradient-to-br ${stat.gradient} p-5 text-center`}>
            <p className={`text-3xl font-extrabold ${stat.color}`}>{stat.value}</p>
            <p className="text-[11px] font-medium text-[var(--color-text-3)] mt-1 uppercase tracking-wide">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1 p-1 bg-[var(--color-surface-2)] rounded-xl border border-[var(--color-border-primary)]">
          {(['all', 'pending', 'at-risk', 'overdue', 'completed'] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
                statusFilter === s
                  ? 'bg-[var(--color-brand)] text-white shadow-lg shadow-[var(--color-brand)]/20'
                  : 'text-[var(--color-text-3)] hover:text-[var(--color-text-1)] hover:bg-[var(--color-hover)]'
              }`}
            >
              {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1).replace('-', ' ')}
            </button>
          ))}
        </div>
        <div className="flex gap-1 p-1 bg-[var(--color-surface-2)] rounded-xl border border-[var(--color-border-primary)]">
          {(['all', 'critical', 'high', 'medium'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPriorityFilter(p)}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
                priorityFilter === p
                  ? 'bg-[var(--color-brand)] text-white shadow-lg shadow-[var(--color-brand)]/20'
                  : 'text-[var(--color-text-3)] hover:text-[var(--color-text-1)] hover:bg-[var(--color-hover)]'
              }`}
            >
              {p === 'all' ? 'All Priority' : p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-3">
        {filtered.map(item => {
          const sc = statusConfig[item.status];
          const pc = priorityConfig[item.priority];
          return (
            <motion.div
              key={item.id}
              variants={fadeUp}
              className="card card-glow p-5"
            >
              <div className="flex items-start gap-4">
                <div className="mt-0.5">{statusIcon(item.status)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <h3 className="text-[14px] font-bold text-[var(--color-text-0)]">{item.title}</h3>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`pill ${pc.pill}`}>
                        {item.priority !== 'low' && <span className={`glow-dot ${pc.dot}`} />}
                        {pc.text}
                      </span>
                      <span className={`pill ${sc.pill}`}>
                        <span className={`glow-dot ${sc.dot}`} />
                        {sc.text}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-2.5 text-[12px] text-[var(--color-text-3)]">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3 h-3" /> {item.owner}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3" /> {item.deadlineLabel}
                    </span>
                    <span className="flex items-center gap-1.5">
                      {sourceIcon(item.source)} {item.source}
                    </span>
                  </div>

                  <div className="mt-3 p-3.5 rounded-xl bg-[var(--color-surface-3)] border border-[var(--color-border-primary)]">
                    <p className="text-[10px] font-bold text-[var(--color-text-3)] uppercase tracking-wider mb-1.5">Source Trail</p>
                    <p className="text-[12px] text-[var(--color-text-1)] leading-relaxed">{item.sourceDetail}</p>
                  </div>

                  <div className="mt-2 p-3.5 rounded-xl bg-[var(--color-surface-3)] border border-[var(--color-border-primary)]">
                    <p className="text-[10px] font-bold text-[var(--color-text-3)] uppercase tracking-wider mb-1.5">Current Status</p>
                    <p className="text-[12px] text-[var(--color-text-1)] leading-relaxed">{item.notes}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
