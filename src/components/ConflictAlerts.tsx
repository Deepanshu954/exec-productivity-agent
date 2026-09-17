import { motion } from 'framer-motion';
import { AlertTriangle, AlertCircle, Info, ShieldAlert, Calendar, Target, ArrowRight } from 'lucide-react';
import { conflicts } from '../engine/conflicts';

export default function ConflictAlerts() {
  const severityConfig: Record<string, { icon: typeof AlertTriangle; color: string; bg: string; border: string }> = {
    'critical': { icon: ShieldAlert, color: 'text-[var(--color-error)]', bg: 'bg-[var(--color-error-subtle)]', border: 'border-red-500/30' },
    'warning': { icon: AlertTriangle, color: 'text-[var(--color-warning)]', bg: 'bg-[var(--color-warning-subtle)]', border: 'border-amber-500/30' },
    'info': { icon: Info, color: 'text-[var(--color-info)]', bg: 'bg-[var(--color-info-subtle)]', border: 'border-blue-500/30' },
  };

  const typeIcon: Record<string, typeof AlertTriangle> = {
    'calendar-overlap': Calendar,
    'deadline-risk': AlertCircle,
    'unowned-task': ShieldAlert,
    'missed-commitment': Target,
    'scheduling-note': Info,
  };

  const sorted = [...conflicts].sort((a, b) => {
    const order = { critical: 0, warning: 1, info: 2 };
    return (order[a.severity] || 2) - (order[b.severity] || 2);
  });

  const criticalCount = sorted.filter(c => c.severity === 'critical').length;
  const warningCount = sorted.filter(c => c.severity === 'warning').length;

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[var(--color-error-subtle)] border border-red-500/20 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-[var(--color-error)]">{criticalCount}</p>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">Critical</p>
        </div>
        <div className="bg-[var(--color-warning-subtle)] border border-amber-500/20 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-[var(--color-warning)]">{warningCount}</p>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">Warnings</p>
        </div>
        <div className="bg-[var(--color-info-subtle)] border border-blue-500/20 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-[var(--color-info)]">{sorted.length}</p>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">Total</p>
        </div>
      </div>

      {/* Alert Cards */}
      <div className="space-y-3">
        {sorted.map((conflict, i) => {
          const config = severityConfig[conflict.severity] || severityConfig.info;
          const TypeIcon = typeIcon[conflict.type] || AlertTriangle;

          return (
            <motion.div
              key={conflict.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`bg-[var(--color-surface-elevated)] border ${config.border} rounded-xl p-5 transition-all`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-2.5 rounded-xl ${config.bg} shrink-0`}>
                  <TypeIcon className={`w-5 h-5 ${config.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">{conflict.title}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${config.bg} ${config.color}`}>
                      {conflict.severity.toUpperCase()}
                    </span>
                    <span className="text-[10px] text-[var(--color-text-muted)] ml-auto">{conflict.date}</span>
                  </div>
                  
                  <p className="text-sm text-[var(--color-text-secondary)] mt-2 leading-relaxed">
                    {conflict.description}
                  </p>

                  <div className="mt-3 p-3 rounded-lg bg-[var(--color-surface)] flex items-start gap-2">
                    <ArrowRight className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[var(--color-accent)]" />
                    <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                      <span className="font-semibold text-[var(--color-accent)]">Recommendation:</span>{' '}
                      {conflict.recommendation}
                    </p>
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
