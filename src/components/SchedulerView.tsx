import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Users, Check, Calendar } from 'lucide-react';
import { findFreeSlots, formatTime } from '../engine/scheduler';

const allPeople = ['Arjun Malhotra', 'Neha Kapoor', 'Raghav Sethi', 'Divya Rao'];
const fadeUp = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } };

export default function SchedulerView() {
  const [selectedPeople, setSelectedPeople] = useState<string[]>(['Arjun Malhotra']);
  const [duration, setDuration] = useState(30);

  const togglePerson = (name: string) => {
    setSelectedPeople(prev =>
      prev.includes(name) ? prev.filter(p => p !== name) : [...prev, name]
    );
  };

  const slots = findFreeSlots(selectedPeople, duration);

  return (
    <div className="space-y-6">
      {/* Config */}
      <div className="card p-6 space-y-5">
        <div>
          <label className="text-[10px] font-bold text-[var(--color-text-3)] uppercase tracking-widest flex items-center gap-1.5 mb-3">
            <Users className="w-3.5 h-3.5" /> Participants
          </label>
          <div className="flex flex-wrap gap-2">
            {allPeople.map(person => {
              const isSelected = selectedPeople.includes(person);
              return (
                <button
                  key={person}
                  onClick={() => togglePerson(person)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold border transition-all ${
                    isSelected
                      ? 'bg-[var(--color-brand-glow)] border-[var(--color-brand)]/40 text-[var(--color-brand-light)] shadow-sm shadow-[var(--color-brand)]/10'
                      : 'border-[var(--color-border-primary)] text-[var(--color-text-3)] hover:border-[var(--color-text-3)]'
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
          <label className="text-[10px] font-bold text-[var(--color-text-3)] uppercase tracking-widest flex items-center gap-1.5 mb-3">
            <Clock className="w-3.5 h-3.5" /> Minimum Duration
          </label>
          <div className="flex gap-1.5 p-1 bg-[var(--color-surface-3)] rounded-xl border border-[var(--color-border-primary)] w-fit">
            {[15, 30, 45, 60, 90].map(d => (
              <button
                key={d}
                onClick={() => setDuration(d)}
                className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-all ${
                  duration === d
                    ? 'bg-[var(--color-brand)] text-white shadow-lg shadow-[var(--color-brand)]/20'
                    : 'text-[var(--color-text-3)] hover:text-[var(--color-text-1)] hover:bg-[var(--color-hover)]'
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
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-brand-glow)] flex items-center justify-center">
            <Calendar className="w-4 h-4 text-[var(--color-brand-light)]" />
          </div>
          <h3 className="text-[14px] font-bold text-[var(--color-text-0)]">Available Slots</h3>
          <span className="pill bg-[var(--color-surface-4)] text-[var(--color-text-2)]">
            {slots.length} found • ≥{duration}min
          </span>
        </div>

        {selectedPeople.length === 0 ? (
          <div className="card p-12 text-center">
            <Users className="w-10 h-10 text-[var(--color-text-3)] mx-auto mb-3 opacity-30" />
            <p className="text-[14px] text-[var(--color-text-2)]">Select at least one participant</p>
          </div>
        ) : slots.length === 0 ? (
          <div className="card p-12 text-center">
            <Clock className="w-10 h-10 text-[var(--color-text-3)] mx-auto mb-3 opacity-30" />
            <p className="text-[14px] text-[var(--color-text-2)]">No available slots</p>
            <p className="text-[12px] text-[var(--color-text-3)] mt-1">Try reducing duration or fewer people</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {slots.map((slot, i) => (
              <motion.div
                key={`${slot.date}-${slot.startTime}`}
                variants={fadeUp}
                initial="hidden"
                animate="show"
                transition={{ delay: i * 0.03 }}
                className="card card-glow p-4"
              >
                <p className="text-[11px] text-[var(--color-text-3)] font-semibold">{slot.dayLabel}</p>
                <p className="text-[15px] font-bold text-[var(--color-text-0)] mt-1">
                  {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
                </p>
                <div className="flex items-center gap-1.5 mt-2">
                  <div className="glow-dot glow-dot-brand" />
                  <p className="text-[11px] text-[var(--color-brand-light)] font-medium">{slot.durationMinutes} minutes</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
