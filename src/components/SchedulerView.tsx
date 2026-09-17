import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Users, Check, Calendar } from 'lucide-react';
import { findFreeSlots, formatTime } from '../engine/scheduler';

const allPeople = ['Arjun Malhotra', 'Neha Kapoor', 'Raghav Sethi', 'Divya Rao'];

export default function SchedulerView() {
  const [selectedPeople, setSelectedPeople] = useState<string[]>(['Arjun Malhotra']);
  const [duration, setDuration] = useState(30);

  const togglePerson = (name: string) => {
    setSelectedPeople(prev =>
      prev.includes(name)
        ? prev.filter(p => p !== name)
        : [...prev, name]
    );
  };

  const slots = findFreeSlots(selectedPeople, duration);

  return (
    <div className="space-y-5">
      {/* Config */}
      <div className="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-xl p-5 space-y-4">
        <div>
          <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase flex items-center gap-1.5 mb-2">
            <Users className="w-3.5 h-3.5" /> Participants
          </label>
          <div className="flex flex-wrap gap-2">
            {allPeople.map(person => {
              const isSelected = selectedPeople.includes(person);
              return (
                <button
                  key={person}
                  onClick={() => togglePerson(person)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                    isSelected
                      ? 'bg-[var(--color-accent-subtle)] border-[var(--color-accent)] text-[var(--color-accent)]'
                      : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-text-muted)]'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                  {person}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase flex items-center gap-1.5 mb-2">
            <Clock className="w-3.5 h-3.5" /> Minimum Duration
          </label>
          <div className="flex gap-2">
            {[15, 30, 45, 60, 90].map(d => (
              <button
                key={d}
                onClick={() => setDuration(d)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  duration === d
                    ? 'bg-[var(--color-accent)] text-white'
                    : 'bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]'
                }`}
              >
                {d}m
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-4 h-4 text-[var(--color-accent)]" />
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
            Available Slots
          </h3>
          <span className="text-xs text-[var(--color-text-muted)]">
            ({slots.length} found for {selectedPeople.length} {selectedPeople.length === 1 ? 'person' : 'people'}, ≥{duration}min)
          </span>
        </div>

        {selectedPeople.length === 0 ? (
          <div className="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-xl p-8 text-center">
            <Users className="w-8 h-8 text-[var(--color-text-muted)] mx-auto mb-2" />
            <p className="text-sm text-[var(--color-text-muted)]">Select at least one participant</p>
          </div>
        ) : slots.length === 0 ? (
          <div className="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-xl p-8 text-center">
            <Clock className="w-8 h-8 text-[var(--color-text-muted)] mx-auto mb-2" />
            <p className="text-sm text-[var(--color-text-muted)]">No available slots found</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Try reducing duration or selecting fewer people</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {slots.map((slot, i) => (
              <motion.div
                key={`${slot.date}-${slot.startTime}`}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-xl p-4 hover:border-[var(--color-accent)]/30 transition-all"
              >
                <p className="text-xs text-[var(--color-text-muted)] font-medium">{slot.dayLabel}</p>
                <p className="text-sm font-semibold text-[var(--color-text-primary)] mt-1">
                  {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
                </p>
                <p className="text-xs text-[var(--color-accent)] mt-1.5">{slot.durationMinutes} minutes available</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
