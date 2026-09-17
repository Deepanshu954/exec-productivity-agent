import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, AlertCircle, CheckCircle2, AlertTriangle, ArrowRight, ChevronLeft, ChevronRight, Zap, Mail } from 'lucide-react';
import { briefings } from '../engine/briefing';
import { weekDays } from '../data/calendar';
import { formatTime } from '../engine/scheduler';

export default function Dashboard() {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const briefing = briefings[selectedDayIndex];

  const statusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-4 h-4 text-[var(--color-success)]" />;
      case 'overdue': case 'at-risk': return <AlertCircle className="w-4 h-4 text-[var(--color-error)]" />;
      default: return <Clock className="w-4 h-4 text-[var(--color-warning)]" />;
    }
  };

  const priorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-[var(--color-error)] bg-[var(--color-error-subtle)]';
      case 'high': return 'text-[var(--color-warning)] bg-[var(--color-warning-subtle)]';
      case 'medium': return 'text-[var(--color-info)] bg-[var(--color-info-subtle)]';
      default: return 'text-[var(--color-text-muted)] bg-[var(--color-surface-hover)]';
    }
  };

  return (
    <div className="space-y-6">
      {/* Day Selector */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSelectedDayIndex(Math.max(0, selectedDayIndex - 1))}
          disabled={selectedDayIndex === 0}
          className="p-1.5 rounded-lg hover:bg-[var(--color-surface-hover)] disabled:opacity-30 transition-all text-[var(--color-text-secondary)]"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex gap-1.5 flex-1 justify-center">
          {weekDays.map((day, i) => (
            <button
              key={day.date}
              onClick={() => setSelectedDayIndex(i)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                i === selectedDayIndex
                  ? 'bg-[var(--color-accent)] text-white shadow-lg shadow-[var(--color-accent)]/20'
                  : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]'
              }`}
            >
              <span className="hidden sm:inline">{day.label}</span>
              <span className="sm:hidden">{day.day}</span>
            </button>
          ))}
        </div>
        <button
          onClick={() => setSelectedDayIndex(Math.min(4, selectedDayIndex + 1))}
          disabled={selectedDayIndex === 4}
          className="p-1.5 rounded-lg hover:bg-[var(--color-surface-hover)] disabled:opacity-30 transition-all text-[var(--color-text-secondary)]"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Briefing Header */}
      <motion.div
        key={briefing.date}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[var(--color-accent-subtle)] to-transparent border border-[var(--color-border)] rounded-xl p-5"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-accent)] to-purple-500 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-1">
              {briefing.dayLabel}
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
              {briefing.greeting}
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Today's Agenda */}
        <motion.div
          key={`agenda-${briefing.date}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-xl p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4 text-[var(--color-accent)]" />
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Today's Agenda</h3>
            <span className="ml-auto text-xs text-[var(--color-text-muted)]">{briefing.agenda.length} events</span>
          </div>
          {briefing.agenda.length === 0 ? (
            <p className="text-sm text-[var(--color-text-muted)] italic">No scheduled events for today</p>
          ) : (
            <div className="space-y-2">
              {briefing.agenda.map((event, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                    event.isBlocked
                      ? 'bg-[var(--color-surface-hover)] opacity-50'
                      : 'bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)]'
                  }`}
                >
                  <div className={`w-1 h-8 rounded-full ${event.isBlocked ? 'bg-[var(--color-text-muted)]' : 'bg-[var(--color-accent)]'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">{event.event}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      {formatTime(event.startTime)} – {formatTime(event.endTime)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Key Insights */}
        <motion.div
          key={`insights-${briefing.date}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-xl p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-[var(--color-warning)]" />
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Key Insights</h3>
          </div>
          {briefing.keyInsights.length === 0 ? (
            <p className="text-sm text-[var(--color-text-muted)] italic">No special insights for today</p>
          ) : (
            <div className="space-y-2.5">
              {briefing.keyInsights.map((insight, i) => (
                <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg bg-[var(--color-surface)] text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  <ArrowRight className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[var(--color-accent)]" />
                  <span>{insight}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Pending Actions */}
        <motion.div
          key={`actions-${briefing.date}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-xl p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-[var(--color-error)]" />
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Pending on Arjun</h3>
            <span className="ml-auto text-xs text-[var(--color-text-muted)]">{briefing.pendingActions.length} items</span>
          </div>
          <div className="space-y-2">
            {briefing.pendingActions.map(action => (
              <div key={action.id} className="flex items-start gap-3 p-3 rounded-lg bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] transition-all">
                {statusIcon(action.status)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--color-text-primary)]">{action.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${priorityColor(action.priority)}`}>
                      {action.priority.toUpperCase()}
                    </span>
                    <span className="text-xs text-[var(--color-text-muted)]">Due: {action.deadlineLabel}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Email Updates */}
        <motion.div
          key={`emails-${briefing.date}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-xl p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Mail className="w-4 h-4 text-[var(--color-info)]" />
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Email Updates</h3>
          </div>
          {briefing.emailUpdates.length === 0 ? (
            <p className="text-sm text-[var(--color-text-muted)] italic">No relevant email updates today</p>
          ) : (
            <div className="space-y-2">
              {briefing.emailUpdates.map((update, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-[var(--color-surface)] text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  {update}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
