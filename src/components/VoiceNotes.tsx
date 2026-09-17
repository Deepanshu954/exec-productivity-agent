import { motion } from 'framer-motion';
import { Mic, Calendar, ArrowRight, Clock } from 'lucide-react';
import { voiceNotes } from '../data/voiceNotes';

export default function VoiceNotes() {
  // Extracted insights from voice notes mapped to action items
  const voiceNoteInsights: Record<string, { commitments: string[]; concerns: string[] }> = {
    'vn-1': {
      commitments: [
        'Send Raghav the vendor list (awareness of delay — "might slip to tomorrow morning")',
      ],
      concerns: [
        'Mumbai lease renewal — "someone needs to own that, I don\'t think it\'s me"',
      ],
    },
    'vn-2': {
      commitments: [
        'Expense variance report from Divya must arrive by Wednesday evening (not Thursday)',
        'Meridian call — "I owe Priya a time, need to lock that in today"',
      ],
      concerns: [],
    },
  };

  return (
    <div className="space-y-5">
      {/* Intro */}
      <div className="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-xl p-4">
        <p className="text-sm text-[var(--color-text-secondary)]">
          Personal voice memos recorded by Arjun Malhotra — dictated reminders, not messages sent to others.
          These are treated as sources of Arjun's commitments and open items.
        </p>
      </div>

      {voiceNotes.map((note, i) => {
        const insights = voiceNoteInsights[note.id];
        return (
          <motion.div
            key={note.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-hover)]">
              <div className="p-2 rounded-lg bg-purple-500/15">
                <Mic className="w-5 h-5 text-purple-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
                  Voice Note {i + 1}
                </h3>
                <div className="flex items-center gap-3 mt-0.5 text-xs text-[var(--color-text-muted)]">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {note.day}, {note.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {note.time}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-medium text-purple-400 bg-purple-500/15 px-2 py-1 rounded-full">
                {note.context}
              </span>
            </div>

            {/* Transcript */}
            <div className="p-5 space-y-4">
              <div>
                <h4 className="text-xs font-semibold text-[var(--color-text-muted)] uppercase mb-2">Transcript</h4>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed italic">
                  "{note.transcript}"
                </p>
              </div>

              {/* Extracted Insights */}
              {insights && (
                <div className="space-y-3">
                  {insights.commitments.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-[var(--color-success)] uppercase mb-2">
                        📌 Extracted Commitments
                      </h4>
                      <ul className="space-y-1.5">
                        {insights.commitments.map((c, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-[var(--color-text-secondary)]">
                            <ArrowRight className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[var(--color-success)]" />
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {insights.concerns.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-[var(--color-warning)] uppercase mb-2">
                        ⚠️ Concerns Raised
                      </h4>
                      <ul className="space-y-1.5">
                        {insights.concerns.map((c, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-[var(--color-text-secondary)]">
                            <ArrowRight className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[var(--color-warning)]" />
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        );
      })}

      {/* Meeting Transcript */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-xl overflow-hidden"
      >
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-hover)]">
          <div className="p-2 rounded-lg bg-blue-500/15">
            <Mic className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Leadership Sync — Meeting Transcript</h3>
            <p className="text-xs text-[var(--color-text-muted)]">Mon 21 Sep, 9:00–9:35 AM • Arjun, Neha, Raghav, Divya</p>
          </div>
        </div>
        <div className="p-5 space-y-3">
          {[
            { speaker: 'Arjun', text: "Let's keep this quick. Neha, where are we on the Q3 campaign deck?" },
            { speaker: 'Neha', text: "Draft is 80% done. I'll send it to Arjun for review by Wednesday." },
            { speaker: 'Arjun', text: "Good. Also, remind me — I told Raghav I'd send him the updated vendor list. I'll get that to him by end of day tomorrow." },
            { speaker: 'Raghav', text: "Appreciated. Separately, the Mumbai office renewal paperwork needs someone to sign off this week. Not sure whose desk that's on right now." },
            { speaker: 'Divya', text: "I think that's supposed to be Facilities, but I haven't seen anyone pick it up." },
            { speaker: 'Arjun', text: "Okay, flag it, don't assume. Divya, can you also pull the July expense variance report before Thursday's board prep?" },
            { speaker: 'Divya', text: "Yes, I'll have it ready Wednesday evening." },
            { speaker: 'Arjun', text: "One more thing — client call with Meridian Logistics got pushed. I need to reconfirm the new time with their team myself." },
            { speaker: 'Neha', text: "Also, just a reminder, the campaign deck review — I said Wednesday, but realistically Thursday morning is safer." },
            { speaker: 'Arjun', text: "Noted. Let's close here." },
          ].map((segment, i) => {
            const colors: Record<string, string> = {
              'Arjun': 'text-indigo-400',
              'Neha': 'text-pink-400',
              'Raghav': 'text-emerald-400',
              'Divya': 'text-amber-400',
            };
            return (
              <div key={i} className="flex gap-3">
                <span className={`text-xs font-bold w-14 shrink-0 text-right ${colors[segment.speaker] || 'text-[var(--color-text-muted)]'}`}>
                  {segment.speaker}:
                </span>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  {segment.text}
                </p>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
