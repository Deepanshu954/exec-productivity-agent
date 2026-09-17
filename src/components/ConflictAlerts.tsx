import { motion } from 'framer-motion';
import { AlertTriangle, AlertCircle, Info, ShieldAlert, Calendar, Target, ArrowRight } from 'lucide-react';
import { conflicts } from '../engine/conflicts';

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const fadeUp = { hidden: { opacity: 0, x: -12 }, show: { opacity: 1, x: 0, transition: { duration: 0.3 } } };

export default function ConflictAlerts() {
  const severityConfig: Record<string, { icon: typeof AlertTriangle; color: string; glow: string; dot: string; borderClass: string }> = {
    'critical': { icon: ShieldAlert, color: 'text-[var(--color-red)]', glow: 'var(--color-red-glow)', dot: 'glow-dot-red', borderClass: 'border-red-500/20 hover:border-red-500/40' },
    'warning': { icon: AlertTriangle, color: 'text-[var(--color-amber)]', glow: 'var(--color-amber-glow)', dot: 'glow-dot-amber', borderClass: 'border-amber-500/20 hover:border-amber-500/40' },
    'info': { icon: Info, color: 'text-[var(--color-blue)]', glow: 'var(--color-blue-glow)', dot: 'glow-dot-blue', borderClass: 'border-blue-500/20 hover:border-blue-500/40' },
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
  const infoCount = sorted.filter(c => c.severity === 'info').length;

  return (
    <div className="space-y-6">
      {/* Severity summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Critical', count: criticalCount, color: 'var(--color-red)', glow: 'from-[var(--color-red)]/15 to-transparent', border: 'border-red-500/20' },
          { label: 'Warnings', count: warningCount, color: 'var(--color-amber)', glow: 'from-[var(--color-amber)]/15 to-transparent', border: 'border-amber-500/20' },
          { label: 'Info', count: infoCount, color: 'var(--color-blue)', glow: 'from-[var(--color-blue)]/15 to-transparent', border: 'border-blue-500/20' },
        ].map(s => (
          <div key={s.label} className={`card bg-gradient-to-br ${s.glow} ${s.border} p-5 text-center`}>
            <p className="text-3xl font-extrabold" style={{ color: s.color }}>{s.count}</p>
            <p className="text-[11px] font-medium text-[var(--color-text-3)] mt-1 uppercase tracking-wide">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Alert cards */}
      <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-3">
        {sorted.map(conflict => {
          const config = severityConfig[conflict.severity] || severityConfig.info;
          const TypeIcon = typeIcon[conflict.type] || AlertTriangle;

          return (
            <motion.div
              key={conflict.id}
              variants={fadeUp}
              className={`card ${config.borderClass} p-5 sm:p-6 transition-all`}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl shrink-0" style={{ backgroundColor: config.glow }}>
                  <TypeIcon className={`w-5 h-5 ${config.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap mb-2">
                    <h3 className="text-[14px] font-bold text-[var(--color-text-0)]">{conflict.title}</h3>
                    <span className="pill" style={{ backgroundColor: config.glow, color: 'inherit' }}>
                      <span className={`glow-dot ${config.dot}`} />
                      <span className={config.color}>{conflict.severity.toUpperCase()}</span>
                    </span>
                    <span className="text-[10px] text-[var(--color-text-3)] ml-auto font-medium">{conflict.date}</span>
                  </div>
                  
                  <p className="text-[13px] text-[var(--color-text-1)] leading-relaxed mb-3">
                    {conflict.description}
                  </p>

                  <div className="p-3.5 rounded-xl bg-[var(--color-surface-3)] border border-[var(--color-border-primary)] flex items-start gap-2.5">
                    <ArrowRight className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[var(--color-brand-light)]" />
                    <p className="text-[12px] text-[var(--color-text-1)] leading-relaxed">
                      <span className="font-bold text-[var(--color-brand-light)]">Recommendation:</span>{' '}
                      {conflict.recommendation}
                    </p>
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
