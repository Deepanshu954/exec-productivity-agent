import { useState } from 'react';
import { motion } from 'framer-motion';
import { calendarEvents, weekDays } from '../data/calendar';
import { formatTime } from '../engine/scheduler';

const people = ['Arjun Malhotra', 'Neha Kapoor', 'Raghav Sethi', 'Divya Rao'];
const personThemes: Record<string, { bg: string; border: string; text: string; dot: string; tag: string }> = {
  'Arjun Malhotra': { bg: 'bg-indigo-500/10', border: 'border-indigo-500/25', text: 'text-indigo-300', dot: 'bg-indigo-400', tag: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' },
  'Neha Kapoor': { bg: 'bg-pink-500/10', border: 'border-pink-500/25', text: 'text-pink-300', dot: 'bg-pink-400', tag: 'bg-pink-500/20 text-pink-300 border-pink-500/30' },
  'Raghav Sethi': { bg: 'bg-emerald-500/10', border: 'border-emerald-500/25', text: 'text-emerald-300', dot: 'bg-emerald-400', tag: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  'Divya Rao': { bg: 'bg-amber-500/10', border: 'border-amber-500/25', text: 'text-amber-300', dot: 'bg-amber-400', tag: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
};

const fadeUp = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function CalendarView() {
  const [selectedPeople, setSelectedPeople] = useState<string[]>(people);

  const togglePerson = (name: string) => {
    setSelectedPeople(prev =>
      prev.includes(name) ? prev.filter(p => p !== name) : [...prev, name]
    );
  };

  const filteredEvents = calendarEvents.filter(e => selectedPeople.includes(e.person));

  return (
    <div className="space-y-6">
      {/* People filter */}
      <div className="flex flex-wrap items-center gap-2">
        {people.map(person => {
          const isActive = selectedPeople.includes(person);
          const theme = personThemes[person];
          return (
            <button
              key={person}
              onClick={() => togglePerson(person)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-semibold border transition-all ${
                isActive
                  ? `${theme.tag} border shadow-sm`
                  : 'border-[var(--color-border-primary)] text-[var(--color-text-3)] opacity-40 hover:opacity-70'
              }`}
            >
              <div className={`w-2.5 h-2.5 rounded-full transition-all ${isActive ? `${theme.dot} shadow-sm` : 'bg-[var(--color-text-3)]'}`}
                style={isActive ? { boxShadow: `0 0 6px currentColor` } : {}} />
              {person.split(' ')[0]}
            </button>
          );
        })}
      </div>

      {/* Week grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {weekDays.map((day, dayIndex) => {
          const dayEvents = filteredEvents
            .filter(e => e.date === day.date)
            .sort((a, b) => a.startTime.localeCompare(b.startTime));

          return (
            <motion.div
              key={day.date}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              transition={{ delay: dayIndex * 0.06, duration: 0.3 }}
              className="card overflow-hidden"
            >
              <div className="px-4 py-3 border-b border-[var(--color-border-primary)] bg-[var(--color-surface-3)]">
                <p className="text-[13px] font-bold text-[var(--color-text-0)]">{day.day}</p>
                <p className="text-[11px] text-[var(--color-text-3)]">Sep {day.date.split('-')[2]}</p>
              </div>
              <div className="p-2.5 space-y-1.5 min-h-[220px]">
                {dayEvents.length === 0 ? (
                  <p className="text-[11px] text-[var(--color-text-3)] italic p-3 text-center opacity-50">No events</p>
                ) : (
                  dayEvents.map((event, i) => {
                    const theme = personThemes[event.person];
                    return (
                      <div
                        key={`${event.person}-${event.startTime}-${i}`}
                        className={`p-2.5 rounded-lg border text-[11px] transition-all ${
                          event.isBlocked
                            ? 'bg-[var(--color-surface-3)]/40 border-[var(--color-border-primary)] opacity-30'
                            : `${theme.bg} ${theme.border} hover:scale-[1.02]`
                        }`}
                      >
                        <p className={`font-semibold truncate ${event.isBlocked ? 'text-[var(--color-text-3)]' : theme.text}`}>
                          {event.isBlocked ? '🔒 Blocked' : event.event}
                        </p>
                        <div className="flex items-center justify-between mt-1 text-[10px] opacity-70">
                          <span>{formatTime(event.startTime)}–{formatTime(event.endTime)}</span>
                          {selectedPeople.length > 1 && !event.isBlocked && (
                            <span>{event.person.split(' ')[0]}</span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
