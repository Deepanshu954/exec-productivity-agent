import { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { api, type BriefingDto } from '../services/api';
import AiAssistant from './AiAssistant';

const weekDays = [
  { day: 'Mon', date: '2026-09-21', label: 'Mon 21 Sep' },
  { day: 'Tue', date: '2026-09-22', label: 'Tue 22 Sep' },
  { day: 'Wed', date: '2026-09-23', label: 'Wed 23 Sep' },
  { day: 'Thu', date: '2026-09-24', label: 'Thu 24 Sep' },
  { day: 'Fri', date: '2026-09-25', label: 'Fri 25 Sep' },
];

export default function Dashboard({ onNavigate }: { onNavigate?: (view: string) => void }) {
  const [selectedDayIndex, setSelectedDayIndex] = useState(2); // Default to Wed 23 Sep where multiple actions happen
  const [briefing, setBriefing] = useState<BriefingDto | null>(null);
  const [selectedQuery, setSelectedQuery] = useState<string | undefined>(undefined);

  const currentDay = weekDays[selectedDayIndex];

  useEffect(() => {
    loadBriefing(currentDay.date);
  }, [selectedDayIndex]);

  const loadBriefing = async (dateStr: string) => {
    try {
      const data = await api.getBriefing(dateStr);
      setBriefing(data);
    } catch (e) {
      console.error('Failed to load briefing:', e);
    }
  };

  const handlePromptClick = (prompt: string) => {
    setSelectedQuery(prompt);
  };

  return (
    <div className="space-y-8">
      {/* 1. Date & Day Selector Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[var(--color-surface-1)] border border-[var(--color-border-primary)] shadow-sm">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-[var(--color-brand)]" />
          <span className="text-sm font-semibold text-[var(--color-text-0)]">
            Active Week: Sep 21 – Sep 25, 2026
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-[var(--color-surface-2)] p-1 rounded-xl border border-[var(--color-border-primary)]">
          <button
            onClick={() => setSelectedDayIndex(Math.max(0, selectedDayIndex - 1))}
            disabled={selectedDayIndex === 0}
            className="p-1.5 rounded-lg text-[var(--color-text-2)] hover:text-white disabled:opacity-20 transition-all"
            aria-label="Previous day"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {weekDays.map((day, idx) => (
            <button
              key={day.date}
              onClick={() => setSelectedDayIndex(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all relative ${
                idx === selectedDayIndex
                  ? 'bg-gradient-to-r from-[var(--color-brand)] to-purple-600 text-white shadow-sm'
                  : 'text-[var(--color-text-2)] hover:text-white hover:bg-[var(--color-hover)]'
              }`}
            >
              {day.label}
            </button>
          ))}

          <button
            onClick={() => setSelectedDayIndex(Math.min(4, selectedDayIndex + 1))}
            disabled={selectedDayIndex === 4}
            className="p-1.5 rounded-lg text-[var(--color-text-2)] hover:text-white disabled:opacity-20 transition-all"
            aria-label="Next day"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Executive Synthesis Card */}
      <div className="relative overflow-hidden rounded-2xl border border-[var(--color-brand)]/30 bg-gradient-to-br from-[var(--color-brand)]/10 via-[var(--color-surface-1)] to-purple-950/20 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[var(--color-brand)] to-purple-500 flex items-center justify-center shadow-lg shadow-[var(--color-brand)]/25">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--color-brand-light)]">
                AI Executive Briefing
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                {briefing?.dayLabel || currentDay.label}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/30">
              <AlertTriangle className="w-3.5 h-3.5" />
              {briefing?.criticalAlerts?.length || 2} Critical Attention Items
            </span>
          </div>
        </div>

        <p className="text-[14px] sm:text-[15px] text-[var(--color-text-1)] leading-relaxed max-w-4xl">
          {briefing?.executiveSummary}
        </p>

        {/* Actionable Executive Alert Bar */}
        <div className="mt-6 pt-5 border-t border-[var(--color-border-primary)] grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20">
            <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-red-300">
                Vendor List Overdue (Raghav waiting)
              </p>
              <p className="text-[11px] text-[var(--color-text-2)] mt-0.5">
                Slipped 3 times across Mon, Tue, and Wed morning. Immediate delivery needed.
              </p>
            </div>
            <button
              onClick={() => handlePromptClick('What did I promise Raghav?')}
              className="ml-auto text-[11px] font-semibold text-red-300 underline hover:text-white shrink-0"
            >
              Details
            </button>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-amber-300">
                Mumbai Lease Renewal Unassigned
              </p>
              <p className="text-[11px] text-[var(--color-text-2)] mt-0.5">
                Deadline Friday EOD. Raghav escalated twice; resolve during Friday 10 AM Facilities Check-in.
              </p>
            </div>
            <button
              onClick={() => handlePromptClick('Why is the Mumbai lease renewal considered critical?')}
              className="ml-auto text-[11px] font-semibold text-amber-300 underline hover:text-white shrink-0"
            >
              Details
            </button>
          </div>
        </div>
      </div>

      {/* 3. Core Workspace Layout: AI Agent Interactive Cockpit & Agenda */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left Column: Prominent AI Assistant (Executive Command Panel) */}
        <div className="xl:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[var(--color-brand)]" />
              <h3 className="text-lg font-bold text-white">Ask Your Executive Agent</h3>
            </div>
            <span className="text-xs text-[var(--color-text-3)]">
              Grounded in all 5 assignment sources
            </span>
          </div>

          <AiAssistant initialQuery={selectedQuery} />
        </div>

        {/* Right Column: Schedule & Active Commitments */}
        <div className="xl:col-span-5 space-y-6">
          {/* Today's Schedule Card */}
          <div className="p-6 rounded-2xl bg-[var(--color-surface-1)] border border-[var(--color-border-primary)] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[var(--color-brand-light)]" />
                <h4 className="text-sm font-bold text-white">Today's Schedule (Arjun)</h4>
              </div>
              {onNavigate && (
                <button
                  onClick={() => onNavigate('calendar')}
                  className="text-xs text-[var(--color-brand-light)] hover:underline flex items-center gap-1"
                >
                  Full Calendar <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>

            {briefing?.agenda && briefing.agenda.length > 0 ? (
              <div className="space-y-2.5">
                {briefing.agenda.map((event) => (
                  <div
                    key={event.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      event.hasConflict
                        ? 'bg-red-500/10 border-red-500/30'
                        : event.blocked
                        ? 'bg-[var(--color-surface-2)]/50 border-[var(--color-border-primary)] opacity-50'
                        : 'bg-[var(--color-surface-2)] border-[var(--color-border-primary)] hover:border-[var(--color-border-active)]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[var(--color-text-0)]">
                        {event.title}
                      </span>
                      <span className="text-[11px] font-semibold text-[var(--color-brand-light)]">
                        {event.timeRange}
                      </span>
                    </div>

                    {event.hasConflict && (
                      <p className="text-[11px] text-red-400 font-medium mt-1 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> {event.conflictNotes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[var(--color-text-3)] italic py-4 text-center">
                No events scheduled on this day.
              </p>
            )}
          </div>

          {/* Active Commitments Card */}
          <div className="p-6 rounded-2xl bg-[var(--color-surface-1)] border border-[var(--color-border-primary)] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <h4 className="text-sm font-bold text-white">Active Commitments & Status</h4>
              </div>
              {onNavigate && (
                <button
                  onClick={() => onNavigate('actions')}
                  className="text-xs text-[var(--color-brand-light)] hover:underline flex items-center gap-1"
                >
                  View All <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>

            <div className="space-y-3">
              {briefing?.openCommitments?.map((c) => (
                <div
                  key={c.id}
                  className="p-3.5 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border-primary)] hover:border-[var(--color-border-active)] transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-[var(--color-text-0)]">
                      {c.title}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                        c.status === 'OVERDUE'
                          ? 'bg-red-500/15 border-red-500/30 text-red-400'
                          : c.status === 'AT_RISK'
                          ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                          : 'bg-blue-500/15 border-blue-500/30 text-blue-400'
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>

                  <p className="text-[11px] text-[var(--color-text-2)] mt-1 line-clamp-2">
                    {c.whyItMatters}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-[var(--color-border-primary)]/50 flex items-center justify-between text-[10px] text-[var(--color-text-3)]">
                    <span>Owner: {c.owner?.name || 'UNASSIGNED'}</span>
                    <span className="font-semibold text-[var(--color-text-2)]">
                      Due: {c.currentDeadline}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
