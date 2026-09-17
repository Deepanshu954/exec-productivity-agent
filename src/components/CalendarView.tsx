import { useState, useEffect } from 'react';
import { AlertTriangle, Calendar as CalendarIcon, ShieldAlert } from 'lucide-react';
import { api, type CalendarEventDto } from '../services/api';

const people = ['Arjun Malhotra', 'Neha Kapoor', 'Raghav Sethi', 'Divya Rao'];

const personThemes: Record<string, { bg: string; border: string; text: string; dot: string; tag: string }> = {
  'Arjun Malhotra': {
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/30',
    text: 'text-indigo-300',
    dot: 'bg-indigo-400',
    tag: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
  },
  'Neha Kapoor': {
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/30',
    text: 'text-pink-300',
    dot: 'bg-pink-400',
    tag: 'bg-pink-500/20 text-pink-300 border-pink-500/40',
  },
  'Raghav Sethi': {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    text: 'text-emerald-300',
    dot: 'bg-emerald-400',
    tag: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  },
  'Divya Rao': {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    text: 'text-amber-300',
    dot: 'bg-amber-400',
    tag: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  },
};

const weekDays = [
  { day: 'Mon', date: '2026-09-21', label: 'Mon 21 Sep' },
  { day: 'Tue', date: '2026-09-22', label: 'Tue 22 Sep' },
  { day: 'Wed', date: '2026-09-23', label: 'Wed 23 Sep' },
  { day: 'Thu', date: '2026-09-24', label: 'Thu 24 Sep' },
  { day: 'Fri', date: '2026-09-25', label: 'Fri 25 Sep' },
];

export default function CalendarView() {
  const [selectedPeople, setSelectedPeople] = useState<string[]>(people);
  const [events, setEvents] = useState<CalendarEventDto[]>([]);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const data = await api.getCalendarEvents();
      setEvents(data);
    } catch (e) {
      console.error('Failed to load calendar:', e);
    }
  };

  const togglePerson = (name: string) => {
    setSelectedPeople((prev) =>
      prev.includes(name) ? prev.filter((p) => p !== name) : [...prev, name]
    );
  };

  const filteredEvents = events.filter((e) => selectedPeople.includes(e.person?.name));

  return (
    <div className="space-y-6">
      {/* Critical Conflict Banner */}
      <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-start gap-3.5">
        <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-sm font-bold text-red-300">
            Calendar Conflict Detected: Thursday, 24 Sep (9:30–10:00 AM)
          </p>
          <p className="text-xs text-[var(--color-text-2)] leading-relaxed">
            Arjun's <strong>Board Prep Session</strong> (9:00–10:00 AM with Divya) overlaps with Neha's scheduled <strong>Deck Review with Arjun</strong> (9:30–10:00 AM).
            <br />
            <span className="text-emerald-400 font-semibold">Resolution:</span> Neha delivered the deck draft early on Thursday at 8:00 AM via email. Arjun can review asynchronously and keep the Board Prep session uninterrupted.
          </p>
        </div>
      </div>

      {/* People Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[var(--color-surface-1)] border border-[var(--color-border-primary)]">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-[var(--color-brand)]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-2)]">
            Team Calendars
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {people.map((person) => {
            const isActive = selectedPeople.includes(person);
            const theme = personThemes[person];
            return (
              <button
                key={person}
                onClick={() => togglePerson(person)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  isActive
                    ? `${theme.tag} shadow-sm`
                    : 'border-[var(--color-border-primary)] text-[var(--color-text-3)] opacity-40 hover:opacity-80'
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${isActive ? theme.dot : 'bg-[var(--color-text-3)]'}`}
                />
                {person === 'Arjun Malhotra' ? 'Arjun (You)' : person}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5-Day Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {weekDays.map((day) => {
          const dayEvents = filteredEvents
            .filter((e) => e.isoDate === day.date)
            .sort((a, b) => a.startTime.localeCompare(b.startTime));

          const hasConflictOnDay = dayEvents.some((e) => e.hasConflict);

          return (
            <div
              key={day.date}
              className={`flex flex-col rounded-2xl border p-4 bg-[var(--color-surface-1)] transition-all ${
                hasConflictOnDay
                  ? 'border-red-500/40 shadow-sm shadow-red-500/10'
                  : 'border-[var(--color-border-primary)]'
              }`}
            >
              {/* Day Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--color-border-primary)]">
                <div>
                  <p className="text-xs font-bold text-white">{day.label}</p>
                  <p className="text-[10px] text-[var(--color-text-3)]">{day.date}</p>
                </div>
                {hasConflictOnDay && (
                  <span className="p-1 rounded-md bg-red-500/20 text-red-400" title="Conflict on this day">
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>

              {/* Event Cards */}
              <div className="space-y-2 flex-1">
                {dayEvents.length === 0 ? (
                  <p className="text-[11px] text-[var(--color-text-3)] italic py-6 text-center">
                    No events
                  </p>
                ) : (
                  dayEvents.map((ev) => {
                    const theme = personThemes[ev.person?.name] || personThemes['Arjun Malhotra'];
                    return (
                      <div
                        key={ev.id}
                        className={`p-3 rounded-xl border text-xs transition-all ${
                          ev.hasConflict
                            ? 'bg-red-500/15 border-red-500/40 text-red-200'
                            : ev.blocked
                            ? 'bg-[var(--color-surface-2)]/60 border-[var(--color-border-primary)] opacity-40'
                            : `${theme.bg} ${theme.border} text-[var(--color-text-0)]`
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="font-bold truncate">{ev.title}</span>
                        </div>

                        <div className="flex items-center justify-between text-[10px] opacity-80">
                          <span>{ev.timeRange}</span>
                          <span className="font-semibold">{ev.person?.name?.split(' ')[0]}</span>
                        </div>

                        {ev.hasConflict && (
                          <div className="mt-1.5 pt-1 border-t border-red-500/30 text-[10px] text-red-300">
                            ⚠ Double-booked
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
