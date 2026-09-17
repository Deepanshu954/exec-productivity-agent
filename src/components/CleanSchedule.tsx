import { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { api, type CalendarEventDto } from '../services/api';

const weekDays = [
  { dayDate: 'Mon 21 Sep', isoDate: '2026-09-21', title: 'Monday' },
  { dayDate: 'Tue 22 Sep', isoDate: '2026-09-22', title: 'Tuesday' },
  { dayDate: 'Wed 23 Sep', isoDate: '2026-09-23', title: 'Wednesday' },
  { dayDate: 'Thu 24 Sep', isoDate: '2026-09-24', title: 'Thursday' },
  { dayDate: 'Fri 25 Sep', isoDate: '2026-09-25', title: 'Friday' },
];

export default function CleanSchedule({ onAskAi }: { onAskAi?: (prompt: string) => void }) {
  const [events, setEvents] = useState<CalendarEventDto[]>([]);

  useEffect(() => {
    api.getCalendarEvents().then((evs) => {
      setEvents(evs.filter((e) => e.person.name === 'Arjun Malhotra'));
    }).catch(console.error);
  }, []);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--color-border-primary)] pb-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Executive Schedule & Conflict Radar</h2>
          <p className="text-xs text-[var(--color-text-2)] mt-0.5">
            Arjun Malhotra's weekly schedule (21–25 September 2026) with proactive collision detection.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/25">
            1 Thursday Double-Booking
          </span>
        </div>
      </div>

      {/* Critical Conflict Alert Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-red-500/15 via-red-950/20 to-[var(--color-surface-1)] border border-red-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-red-200">
              Thursday 9:30–10:00 AM Double-Booking Detected
            </h3>
            <p className="text-xs text-[var(--color-text-2)] mt-0.5 max-w-2xl">
              Board Prep Session (9:00–10:00 AM with Divya) directly collides with Neha's Deck Review (9:30–10:00 AM).
              <strong> Recommended Action:</strong> Neha delivered the draft deck early at 8:00 AM Thursday; review asynchronously to keep Board Prep uninterrupted.
            </p>
          </div>
        </div>

        {onAskAi && (
          <button
            onClick={() => onAskAi('How should I resolve my Thursday morning schedule conflict?')}
            className="px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 text-xs font-semibold shrink-0 transition-all"
          >
            Ask AI Advice
          </button>
        )}
      </div>

      {/* 5-Day Strip */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
        {weekDays.map((day) => {
          const dayEvents = events.filter((e) => e.dayDate === day.dayDate);

          return (
            <div
              key={day.isoDate}
              className={`p-4 rounded-2xl border flex flex-col ${
                day.dayDate === 'Thu 24 Sep'
                  ? 'bg-red-500/5 border-red-500/25'
                  : 'bg-[var(--color-surface-1)] border-[var(--color-border-primary)]'
              }`}
            >
              {/* Day Header */}
              <div className="flex items-center justify-between border-b border-[var(--color-border-primary)] pb-2 mb-3">
                <span className="text-xs font-bold text-white">{day.title}</span>
                <span className="text-[10px] text-[var(--color-text-3)]">{day.dayDate.split(' ')[1]} Sep</span>
              </div>

              {/* Event Cards */}
              <div className="space-y-2 flex-1">
                {dayEvents.length > 0 ? (
                  dayEvents.map((ev) => (
                    <div
                      key={ev.id}
                      className={`p-2.5 rounded-xl text-xs border ${
                        ev.hasConflict
                          ? 'bg-red-500/20 border-red-500/40 text-red-200'
                          : ev.blocked
                          ? 'bg-[var(--color-surface-2)]/40 border-transparent text-[var(--color-text-3)] opacity-60'
                          : 'bg-[var(--color-surface-2)] border-[var(--color-border-primary)] text-white'
                      }`}
                    >
                      <div className="font-semibold truncate">{ev.title}</div>
                      <div className="text-[10px] text-[var(--color-brand-light)] mt-0.5 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        <span>{ev.timeRange}</span>
                      </div>
                      {ev.hasConflict && (
                        <div className="text-[10px] text-red-400 font-bold mt-1">
                          Overlaps Deck Review!
                        </div>
                      )}
                      {ev.title.includes('Meridian') && (
                        <div className="text-[10px] text-emerald-400 font-medium mt-1">
                          Confirmed with Priya
                        </div>
                      )}
                      {ev.title.includes('Facilities') && (
                        <div className="text-[10px] text-amber-300 font-medium mt-1">
                          Mumbai Lease Sign-off
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-[11px] text-[var(--color-text-3)] italic py-2 text-center">
                    No meetings
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
