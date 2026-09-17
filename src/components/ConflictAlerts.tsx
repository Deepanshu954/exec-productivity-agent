import { useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

export default function ConflictAlerts() {
  const [conflicts, setConflicts] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await api.getConflicts();
      setConflicts(data);
    } catch (e) {
      console.error('Failed to load conflicts:', e);
    }
  };

  const criticalCount = conflicts.filter((c) => c.severity === 'CRITICAL').length;
  const highCount = conflicts.filter((c) => c.severity === 'HIGH').length;

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[var(--color-surface-1)] border border-red-500/30 shadow-sm text-center">
          <p className="text-3xl font-black text-red-400">{criticalCount}</p>
          <p className="text-xs font-semibold text-[var(--color-text-3)] uppercase tracking-wider mt-1">
            Critical Alerts
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-[var(--color-surface-1)] border border-amber-500/30 shadow-sm text-center">
          <p className="text-3xl font-black text-amber-400">{highCount}</p>
          <p className="text-xs font-semibold text-[var(--color-text-3)] uppercase tracking-wider mt-1">
            Operational Delays
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-[var(--color-surface-1)] border border-emerald-500/30 shadow-sm text-center">
          <p className="text-3xl font-black text-emerald-400">2</p>
          <p className="text-xs font-semibold text-[var(--color-text-3)] uppercase tracking-wider mt-1">
            Proactively Mitigated
          </p>
        </div>
      </div>

      {/* Risks Matrix Cards */}
      <div className="space-y-4">
        {conflicts.map((conflict) => {
          const isCritical = conflict.severity === 'CRITICAL';

          return (
            <div
              key={conflict.id}
              className={`p-6 rounded-2xl border transition-all ${
                isCritical
                  ? 'bg-[var(--color-surface-1)] border-red-500/40 shadow-md shadow-red-500/5'
                  : 'bg-[var(--color-surface-1)] border-amber-500/40 shadow-md shadow-amber-500/5'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                        isCritical
                          ? 'bg-red-500/15 border-red-500/40 text-red-400'
                          : 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                      }`}
                    >
                      {conflict.severity}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--color-surface-3)] text-[var(--color-text-2)] border border-[var(--color-border-primary)]">
                      {conflict.type?.replace(/_/g, ' ')}
                    </span>
                    <h3 className="text-base font-bold text-white">{conflict.title}</h3>
                  </div>

                  <p className="text-xs sm:text-sm text-[var(--color-text-2)] leading-relaxed">
                    {conflict.description}
                  </p>
                </div>

                <div className="shrink-0 text-left sm:text-right text-xs">
                  <span className="text-[10px] font-bold text-[var(--color-text-3)] uppercase block">
                    Timing
                  </span>
                  <span className="font-semibold text-white">
                    {conflict.dayDate} • {conflict.time}
                  </span>
                </div>
              </div>

              {/* Stakeholders & Resolution */}
              <div className="mt-4 pt-4 border-t border-[var(--color-border-primary)] grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border-primary)]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-3)] block mb-1">
                    Stakeholders Involved
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {conflict.involvedPeople?.map((person: string) => (
                      <span
                        key={person}
                        className="px-2 py-0.5 rounded bg-[var(--color-surface-3)] text-[var(--color-text-1)] border border-[var(--color-border-primary)] text-[11px]"
                      >
                        {person}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Recommended Executive Action
                  </span>
                  <p className="text-emerald-300">{conflict.resolution}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
