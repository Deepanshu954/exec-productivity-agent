import { useState } from 'react';
import { motion } from 'framer-motion';
import { calendarEvents, weekDays } from '../data/calendar';
import { formatTime } from '../engine/scheduler';

const people = ['Arjun Malhotra', 'Neha Kapoor', 'Raghav Sethi', 'Divya Rao'];
const personColors: Record<string, string> = {
  'Arjun Malhotra': 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300',
  'Neha Kapoor': 'bg-pink-500/20 border-pink-500/40 text-pink-300',
  'Raghav Sethi': 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300',
  'Divya Rao': 'bg-amber-500/20 border-amber-500/40 text-amber-300',
};
const dotColors: Record<string, string> = {
  'Arjun Malhotra': 'bg-indigo-400',
  'Neha Kapoor': 'bg-pink-400',
  'Raghav Sethi': 'bg-emerald-400',
  'Divya Rao': 'bg-amber-400',
};

export default function CalendarView() {
  const [selectedPeople, setSelectedPeople] = useState<string[]>(people);

  const togglePerson = (name: string) => {
    setSelectedPeople(prev =>
      prev.includes(name)
        ? prev.filter(p => p !== name)
        : [...prev, name]
    );
  };

  const filteredEvents = calendarEvents.filter(e => selectedPeople.includes(e.person));

  return (
    <div className="space-y-5">
      {/* People filter */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-[var(--color-text-muted)] mr-1">Show:</span>
        {people.map(person => {
          const isActive = selectedPeople.includes(person);
          return (
            <button
              key={person}
              onClick={() => togglePerson(person)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                isActive
                  ? personColors[person]
                  : 'border-[var(--color-border)] text-[var(--color-text-muted)] opacity-50 hover:opacity-75'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${isActive ? dotColors[person] : 'bg-[var(--color-text-muted)]'}`} />
              {person.split(' ')[0]}
            </button>
          );
        })}
      </div>

      {/* Week Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {weekDays.map((day, dayIndex) => {
          const dayEvents = filteredEvents
            .filter(e => e.date === day.date)
            .sort((a, b) => a.startTime.localeCompare(b.startTime));

          return (
            <motion.div
              key={day.date}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: dayIndex * 0.05 }}
              className="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-xl overflow-hidden"
            >
              <div className="px-4 py-3 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-hover)]">
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">{day.day}</p>
                <p className="text-xs text-[var(--color-text-muted)]">{day.date.split('-').slice(1).join('/')}</p>
              </div>
              <div className="p-2 space-y-1.5 min-h-[200px]">
                {dayEvents.length === 0 ? (
                  <p className="text-xs text-[var(--color-text-muted)] italic p-2 text-center">No events</p>
                ) : (
                  dayEvents.map((event, i) => (
                    <div
                      key={`${event.person}-${event.startTime}-${i}`}
                      className={`p-2 rounded-lg border text-xs transition-all ${
                        event.isBlocked
                          ? 'bg-[var(--color-surface)] border-[var(--color-border-subtle)] opacity-40'
                          : personColors[event.person] || 'bg-[var(--color-surface)] border-[var(--color-border)]'
                      }`}
                    >
                      <p className="font-medium truncate">
                        {event.isBlocked ? '🔒 Blocked' : event.event}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[10px] opacity-70">
                          {formatTime(event.startTime)}–{formatTime(event.endTime)}
                        </span>
                        {selectedPeople.length > 1 && (
                          <span className="text-[10px] opacity-60">
                            {event.person.split(' ')[0]}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
