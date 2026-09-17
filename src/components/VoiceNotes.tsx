import { motion } from 'framer-motion';
import { Mic, Calendar, ArrowRight, Clock } from 'lucide-react';
import { voiceNotes } from '../data/voiceNotes';

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

const insights: Record<string, { commitments: string[]; concerns: string[] }> = {
  'vn-1': {
    commitments: ['Send Raghav the vendor list (awareness of delay — "might slip to tomorrow morning")'],
    concerns: ['Mumbai lease renewal — "someone needs to own that, I don\'t think it\'s me"'],
  },
  'vn-2': {
    commitments: [
      'Expense variance report from Divya must arrive by Wednesday evening (not Thursday)',
      'Meridian call — "I owe Priya a time, need to lock that in today"',
    ],
    concerns: [],
  },
};

const speakerColors: Record<string, string> = {
  'Arjun': 'text-indigo-400',
  'Neha': 'text-pink-400',
  'Raghav': 'text-emerald-400',
  'Divya': 'text-amber-400',
};

const transcript = [
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
];

export default function VoiceNotes() {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-5">
      {/* Intro */}
      <motion.div variants={fadeUp} className="card p-5 bg-gradient-to-r from-purple-500/5 to-transparent">
        <p className="text-[13px] text-[var(--color-text-1)] leading-relaxed">
          Personal voice memos recorded by Arjun Malhotra — dictated reminders, not messages to others.
          Treated as sources of Arjun's commitments and open items.
        </p>
      </motion.div>

      {/* Voice Notes */}
      {voiceNotes.map((note, i) => {
        const ins = insights[note.id];
        return (
          <motion.div key={note.id} variants={fadeUp} className="card overflow-hidden">
            <div className="flex items-center gap-3 px-5 sm:px-6 py-4 border-b border-[var(--color-border-primary)] bg-[var(--color-surface-3)]">
              <div className="p-2.5 rounded-xl bg-purple-500/15">
                <Mic className="w-5 h-5 text-purple-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-[13px] font-bold text-[var(--color-text-0)]">Voice Note {i + 1}</h3>
                <div className="flex items-center gap-3 mt-0.5 text-[11px] text-[var(--color-text-3)]">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{note.day}, Sep {note.date.split('-')[2]}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{note.time}</span>
                </div>
              </div>
              <span className="pill bg-purple-500/15 text-purple-300 border border-purple-500/25">{note.context}</span>
            </div>

            <div className="p-5 sm:p-6 space-y-5">
              <div>
                <p className="text-[10px] font-bold text-[var(--color-text-3)] uppercase tracking-widest mb-2.5">Transcript</p>
                <p className="text-[13px] text-[var(--color-text-1)] leading-relaxed italic pl-4 border-l-2 border-purple-500/30">
                  "{note.transcript}"
                </p>
              </div>

              {ins && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {ins.commitments.length > 0 && (
                    <div className="p-4 rounded-xl bg-[var(--color-green-glow)] border border-[var(--color-green)]/15">
                      <p className="text-[10px] font-bold text-[var(--color-green)] uppercase tracking-widest mb-2">📌 Commitments</p>
                      <ul className="space-y-2">
                        {ins.commitments.map((c, j) => (
                          <li key={j} className="flex items-start gap-2 text-[12px] text-[var(--color-text-1)]">
                            <ArrowRight className="w-3 h-3 mt-0.5 shrink-0 text-[var(--color-green)]" /> {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {ins.concerns.length > 0 && (
                    <div className="p-4 rounded-xl bg-[var(--color-amber-glow)] border border-[var(--color-amber)]/15">
                      <p className="text-[10px] font-bold text-[var(--color-amber)] uppercase tracking-widest mb-2">⚠️ Concerns</p>
                      <ul className="space-y-2">
                        {ins.concerns.map((c, j) => (
                          <li key={j} className="flex items-start gap-2 text-[12px] text-[var(--color-text-1)]">
                            <ArrowRight className="w-3 h-3 mt-0.5 shrink-0 text-[var(--color-amber)]" /> {c}
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
      <motion.div variants={fadeUp} className="card overflow-hidden">
        <div className="flex items-center gap-3 px-5 sm:px-6 py-4 border-b border-[var(--color-border-primary)] bg-[var(--color-surface-3)]">
          <div className="p-2.5 rounded-xl bg-blue-500/15">
            <Mic className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-[13px] font-bold text-[var(--color-text-0)]">Leadership Sync — Meeting Transcript</h3>
            <p className="text-[11px] text-[var(--color-text-3)]">Mon 21 Sep, 9:00–9:35 AM • Arjun, Neha, Raghav, Divya</p>
          </div>
        </div>
        <div className="p-5 sm:p-6 space-y-3">
          {transcript.map((seg, i) => (
            <div key={i} className="flex gap-3">
              <span className={`text-[11px] font-bold w-14 shrink-0 text-right pt-0.5 ${speakerColors[seg.speaker] || 'text-[var(--color-text-3)]'}`}>
                {seg.speaker}
              </span>
              <p className="text-[13px] text-[var(--color-text-1)] leading-relaxed">{seg.text}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
