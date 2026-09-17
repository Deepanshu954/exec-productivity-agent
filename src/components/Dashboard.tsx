import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, AlertCircle, CheckCircle2, AlertTriangle, ChevronLeft, ChevronRight, Mail, Sparkles } from 'lucide-react';
import { briefings } from '../engine/briefing';
import { weekDays } from '../data/calendar';
import { formatTime } from '../engine/scheduler';

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const fadeUp = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

export default function Dashboard() {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const briefing = briefings[selectedDayIndex];

  return (
    <div className="space-y-8">
      {/* Day Selector */}
      <div className="flex items-center gap-2 sm:gap-3 justify-center">
        <button
          onClick={() => setSelectedDayIndex(Math.max(0, selectedDayIndex - 1))}
          disabled={selectedDayIndex === 0}
          className="p-2 rounded-xl hover:bg-[var(--color-hover)] disabled:opacity-20 transition-all text-[var(--color-text-2)]"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex gap-1.5">
          {weekDays.map((day, i) => (
            <button
              key={day.date}
              onClick={() => setSelectedDayIndex(i)}
              className={`relative px-3 sm:px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                i === selectedDayIndex
                  ? 'text-white'
                  : 'text-[var(--color-text-3)] hover:text-[var(--color-text-1)] hover:bg-[var(--color-hover)]'
              }`}
            >
              {i === selectedDayIndex && (
                <motion.div
                  layoutId="dayPill"
                  className="absolute inset-0 bg-gradient-to-r from-[var(--color-brand)] to-[#9b6dff] rounded-xl"
                  style={{ zIndex: -1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="hidden sm:inline">{day.label}</span>
              <span className="sm:hidden">{day.day}</span>
            </button>
          ))}
        </div>
        <button
          onClick={() => setSelectedDayIndex(Math.min(4, selectedDayIndex + 1))}
          disabled={selectedDayIndex === 4}
          className="p-2 rounded-xl hover:bg-[var(--color-hover)] disabled:opacity-20 transition-all text-[var(--color-text-2)]"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Hero Briefing */}
      <AnimatePresence mode="wait">
        <motion.div
          key={briefing.date}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="relative overflow-hidden rounded-2xl border border-[var(--color-border-primary)]"
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-brand)]/10 via-transparent to-[var(--color-cyan)]/5" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-brand)]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative px-6 sm:px-8 py-7">
            <div className="flex items-start gap-4">
              <div className="hidden sm:flex w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--color-brand)] via-[#9b6dff] to-[var(--color-cyan)] items-center justify-center shrink-0 shadow-lg shadow-[var(--color-brand)]/25">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--color-brand-light)] mb-1.5">
                  Daily Briefing
                </p>
                <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-text-0)] mb-3">
                  {briefing.dayLabel}
                </h2>
                <p className="text-[15px] text-[var(--color-text-1)] leading-relaxed max-w-2xl">
                  {briefing.greeting}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Content Grid */}
      <motion.div
        key={`grid-${briefing.date}`}
        variants={stagger}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-2 gap-5"
      >
        {/* Today's Agenda */}
        <motion.div variants={fadeUp} className="card p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-brand-glow)] flex items-center justify-center">
              <Calendar className="w-4 h-4 text-[var(--color-brand-light)]" />
            </div>
            <h3 className="text-[14px] font-bold text-[var(--color-text-0)]">Today's Agenda</h3>
            <span className="ml-auto pill bg-[var(--color-surface-4)] text-[var(--color-text-2)]">{briefing.agenda.length} events</span>
          </div>
          {briefing.agenda.length === 0 ? (
            <div className="py-6 text-center text-sm text-[var(--color-text-3)] italic">No events scheduled</div>
          ) : (
            <div className="space-y-2">
              {briefing.agenda.map((event, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    event.isBlocked
                      ? 'bg-[var(--color-surface-3)]/50 opacity-40'
                      : 'bg-[var(--color-surface-3)] hover:bg-[var(--color-hover)] cursor-default'
                  }`}
                >
                  <div className={`w-[3px] h-8 rounded-full shrink-0 ${event.isBlocked ? 'bg-[var(--color-text-3)]' : 'bg-gradient-to-b from-[var(--color-brand)] to-[var(--color-brand-light)]'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-[var(--color-text-0)] truncate">
                      {event.isBlocked ? '🔒 Blocked' : event.event}
                    </p>
                    <p className="text-[11px] text-[var(--color-text-3)] mt-0.5">
                      {formatTime(event.startTime)} – {formatTime(event.endTime)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Key Insights */}
        <motion.div variants={fadeUp} className="card p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-amber-glow)] flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-[var(--color-amber)]" />
            </div>
            <h3 className="text-[14px] font-bold text-[var(--color-text-0)]">Key Insights</h3>
          </div>
          {briefing.keyInsights.length === 0 ? (
            <div className="py-6 text-center text-sm text-[var(--color-text-3)] italic">All clear for today</div>
          ) : (
            <div className="space-y-2.5">
              {briefing.keyInsights.map((insight, i) => (
                <div key={i} className="flex items-start gap-3 px-4 py-3 rounded-xl bg-[var(--color-surface-3)]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-amber)] mt-2 shrink-0 shadow-sm shadow-[var(--color-amber)]/50" />
                  <p className="text-[13px] text-[var(--color-text-1)] leading-relaxed">{insight}</p>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Pending on Arjun */}
        <motion.div variants={fadeUp} className="card p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-red-glow)] flex items-center justify-center">
              <Clock className="w-4 h-4 text-[var(--color-red)]" />
            </div>
            <h3 className="text-[14px] font-bold text-[var(--color-text-0)]">Pending on Arjun</h3>
            <span className="ml-auto pill bg-[var(--color-red-glow)] text-[var(--color-red)]">{briefing.pendingActions.length}</span>
          </div>
          <div className="space-y-2">
            {briefing.pendingActions.map(action => (
              <div key={action.id} className="flex items-start gap-3 px-4 py-3 rounded-xl bg-[var(--color-surface-3)] hover:bg-[var(--color-hover)] transition-all">
                {action.status === 'completed' ? (
                  <CheckCircle2 className="w-[18px] h-[18px] text-[var(--color-green)] mt-0.5 shrink-0" />
                ) : action.status === 'overdue' || action.status === 'at-risk' ? (
                  <AlertCircle className="w-[18px] h-[18px] text-[var(--color-red)] mt-0.5 shrink-0" />
                ) : (
                  <Clock className="w-[18px] h-[18px] text-[var(--color-amber)] mt-0.5 shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-[var(--color-text-0)]">{action.title}</p>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className={`pill ${
                      action.priority === 'critical' ? 'bg-[var(--color-red-glow)] text-[var(--color-red)]' :
                      action.priority === 'high' ? 'bg-[var(--color-amber-glow)] text-[var(--color-amber)]' :
                      'bg-[var(--color-blue-glow)] text-[var(--color-blue)]'
                    }`}>
                      <span className={`glow-dot ${
                        action.priority === 'critical' ? 'glow-dot-red' :
                        action.priority === 'high' ? 'glow-dot-amber' : 'glow-dot-blue'
                      }`} />
                      {action.priority}
                    </span>
                    <span className="text-[11px] text-[var(--color-text-3)]">{action.deadlineLabel}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Email Updates */}
        <motion.div variants={fadeUp} className="card p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-blue-glow)] flex items-center justify-center">
              <Mail className="w-4 h-4 text-[var(--color-blue)]" />
            </div>
            <h3 className="text-[14px] font-bold text-[var(--color-text-0)]">Email Updates</h3>
          </div>
          {briefing.emailUpdates.length === 0 ? (
            <div className="py-6 text-center text-sm text-[var(--color-text-3)] italic">No email updates</div>
          ) : (
            <div className="space-y-2">
              {briefing.emailUpdates.map((update, i) => (
                <div key={i} className="px-4 py-3 rounded-xl bg-[var(--color-surface-3)] text-[13px] text-[var(--color-text-1)] leading-relaxed">
                  {update}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
