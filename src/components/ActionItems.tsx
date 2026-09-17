import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Clock, ArrowUpCircle, Filter, User, FileText, Mic, Mail } from 'lucide-react';
import { actionItems, type ActionStatus, type ActionPriority } from '../engine/actionItems';

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
      case 'completed': return <CheckCircle2 className="w-5 h-5 text-[var(--color-success)]" />;
      case 'overdue': return <AlertCircle className="w-5 h-5 text-[var(--color-error)]" />;
      case 'at-risk': return <ArrowUpCircle className="w-5 h-5 text-[var(--color-warning)]" />;
      case 'in-progress': return <Clock className="w-5 h-5 text-[var(--color-info)]" />;
      default: return <Clock className="w-5 h-5 text-[var(--color-text-muted)]" />;
    }
  };

  const statusLabel = (status: ActionStatus) => {
    const labels: Record<ActionStatus, { text: string; color: string }> = {
      'pending': { text: 'Pending', color: 'text-[var(--color-warning)] bg-[var(--color-warning-subtle)]' },
      'in-progress': { text: 'In Progress', color: 'text-[var(--color-info)] bg-[var(--color-info-subtle)]' },
      'completed': { text: 'Completed', color: 'text-[var(--color-success)] bg-[var(--color-success-subtle)]' },
      'overdue': { text: 'Overdue', color: 'text-[var(--color-error)] bg-[var(--color-error-subtle)]' },
      'at-risk': { text: 'At Risk', color: 'text-[var(--color-error)] bg-[var(--color-error-subtle)]' },
    };
    return labels[status];
  };

  const priorityBadge = (priority: ActionPriority) => {
    const styles: Record<ActionPriority, string> = {
      'critical': 'bg-[var(--color-error)] text-white',
      'high': 'bg-[var(--color-warning)] text-black',
      'medium': 'bg-[var(--color-info)] text-white',
      'low': 'bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)]',
    };
    return styles[priority];
  };

  const sourceIcon = (source: string) => {
    switch (source) {
      case 'meeting': return <FileText className="w-3.5 h-3.5" />;
      case 'email': return <Mail className="w-3.5 h-3.5" />;
      case 'voice-note': return <Mic className="w-3.5 h-3.5" />;
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
    <div className="space-y-5">
      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total', value: counts.all, color: 'var(--color-accent)' },
          { label: 'Critical', value: counts.critical, color: 'var(--color-error)' },
          { label: 'Open', value: counts.pending, color: 'var(--color-warning)' },
          { label: 'Done', value: counts.completed, color: 'var(--color-success)' },
        ].map(stat => (
          <div key={stat.label} className="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-xl p-4 text-center">
            <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <Filter className="w-4 h-4 text-[var(--color-text-muted)]" />
        <div className="flex gap-1.5">
          {(['all', 'pending', 'at-risk', 'overdue', 'completed'] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                statusFilter === s
                  ? 'bg-[var(--color-accent)] text-white'
                  : 'bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]'
              }`}
            >
              {s === 'all' ? 'All Status' : s.charAt(0).toUpperCase() + s.slice(1).replace('-', ' ')}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5 ml-2">
          {(['all', 'critical', 'high', 'medium'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPriorityFilter(p)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                priorityFilter === p
                  ? 'bg-[var(--color-accent)] text-white'
                  : 'bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]'
              }`}
            >
              {p === 'all' ? 'All Priority' : p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Action Items */}
      <div className="space-y-3">
        {filtered.map((item, i) => {
          const sl = statusLabel(item.status);
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-xl p-5 hover:border-[var(--color-accent)]/30 transition-all"
            >
              <div className="flex items-start gap-3">
                {statusIcon(item.status)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">{item.title}</h3>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${priorityBadge(item.priority)}`}>
                        {item.priority.toUpperCase()}
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${sl.color}`}>
                        {sl.text}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-2 text-xs text-[var(--color-text-muted)]">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {item.owner}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.deadlineLabel}
                    </span>
                    <span className="flex items-center gap-1">
                      {sourceIcon(item.source)}
                      {item.source}
                    </span>
                  </div>

                  <div className="mt-3 p-3 rounded-lg bg-[var(--color-surface)] text-xs text-[var(--color-text-secondary)] leading-relaxed">
                    <p className="font-medium text-[var(--color-text-muted)] mb-1">Source Detail:</p>
                    <p>{item.sourceDetail}</p>
                  </div>

                  <div className="mt-2 p-3 rounded-lg bg-[var(--color-surface)] text-xs text-[var(--color-text-secondary)] leading-relaxed">
                    <p className="font-medium text-[var(--color-text-muted)] mb-1">Current Status:</p>
                    <p>{item.notes}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
